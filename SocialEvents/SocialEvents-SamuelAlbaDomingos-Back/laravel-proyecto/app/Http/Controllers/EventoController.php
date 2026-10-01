<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActualizarEventoRequest;
use App\Http\Requests\CrearEventoRequest;
use App\Http\Resources\EventoDineroGeneradoResource;
use App\Http\Resources\EventoResource;
use App\Http\Resources\EventoDetalleResource;
use App\Mail\BorrarEvento;
use App\Mail\EventoCreado;
use App\Models\Categoria;
use App\Models\Evento;
use App\Models\Tag;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class EventoController extends Controller
{

    public function index()
    {
        $eventos = Evento::with('categoria')->orderBy('aforoActual')->paginate(21);
        return EventoResource::collection($eventos);
    }
    public function buscarPorNombre(Request $request)
    {
        $eventos = Evento::where('nombre', 'LIKE', '%' . $request->nombre . '%')->paginate(21);
        return EventoResource::collection($eventos);
    }

    public function buscarPorCategoria(string $categoria)
    {
        $eventos = Evento::where('categoria_id', "=", Categoria::where('nombre', '=', $categoria)->value('id'))->paginate(21);
        return EventoResource::collection($eventos);
    }
    public function obtenerEventoPorCreador(Request $request)
    {
        $eventos = Evento::where('creador_id', "=", $request->creador_id)->get();
        return EventoResource::collection($eventos);
    }
    public function show(Request $request)
    {
        $evento = Evento::findOrFail($request->id);
        return new EventoDetalleResource($evento);
    }

    public function store(CrearEventoRequest $request)
    {
        $user = Auth::user()->id;
        if (User::findOrFail($user)->estado != 0) {
            return response()->json(['error' => 'Cuenta suspendida'], 403);
        }
        if (Evento::where("slug", Str::slug($request->nombre))->first()) {
            return response()->json(['mensaje' => 'El nombre del evento no esta disponible, cambie el nombre del evento'], 400);
        }

        $evento = DB::transaction(function () use ($request, $user) {
            $evento = new Evento();
            $evento->nombre = ucwords($request->nombre);
            $evento->slug = Str::slug($request->nombre);
            $evento->ubicacion = $request->ubicacion;
            $evento->aforoMaximo = $request->aforoMaximo;
            $evento->fechaInicio = $request->fechaInicio;
            $evento->fechaFin = $request->fechaFin;
            $evento->creador_id = $user;
            $evento->horaInicio = $request->horaInicio;
            $evento->horaFin = $request->horaFin;
            $evento->descripcion = $request->descripcion;
            $evento->creadorPaypal = Auth::user()->email;
            $evento->precio = $request->precio;
            $evento->categoria_id = Categoria::where('nombre', '=', $request->categoria)->value('id');
            if ($request->hasFile('imagen')) {
                $nombreArchivo = Str::slug($request->nombre)
                    . '.'
                    . $request->file('imagen')->getClientOriginalExtension();
                $request->file('imagen')->storeAs('imagenes', $nombreArchivo, 'public');
                $evento->imagen = 'imagenes/' . $nombreArchivo;
            }

            $evento->save();

            foreach ((array) $request->input('tags', []) as $tag) {
                $tagBuscado = Tag::where('slug', Str::slug($tag))->first();
                if (!$tagBuscado) {
                    $tagBuscado = Tag::create(['nombre' => ucfirst($tag), 'slug' => Str::slug($tag)]);
                }
                DB::insert('INSERT INTO evento_tag (evento_id, tag_id) VALUES (?, ?)', [$evento->id, $tagBuscado->id]);
            }
            Mail::to(User::find($user)->email)->send(new EventoCreado($evento));
            return $evento;
        });

        return response()->json($evento, 201);
    }

    public function update(ActualizarEventoRequest $request)
    {
        $user = $request->user();
        if ($user->estado != 0) {
            return response()->json(['error' => 'Cuenta suspendida'], 403);
        }
        $evento = Evento::findOrFail($request->evento_id);
        $imagen = $evento->imagen;
        if ($evento->creador_id != $user->id && $user->rol->nombre != "admin") {
            return response()->json(['error' => 'No estás autorizado para editar este evento'], 403);
        }

        if ($request->filled('precio')) {
            $evento->precio = $request->precio;
        }

        $evento->horaFin = $request->horaFin && $request->horaFin != "" ? $request->horaFin : null;

        if ($request->filled('categoria')) {
            $categoria = Categoria::where('nombre', $request->categoria)->first();
            if ($categoria) {
                $evento->categoria_id = $categoria->id;
            }
        }

        $evento->save();
        $evento->update($request->except('imagen'));

        if ($request->filled('tags')) {
            $evento->tags()->detach();
            $tags = $request->input('tags', []);
            foreach ($tags as $tag) {
                $tagBuscado = Tag::where('slug', Str::slug($tag))->first();
                if (!$tagBuscado) {
                    $tagBuscado = Tag::create(['nombre' => ucfirst($tag), 'slug' => Str::slug($tag)]);
                }
                DB::insert('INSERT INTO evento_tag (evento_id, tag_id) VALUES (?, ?)', [$evento->id, $tagBuscado->id]);
            }
        }

        if ($request->hasFile('imagen')) {

            try {
                unlink(storage_path('app/public/' . $imagen));
            } catch (\Exception $e) {
            }

            $nombreArchivo = Str::slug($request->nombre)
                . '.'
                . $request->file('imagen')->getClientOriginalExtension();

            $request->file('imagen')->storeAs('imagenes', $nombreArchivo, 'public');

            $evento->imagen = 'imagenes/' . $nombreArchivo;
            $evento->save();
        }

        return new EventoResource($evento);
    }


    public function destroy(Request $request)
    {
        $evento = Evento::findOrFail($request->evento_id);
        $authUser = $request->user();
        if ($authUser->estado != 0) {
            return response()->json(['error' => 'Cuenta suspendida'], 403);
        }

        if ($authUser->id == $evento->creador_id || $authUser->rol->nombre == "admin") {
            $urlBase = "https://api-m.sandbox.paypal.com";

            foreach ($evento->inscripciones as $inscripcion) {
                Mail::to($inscripcion->email)->send(new BorrarEvento($evento));
                if ($inscripcion->paypalToken) {
                    try {
                        $tokenPaypal = $this->getToken();
                        Http::withToken($tokenPaypal)
                            ->withBody('{}', 'application/json')
                            ->post($urlBase . "/v2/payments/captures/{$inscripcion->paypalToken}/refund");
                    } catch (Exception $e) {
                    }
                }
            }

            foreach (DB::table('cola_espera')->where('evento_id', $evento->id)->get() as $entrada) {
                Mail::to($entrada->email)->send(new BorrarEvento($evento));
                if ($entrada->paypalToken) {
                    try {
                        $tokenPaypal = $this->getToken();
                        Http::withToken($tokenPaypal)
                            ->withBody('{}', 'application/json')
                            ->post($urlBase . "/v2/payments/captures/{$entrada->paypalToken}/refund");
                    } catch (Exception $e) {
                    }
                }
            }

            $evento->valoraciones()->delete();
            $evento->inscripciones()->delete();
            DB::table('cola_espera')->where('evento_id', $evento->id)->delete();

            $nombreArchivo = basename($evento->imagen);
            try {
                unlink(public_path('storage/imagenes/' . $nombreArchivo));
            } catch (Exception $e) {
            } finally {

                $evento->delete();
                return response()->json('Se borro el evento correctamente', 201);
            }
            ;

        } else {
            return response()->json(['error' => 'No tienes permiso para borrar este evento'], 403);
        }

    }
    public function obtenerPorEtiquetas(Request $request)
    {
        $tags = (array) $request->input('tags', []);
        $eventos = Evento::whereHas('tags', fn($consulta) => $consulta->whereIn('nombre', $tags))->get();
        return EventoResource::collection($eventos);
    }
    public function obtenerPorEtiquetasCategorias(Request $request)
    {
        $tags = (array) $request->input('tags', []);
        $categoria_id = $request->categoria_id;
        $eventos = Evento::
            whereHas(
                'tags',
                fn($consulta) => $consulta->whereIn('nombre', $tags)
            )->where(
                'categoria_id',
                '=',
                $categoria_id
            )

            ->get();

        return EventoResource::collection($eventos);
    }

    public function misEventos(Request $request)
    {
        $usuario = $request->user();
        $eventos = Evento::where('creador_id', "=", $usuario->id)->get();
        return EventoResource::collection($eventos);
    }
    public function carrusel()
    {
        $eventos = Evento::where('fechaInicio', '>=', today())->whereColumn('aforoActual', '<', 'aforoMaximo')->orderBy('fechaInicio', 'asc')->limit(10)->get();
        return EventoResource::collection($eventos);
    }

    public function eventosPagosPendientes(){
        $eventos = Evento::where('dineroGenerado', '>', 0)
            ->orderByDesc('fechaInicio')
            ->paginate(21);
        return EventoDineroGeneradoResource::collection($eventos);
    }

    public function cambiarEstadoPago(Request $request){
        $evento = Evento::findOrFail($request->eventoId);
        $evento->estadoPago = !$evento->estadoPago;
        $evento->save();
        return response()->json(["mensaje"=>"Se actualizo el estado correctamente"], 200);
    }

    public function filtrar(Request $request)
    {
        $eventos = Evento::query()
            ->when($request->categoria, function ($q) use ($request) {
                $q->where('categoria_id', $request->categoria);
            })
            ->when($request->ubicacion, function ($q) use ($request) {
                $q->where('ubicacion', 'like', '%' . $request->ubicacion . '%');
            })
            ->when($request->fechaInicio, function ($q) use ($request) {
                $q->where('fechaInicio', '>=', $request->fechaInicio);
            })
            ->when($request->fechaFin, function ($q) use ($request) {
                $q->where('fechaFin', '<=', $request->fechaFin);
            })
            ->when($request->creador, function ($q) use ($request) {
                $usuario = User::where('nombreUsuario', $request->creador)->first();
                if ($usuario) {
                    $q->where('creador_id', $usuario->id);
                }
            })
            ->when($request->tags, function ($q) use ($request) {
                $tags = (array) $request->input('tags', []);
                $q->whereHas('tags', function ($q2) use ($tags) {
                    $q2->whereIn('nombre', $tags);
                });
            })
            ->paginate(21);

        return EventoResource::collection($eventos);
    }

    public function filtrarEventosPagar(Request $request){
        $eventos = Evento::query()
            ->when($request->estadoPago, function ($q) use ($request){
                $q->where('estadoPago', $request->estadoPago-1);
                //no se envia directamente 0/1 en la peticion debido a que el 0 lo interpreta como null
            })
            ->when($request->nombreEvento && $request->nombreEvento != "", function($q) use ($request) {
                $q->where('nombre', 'like', '%'. $request->nombreEvento. '%');
            })
            ->when($request->creadorPaypal && $request->creadorPaypal != "", function($q) use ($request){
                $q->where('creadorPaypal', 'like', '%'. $request->creadorPaypal. '%');
            })
            ->when($request->fechaFin && $request->fechaFin != "", function ($q) use ($request){
                $q->where('fechaFin', '<', $request->fechaFin);
            })
            ->get();
        return EventoDineroGeneradoResource::collection($eventos);
    }

    public function getToken(): string
    {
        $urlBase = "https://api-m.sandbox.paypal.com/";
        $response = Http::withBasicAuth(
            config("services.paypal.client_id"),
            config("services.paypal.client_secret")
        )->asForm()->post($urlBase . "v1/oauth2/token", [
                    'grant_type' => "client_credentials"
                ]);
        return $response->json('access_token');
    }

}
