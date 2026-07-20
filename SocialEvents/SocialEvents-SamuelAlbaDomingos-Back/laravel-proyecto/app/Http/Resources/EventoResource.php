<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'nombre'=> $this->nombre,
            'imagen'=> $this->imagen ? asset('storage/' . $this->imagen) : null,
            'ubicacion'=>$this->ubicacion,
            'fechaInicio'=>$this->fechaInicio,
            'aforoMaximo'=> $this->aforoMaximo,
            'categoria'   => [          
            'id'     => $this->categoria?->id,
            'nombre' => $this->categoria?->nombre,
            'slug'=>$this->categoria?->slug,
            'color'=> $this->categoria?->color
        ],
        ];
    }
}
