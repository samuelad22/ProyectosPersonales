<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActualizarUserRequest;
use App\Http\Resources\BaneoResource;
use App\Http\Resources\UserDetalleResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\UsuarioListaResource;
use App\Mail\Registro;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UsuarioRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{


    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }
        if($user->estado == 1) {
            return response()->json(['error' => 'Su cuenta ha sido vetada permanentemente'], 402);
        }
        else if ( $user->estado == 2 && $user->vetadoHasta > now()){
            return response()->json(['error'=> 'Su cuenta ha sido vetada temporalmente'], 402);
        }
        $user->estado = 0;
        $user->vetadoHasta = null;
        $user->motivoVeto = null;
        if ($user->rol->nombre == "admin") {
            $tokenBasico = $user->createToken('token-basico', ['crear-evento', 'administrar-usuarios', 'administrar-tags', 'administrar-categorias', 'administrar-pagos', 'gestionar-entradas']);
        } 
        
        else {
            $tokenBasico = $user->createToken('token-basico', ['crear-evento']);
        }
        return ['token' => $tokenBasico->plainTextToken, 'id' => $user->id, 'nombreUsuario' => $user->nombreUsuario, 'estado'=> $user->estado, 'rol'=> $user->id==1 ? 'admin':'usuario'];
    }

    public function store(UsuarioRequest $request)
    {
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['mensaje' => 'Este correo ya esta registrado'], 422);
        }
        if (User::where('nombreUsuario', $request->nombreUsuario)->exists()) {
            return response()->json(['mensaje' => 'Este nombre de usuario ya esta registrado'], 422);
        }
        if ($request->password !== $request->passwordConfirmation) {
            return response()->json(['error' => 'Las contraseñas no coinciden'], 401);
        }
        $usuario = User::create([
            'nombreCompleto' => $request->nombreCompleto,
            'nombreUsuario' => $request->nombreUsuario,
            'email' => $request->email,
            'localidadResidencia' => $request->localidadResidencia,
            'password' => Hash::make($request->password),
            'estado' => 0, //Usuario habilitado
            'rol_id'=> 1 //Usuario con permisos base
        ]);
        foreach ($request->intereses as $interes) {
            $tagBuscado = Tag::where('slug', Str::slug($interes))->first();
            if (!$tagBuscado) {
                $tagBuscado = Tag::create(['nombre' => ucfirst($interes), 'slug' => Str::slug($interes)]);
            }
            DB::insert('INSERT INTO intereses (user_id, tag_id) VALUES (?, ?)', [$usuario->id, $tagBuscado->id]);
        }

        $usuario->tokens()->delete();
        $tokenBasico = $usuario->createToken('token-basico', ['crear-evento']);

        $usuario->save();
        Mail::to($usuario->email)->send(new Registro($usuario));
        return response()->json(['token' => $tokenBasico->plainTextToken, 'id' => $usuario->id, 'nombreUsuario' => $usuario->nombreUsuario], 201);
    }


    public function show(Request $request)
    {
        return new UserDetalleResource($request->user());
    }


    public function update(ActualizarUserRequest $request)
    {
        $usuario = $request->user();
        if ($usuario->estado != 0) {
            return response()->json(['mensaje' => "Debido a tu sancion no puedes editar tu cuenta"], 403);
        }
        if ($usuario->email != $request->email && User::where('email', $request->email)->first()) {
            return response()->json(['mensaje' => 'Este correo eletronico ya esta en uso'], 422);
        } else if ($usuario->nombreUsuario != $request->nombreUsuario && User::where('nombreUsuario', $request->nombreUsuario)->first()) {
            return response()->json(['mensaje' => 'Este nombre de usuario ya esta en uso'], 422);
        }
        $usuario->update($request->all());

        $usuario->intereses()->detach();
        foreach ($request->intereses as $interes) {
            $tagBuscado = Tag::where('slug', Str::slug($interes))->first();
            if (!$tagBuscado) {
                $tagBuscado = Tag::create(['nombre' => ucfirst($interes), 'slug' => Str::slug($interes)]);
            }
            DB::insert('INSERT INTO intereses (user_id, tag_id) VALUES (?, ?)', [$usuario->id, $tagBuscado->id]);
        }
        if ($usuario->id == 1) {
            $tokenBasico = $usuario->createToken('token-basico', ['crear-evento', 'administrar-usuarios']);
        } else {
            $tokenBasico = $usuario->createToken('token-basico', ['crear-evento']);
        }
        return ['token' => $tokenBasico->plainTextToken, 'id' => $usuario->id, 'nombreUsuario' => $usuario->nombreUsuario, 'rol'=> $usuario->id==1 ? 'admin':'usuario'];
    }
    public function listarUsuarios(Request $request)
{
    $usuariosPaginados = User::paginate(18);

    return response()->json([
        'data' => [
            'numeroUsuarios'             => User::count(),
            'numeroUsuariosActivos'      => User::where('estado', 0)->count(),
            'numeroUsuariosDesactivados' => User::whereIn('estado', [1, 2])->count(),
            'usuarios'                   => UsuarioListaResource::collection($usuariosPaginados),
            'hayMas'                     => $usuariosPaginados->hasMorePages(),
            'paginaActual'               => $usuariosPaginados->currentPage(),      
        ]
    ]);
}
public function recomendarUsuario(Request $request) {
    $usuario = User::where('nombreUsuario','LIKE', $request->nombre .'%')->first();
        if(!$usuario) return response()->json(["mensaje"=>"No se encontro ningun usuario"], 400);
        return new UserResource($usuario);
}

    public function vetarCuentaTemporalmente(Request $request) {
        $usuario= User::where('email', $request->email)->first();
        $usuario->estado = 2;
        $usuario->vetadoHasta = $request->fechaLimiteVeto;
        $usuario->motivoVeto = $request->motivoVeto;
        $usuario->save();
        return response()->json(['mensaje'=>'Se he vetado la cuenta correctamente hasta '. $request->fechaLimiteVeto], 201);
    }
     public function vetarCuentaPermanentemente(Request $request) {
        $usuario= User::where('email', $request->email)->first();
        $usuario->estado = 1;
        $usuario->motivoVeto = $request->motivoVeto;
        $usuario->save();
        return response()->json(['mensaje'=>'Se ha vetado la cuenta correctamente'], 201);
    }
    public function eliminarVeto(Request $request) {
        $usuario= User::where('email', $request->email)->first();
        $usuario->estado = 0;
        $usuario->motivoVeto = null;
        $usuario->vetadoHasta = null;
        $usuario->save();
        return response()->json(['mensaje'=>'Se ha quitado correctamente el veto'], 201);
    }
    public function buscarPorNombre(Request $request)
    {
        $eventos = User::where('nombreUsuario', 'LIKE', '%' . $request->nombreUsuario . '%')->paginate(5);
        return UsuarioListaResource::collection($eventos);
    }

    public function comprobarVeto(Request $request) {
        $user = $request->user();
        if($user->estado == 0) {
            return response()->json(['mensaje'=> 'Tu usuario esta disponible'],200);
        }
        else {
            return response()->json(["mensaje"=> "Tu usuario ha sido sancionado"],400);
        }
    }
    public function informacionUsuarioBaneado(Request $request) {
        $user = $request->user();
        return new BaneoResource($user);
    }

}
