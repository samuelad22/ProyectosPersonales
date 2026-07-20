<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MensajeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "remitenteId"=> $this->remitente_id,
            "contenido"=> $this->contenido,
            "leido"=> $this->leido,
            "fecha"=> $this->created_at->format('d/m/Y'),
            "hora"=> $this->created_at->format("H:i"),
            "nombreUsuarioRemitente" => User::findOrFail($this->remitente_id)->nombreUsuario
        ];
    }
}
