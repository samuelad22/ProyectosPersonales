<?php

namespace App\Http\Controllers;

use App\Events\MensajeLeido;
use App\Http\Resources\ChatsResource;
use App\Http\Resources\MensajeResource;
use App\Models\Conversacion;
use App\Models\Mensaje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Events\MensajeEnviado;
use Illuminate\Support\Facades\Auth;



class ConversacionController extends Controller
{
    public function enviarMensaje(Request $request)
    {
        $request->validate([
            "contenido" => "required|string",
            "destinatarios" => "required|array",
        ]);

        $destinatarios = $request->destinatarios;

        $conversacion = Conversacion::whereHas('usuarios', function ($q) use ($destinatarios) {
            $q->whereIn('user_id', $destinatarios);
        }, '=', count($destinatarios))
            ->has('usuarios', '=', count($destinatarios))
            ->first();

        if (!$conversacion || $conversacion == null) {
            $conversacion = Conversacion::create();
            DB::insert("INSERT INTO conversacion_usuario (conversacion_id, user_id) VALUES (?,?)", [$conversacion->id, $request->user()->id]);
            if (count($destinatarios) > 0 && $destinatarios[0] != $request->user()->id) {
                foreach ($request->destinatarios as $destinatario) {
                    if ($destinatario != $request->user()->id) {
                        DB::insert("INSERT INTO conversacion_usuario (conversacion_id, user_id) VALUES (?,?)", [$conversacion->id, $destinatario]);
                    }
                }
            }
        } else {
            $conversacion = Conversacion::findOrFail($conversacion->id);
            if (!$conversacion->usuarios->contains($request->user()->id)) {
                return response()->json(["mensaje" => "no tienes permiso para acceder a este chat"], 403);
            }
        }
        $conversacion->updated_at = now();
        $conversacion->save();
        $mensaje = new Mensaje();
        $mensaje->conversacion_id = $conversacion->id;
        $mensaje->remitente_id = $request->user()->id;
        $mensaje->contenido = $request->contenido;
        $mensaje->leido = false;
        $mensaje->save();

        Log::info('Broadcasting mensaje enviado', [
            'mensaje_id' => $mensaje->id,
            'conversacion_id' => $mensaje->conversacion_id,
            'remitente_id' => $mensaje->remitente_id,
        ]);

        broadcast(new MensajeEnviado($mensaje));

        Log::info('Broadcast completado', ['mensaje_id' => $mensaje->id]);

        return response()->json([
            "conversacion_id" => $conversacion->id,
            "mensaje" => new MensajeResource($mensaje)
        ], 201);
    }

    public function obtenerConversacionesPorUsuario(Request $request)
    {
        $conversaciones = Conversacion::with(['usuarios', 'ultimoMensaje'])
            ->whereHas('usuarios', function ($q) {
                $q->where('user_id', Auth::user()->id);
            })
            ->orderByDesc('updated_at')
            ->get();
        if (!$conversaciones) {
            return response()->json(["mensaje" => "No hay conversaciones"], 201);
        }
        return ChatsResource::collection($conversaciones);
    }
    public function obtenerConversacionDetalle(Request $request)
    {
        $destinatarios = array_unique($request->destinatarios);
        $conversacion = Conversacion::whereHas('usuarios', function ($q) use ($destinatarios) {
            $q->whereIn('user_id', $destinatarios);
        }, '=', count($destinatarios))
            ->has('usuarios', '=', count($destinatarios))
            ->first();

        if (!$conversacion) {
            return response()->json(["mensaje" => "No existe esta conversacion"], 403);
        }

        $mensajes = Mensaje::where('conversacion_id', $conversacion->id)
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();
        return MensajeResource::collection($mensajes);
    }
    public function marcarLeido(Request $request)
    {
        $user = Auth::user();
        Mensaje::where('conversacion_id', $request->conversacion_id)
            ->where('remitente_id', '!=', $user->id)
            ->where('leido', false)
            ->update(['leido' => true]);

        broadcast(new MensajeLeido($request->conversacion_id, $user->id));
        return response()->json(['mensaje' => 'Mensajes marcados como leídos'], 200);
    }

    public function mensajesNoLeidos()
    {
        $notificaciones = Mensaje::where('leido', 0)
            ->where('remitente_id', '!=', Auth::user()->id)
            ->whereIn('conversacion_id', function ($q) {
                $q->select('conversacion_id')
                    ->from('conversacion_usuario')
                    ->where('user_id', Auth::user()->id);
            })
            ->count();
        return response()->json(['numeroNotificaciones'=> $notificaciones], 200);
    }
}
