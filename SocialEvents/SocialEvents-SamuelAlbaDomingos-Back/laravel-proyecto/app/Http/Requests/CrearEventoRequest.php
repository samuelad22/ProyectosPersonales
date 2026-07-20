<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CrearEventoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'ubicacion' => 'required|string|max:255',
            'aforoMaximo' => 'required|integer|min:1',
            'fechaInicio' => 'required|date|after:today',
            'fechaFin' => 'nullable|date|after_or_equal:fechaInicio',
            'horaInicio' => 'required|date_format:H:i',
            'horaFin' => 'nullable|date_format:H:i',
            'imagen' => 'required|image|mimes:jpeg,png,jpg',
            'descripcion' => 'nullable|string',
            'categoria' => 'required|string|exists:categorias,nombre',
            'tags' => 'nullable|array',
        ];
    }
}
