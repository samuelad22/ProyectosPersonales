<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ChatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'usuarios' => $this->usuarios
                ->values()
                ->map(fn($u) => [
                    'id' => $u->id,
                    'nombreUsuario' => $u->nombreUsuario,
                ]),
            'ultimoMensaje' => $this->whenLoaded('ultimoMensaje', fn() => [
                'contenido' => $this->ultimoMensaje->contenido,
                'visto' => Auth::user()->id == $this->ultimoMensaje->remitente_id ? 1 : $this->ultimoMensaje->leido
            ]),
        ];
    }
}
