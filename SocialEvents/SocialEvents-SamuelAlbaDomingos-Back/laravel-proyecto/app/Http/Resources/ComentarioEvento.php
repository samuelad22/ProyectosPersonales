<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComentarioEvento extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'comentario' => $this->comentario_id,
            'evento_id' => [
                'id'=> $this->evento->id,
                'nombre'=> $this->evento->nombre
            ]
            
        ];
    }
}
