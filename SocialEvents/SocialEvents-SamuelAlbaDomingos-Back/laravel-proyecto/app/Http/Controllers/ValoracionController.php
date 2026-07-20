<?php

namespace App\Http\Controllers;

use App\Http\Resources\ComentarioResource;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\ValoracionRequest;
use App\Models\Valoracion;


class ValoracionController extends Controller
{
    public function valorar(Request $request)
    {
        $user = $request->user();
        if ($user->estado != 0) {
            return response()->json(['mensaje' => "Debido a tu sancion no puedes valorar este evento"], 403);
        }
        $valoracion = Valoracion::where('user_id', $user->id)
            ->where('evento_id', $request->evento_id)
            ->first();

        if ($valoracion) {
            $valoracion->update($request->only(['puntuacion', 'contenido']));
        } else {
            $valoracion = Valoracion::create([
                'user_id' => $user->id,
                'evento_id' => $request->evento_id,
                'fecha' => now()->toDateString(),
                'puntuacion' => $request->puntuacion ?? null,
                'contenido' => $request->contenido ?? "",
            ]);
        }

        return response()->json($valoracion->fresh(), 200);

    }

    public function preguntarEventoValorado(Request $request)
    {
        $user = $request->user();
        if (Valoracion::where('user_id', $user->id)->where("evento_id", $request->evento_id)->exists()) {

            $valoracion = Valoracion::where('user_id', $user->id)->where('evento_id', $request->evento_id)->first();
            return response()->json(['puntuacion' => $valoracion->puntuacion], 200);
        } else {
            return response()->json(['puntuacion' => 0], 200);
        }
    }
    public function obtenerComentariosPorCreador(Request $request)
    {
        $usuario = User::where('email', $request->email)->first();
        $historialValoraciones = Valoracion::where('user_id', $usuario->id)->where('contenido', '!=', 'null')->where('contenido', '!=', '')->get();
        return ComentarioResource::collection($historialValoraciones);
    }
    public function borrarComentario(Request $request)
    {
        $usuario = $request->user();
        $comentario = Valoracion::findOrFail($request->comentario_id);
        if ($comentario->user_id == $usuario->id || $usuario->id == 1) {
            $comentario->contenido = null;
            $comentario->save();
        }
        else {
            return response()->json(["mensaje"=> "no tienes permiso para borrar este comentario"], 404);
        }
        return response()->json(["mensaje"=> "se borro el comentario correctamente"], 201);
    }
}
