<?php

namespace App\Http\Resources;

use App\Models\Categoria;
use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoriaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $eventosAsociados = Evento::where('categoria_id', Categoria::where('nombre', $request->categoria)->value('id'))->get();
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion'=>$this->descripcion,
            'color'=> $this->color
        ];
    }
}
