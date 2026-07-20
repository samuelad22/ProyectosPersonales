<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class EventoDetalleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'imagen' => $this->imagen ? asset('storage/' . $this->imagen) : null,
            'ubicacion' => $this->ubicacion,
            'fechaInicio' => $this->fechaInicio,
            'aforoMaximo' => $this->aforoMaximo,
            'aforoActual' => $this->aforoActual,
            'fechaFin' => $this->fechaFin,
            'horaInicio' => \Carbon\Carbon::parse($this->horaInicio)->format('H:i'),
            'horaFin' => $this->horaFin ? \Carbon\Carbon::parse($this->horaFin)->format('H:i') : null,
            'descripcion' => $this->descripcion,
            'creador' => User::find($this->creador_id)->nombreUsuario,
            'precio' => $this->precio,
            'tags' => $this->tags->pluck('nombre'),
            'categoria' => [
                'id' => $this->categoria?->id,
                'nombre' => $this->categoria?->nombre,
                'color' => $this->categoria?->color
            ],
            'comentarios' => $this->valoraciones->map(function ($valoracion) {
                return [
                    'id' => $valoracion->id,
                    'fecha' => $valoracion->fecha,
                    'contenido' => $valoracion->contenido,
                    'usuario' => User::find($valoracion->user_id)->nombreUsuario,
                    'creador_id' => $valoracion->user_id
                ];
            }),
            'puntuacionMedia' => $this->valoraciones->avg('puntuacion'),
        ];
    }
}
