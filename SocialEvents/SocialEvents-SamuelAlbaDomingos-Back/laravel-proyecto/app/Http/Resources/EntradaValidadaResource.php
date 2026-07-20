<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EntradaValidadaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "numeroPersonas"=> $this->acompañantes + 1,
            "emailAsociado"=> $this->email,
            "usuario"=>[
                "id"=>$this->user->id,
                "nombre"=>$this->user->nombreCompleto,
                "email"=>$this->user->email
            ],
            "evento"=> [
                "id"=>$this->evento->id,
                "nombre"=>$this->evento->nombre,
                "categoria"=> [
                    "nombre"=>$this->evento->categoria->nombre,
                    "color"=>$this->evento->categoria->color
                ]
            ],
        ];
    }
}
