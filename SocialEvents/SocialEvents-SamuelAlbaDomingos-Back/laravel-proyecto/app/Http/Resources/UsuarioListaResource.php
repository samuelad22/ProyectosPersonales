<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioListaResource extends JsonResource
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
            "nombreCompleto" => $this->nombreCompleto,
            "nombreUsuario" => $this->nombreUsuario,
            "email" => $this->email,
            "localidadResidencia" => $this->localidadResidencia,
            'intereses' => $this->intereses->pluck('nombre'),
            'estado'=> $this->estado
        ];
    }
}
