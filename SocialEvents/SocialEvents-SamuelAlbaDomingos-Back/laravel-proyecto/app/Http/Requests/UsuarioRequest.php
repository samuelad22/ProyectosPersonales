<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsuarioRequest extends FormRequest
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
        return [
            "nombreCompleto" => "required|string",
            "nombreUsuario" => "required|string",
            "email" => "required|email",
            "localidadResidencia" => "required|string",
            "password" => "required|string|min:8",
            "passwordConfirmation" => "required|string|min:8",
            "intereses" => "nullable|array",
        ];
    }
}
