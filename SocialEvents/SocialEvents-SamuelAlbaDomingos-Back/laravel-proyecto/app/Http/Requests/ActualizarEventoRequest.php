<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActualizarEventoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $metodo = $this->method();

        if ($metodo == 'PUT') {
            return [
                'evento_id' => 'required|integer',
                'creador_id'=> 'required|integer',
                'nombre' => 'required|string|max:255',
                'ubicacion' => 'required|string',
                'aforoMaximo' => 'required|integer|min:1',
                'fechaInicio' => 'required|date',
                'horaInicio' => 'required|date_format:H:i',
                'descripcion' => 'required|string',
                'categoria' => 'required|string|exists:categorias,nombre',
                'tags' => 'required|array',
            ];
        } else {
            return [
                'evento_id' => 'required|integer',
                'creador_id'=> 'required|integer',
                'nombre' => 'sometimes|string|max:255',
                'ubicacion' => 'sometimes|string',
                'aforoMaximo' => 'sometimes|integer|min:1',
                'fechaInicio' => 'sometimes|date',
                'horaInicio' => 'sometimes|date_format:H:i',
                'descripcion' => 'sometimes|string',
                'categoria' => 'sometimes|string|exists:categorias,nombre',
                'tags' => 'sometimes|array',
            ];
        }
    }
}
