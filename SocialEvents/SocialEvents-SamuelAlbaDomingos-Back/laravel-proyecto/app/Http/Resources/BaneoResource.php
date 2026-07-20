<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BaneoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "nombre"=> $this->nombre,
            "motivo_veto"=> $this->motivoVeto,
            "vetado_hasta"=> $this->vetadoHasta,
        ];
    }
}
