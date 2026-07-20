<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComentarioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
        "id" => $this->id,
        "comentario" => $this->contenido,
        "fechaPublicacion" => $this->fecha,
        'evento' => [
                'id'=> $this->evento->id,
                'nombre'=> $this->evento->nombre
            ]
        ];
    }
}
