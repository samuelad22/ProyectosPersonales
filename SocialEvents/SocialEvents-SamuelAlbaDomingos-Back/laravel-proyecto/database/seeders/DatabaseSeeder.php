<?php

namespace Database\Seeders;

use App\Models\User;
use Categoria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(TagSeeder::class);
        $this->call(RolSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(CategoriaSeeder::class);
        $this->call(EventoSeeder::class);
        $this->call(ValoracionSeeder::class);
    }
}
