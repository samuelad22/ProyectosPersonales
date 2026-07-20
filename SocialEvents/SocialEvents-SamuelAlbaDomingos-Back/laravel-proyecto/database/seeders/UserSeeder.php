<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        /**
         * Este quiero que sea el usuario administrador, por eso se fuerza que el id sea uno
         * para otorgar luego las habilidades necesarias mediante el id. No se espera necesitar mas de un administrador.
         */
        User::create([
            'id' => 1,
            'nombreCompleto' => 'Samuel Alba Domingos',
            'nombreUsuario' => 'sad',
            'email' => 'samuel@example.com',
            'localidadResidencia' => 'Madrid',
            'password' => Hash::make('1234'),
            'estado' => 0,
            'rol_id' =>2
            
        ]);
        DB::insert(
            '
            INSERT INTO intereses (user_id, tag_id) VALUES (1, 1)
            '
        );


        User::create([
            'nombreCompleto' => 'maria García López',
            'nombreUsuario' => 'maria_garcia',
            'email' => 'maria@example.com',
            'localidadResidencia' => 'Barcelona',
            'password' => Hash::make('1234'),
            'estado' => 0,
            'rol_id' =>3
        ]);
     
        DB::insert(
            '
            INSERT INTO intereses (user_id, tag_id) VALUES (2, 2)
            '
        );
        User::create([
            'nombreCompleto' => 'leire García López',
            'nombreUsuario' => 'leire_garcia',
            'email' => 'leire@example.com',
            'localidadResidencia' => 'Galicia',
            'password' => Hash::make('1234'),
            'estado' => 0,
            'rol_id' =>1
        ]);
     
        DB::insert(
            '
            INSERT INTO intereses (user_id, tag_id) VALUES (3, 3)
            '
        );
        User::create([
            'nombreCompleto' => 'lucas García López',
            'nombreUsuario' => 'lucas_garcia',
            'email' => 'lucas@example.com',
            'localidadResidencia' => 'Galicia',
            'password' => Hash::make('1234'),
            'estado' => 0,
            'rol_id' =>1
        ]);
     
        DB::insert(
            '
            INSERT INTO intereses (user_id, tag_id) VALUES (4, 4)
            '
        );
        User::create([
            'nombreCompleto' => 'emilio García López',
            'nombreUsuario' => 'emilio_garcia',
            'email' => 'emilio@example.com',
            'localidadResidencia' => 'Galicia',
            'password' => Hash::make('1234'),
            'estado' => 0,
            'rol_id' =>1
        ]);
     
        DB::insert(
            '
            INSERT INTO intereses (user_id, tag_id) VALUES (5, 5)
            '
        );
        User::create([
            'nombreCompleto' => 'pablo García López',
            'nombreUsuario' => 'pablo_garcia',
            'email' => 'pablo@example.com',
            'localidadResidencia' => 'Galicia',
            'password' => Hash::make('1234'),
            'estado' => 0,
            'rol_id' =>1
        ]);
     
        DB::insert(
            '
            INSERT INTO intereses (user_id, tag_id) VALUES (6, 6)
            '
        );
        User::create([
            'nombreCompleto' => 'diego García López',
            'nombreUsuario' => 'diego_garcia',
            'email' => 'diego@example.com',
            'localidadResidencia' => 'Galicia',
            'password' => Hash::make('1234'),
            'estado' => 0,
            'rol_id' =>1
        ]);
     
        DB::insert(
            '
            INSERT INTO intereses (user_id, tag_id) VALUES (7, 7)
            '
        );
        User::create([
            'nombreCompleto' => 'laura García López',
            'nombreUsuario' => 'laura_garcia',
            'email' => 'laura@example.com',
            'localidadResidencia' => 'Galicia',
            'password' => Hash::make('1234'),
            'estado' => 0,
            'rol_id' =>1
        ]);
     
        DB::insert(
            '
            INSERT INTO intereses (user_id, tag_id) VALUES (8, 8)
            '
        );
        User::create([
            'nombreCompleto' => 'mario García López',
            'nombreUsuario' => 'mario_garcia',
            'email' => 'mario@example.com',
            'localidadResidencia' => 'Galicia',
            'password' => Hash::make('1234'),
            'estado' => 0,
            'rol_id' =>1
        ]);
     
        DB::insert(
            '
            INSERT INTO intereses (user_id, tag_id) VALUES (9, 9)
            '
        );
        $nombres = [
            'skater_gijón',
            'freestyle_master',
            'graffiti_king',
            'bmx_rider',
            'breakdance_pro',
            'urban_soul',
            'street_art_gijón',
            'mural_painter',
            'hip_hop_dancer',
            'astur_skate',
            'neon_writer',
            'spray_art',
            'concrete_jungle',
            'flow_rider',
        ];

        foreach ($nombres as $i => $nombre) {
            User::create([
                'nombreUsuario' => $nombre,
                'nombreCompleto' => 'Usuario ' . ($i + 1),
                'email' => $nombre . '@example.com',
                'password' => Hash::make('1234'),
                'localidadResidencia' => 'Gijón',
                'estado' => 0,
                'rol_id' =>1
            ]);
     
            }
    }
}
