<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarUserRequest extends FormRequest
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
                "nombreCompleto" => "required|string",
                "nombreUsuario" => "required|string",
                "email" => "required|email",
                "localidadResidencia" => "required|string",
                "intereses" => "required|array",

            ];
        }
        else {
            return [
                "nombreCompleto" => "sometimes|string",
                "nombreUsuario" => "sometimes|string",
                "email" => "sometimes|email|unique:users,email",
                "localidadResidencia" => "sometimes|string",
                "intereses" => "sometimes|array",
            ];
        }
    }
}
