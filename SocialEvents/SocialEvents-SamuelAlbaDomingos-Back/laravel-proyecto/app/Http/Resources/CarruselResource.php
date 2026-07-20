<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarruselResource extends JsonResource
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
            "imagen" => $this->imagen ? asset('storage/' . $this->imagen) : null,
            "id"=>$this->id
        ];
    }
}
