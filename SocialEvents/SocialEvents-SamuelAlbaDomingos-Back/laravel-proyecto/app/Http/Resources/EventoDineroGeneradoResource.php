<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventoDineroGeneradoResource extends JsonResource
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
            "nombre"=> $this->nombre,
            "dineroGenerado"=> $this->dineroGenerado,
            "imagen" => $this->imagen ? asset('storage/' . $this->imagen) : null,
            "creador" => User::findOrFail($this->creador_id)->nombreUsuario,
            "emailPaypal" => $this->creadorPaypal,
            "aforoActual" => $this->aforoActual,
            "fechaInicio"=> $this->fechaInicio,
            "estadoPago"=> $this->estadoPago,
            'categoria' => [
                'color' => $this->categoria?->color
            ],
        ];
    }
}
