<?php

namespace App\Http\Resources;

use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserDetalleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "nombreCompleto" => $this->nombreCompleto,
            "nombreUsuario" => $this->nombreUsuario,
            "email" => $this->email,
            "localidadResidencia" => $this->localidadResidencia,
            "eventosCreados" => EventoResource::collection(Evento::where('creador_id', $this->id)->get()),
            "numeroEventosCreados" => Evento::where('creador_id', $this->id)->count(),
            "eventosInscrito" => EventoResource::collection(auth()->user()->eventos),
            "numeroEventosInscrito" => auth()->user()->eventos()->count(),
            'intereses' => $this->intereses->pluck('nombre'),
     
        ];
    }
}
