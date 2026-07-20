<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ["nombre" => "usuario", "descripcion"=> "Usuario plano con permisos unicamente de usuarioo autenticado"],
            ["nombre"=> "admin", "descripcion"=> "Usuario administrador con permisos para cualquier clase de accion"],
            ["nombre"=>"controlAccesos", "descripcion"=> "Usuario plano, pero con permisos base mas la posibilidad de escanear codigos QR para dar acceso a un evento"]
        ];

        foreach($roles as $rol) {
            $r= new Rol();
            $r->nombre = $rol["nombre"];
            $r->descripcion = $rol["descripcion"];
            $r->save();
        }
    }
}
