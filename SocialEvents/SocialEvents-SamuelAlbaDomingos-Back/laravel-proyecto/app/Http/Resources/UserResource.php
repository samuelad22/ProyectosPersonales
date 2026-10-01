<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'nombre' => $this->nombreUsuario,
            'nombreCompleto' => $this->nombreCompleto,
            'nombreUsuario' => $this->nombreUsuario,
            'rol' => $this->rol,
            'intereses' => $this->intereses,
            'imagen' => $this->imagen,
            'localidadResidencia' => $this->localidadResidencia,
        ];
    }
}
