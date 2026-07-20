<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run(): void
    {
        $tags = [
            
            ['nombre' => 'Hip Hop', 'slug' => 'hip-hop'],
            ['nombre' => 'Rap', 'slug' => 'rap'],
            ['nombre' => 'Trap', 'slug' => 'trap'],
            ['nombre' => 'Reggaeton', 'slug' => 'reggaeton'],
            ['nombre' => 'R&B', 'slug' => 'r-b'],
            ['nombre' => 'Beatbox', 'slug' => 'beatbox'],
            ['nombre' => 'DJ Set', 'slug' => 'dj-set'],
            ['nombre' => 'Música en Vivo', 'slug' => 'musica-en-vivo'],
            
            ['nombre' => 'Freestyle', 'slug' => 'freestyle'],
            ['nombre' => 'Batalla de Gallos', 'slug' => 'batalla-de-gallos'],
            ['nombre' => 'MC Battle', 'slug' => 'mc-battle'],
            ['nombre' => 'Improvisación', 'slug' => 'improvisacion'],
            
            ['nombre' => 'Skateboarding', 'slug' => 'skateboarding'],
            ['nombre' => 'BMX', 'slug' => 'bmx'],
            ['nombre' => 'Parkour', 'slug' => 'parkour'],
            ['nombre' => 'Breaking', 'slug' => 'breaking'],
            ['nombre' => 'Street Basketball', 'slug' => 'street-basketball'],
            ['nombre' => 'Patinaje', 'slug' => 'patinaje'],
            
            ['nombre' => 'Graffiti', 'slug' => 'graffiti'],
            ['nombre' => 'Street Art', 'slug' => 'street-art'],
            ['nombre' => 'Muralismo', 'slug' => 'muralismo'],
            ['nombre' => 'Arte Urbano', 'slug' => 'arte-urbano'],
            ['nombre' => 'Intervención Urbana', 'slug' => 'intervencion-urbana'],
            
            ['nombre' => 'Underground', 'slug' => 'underground'],
            ['nombre' => 'Cultura Callejera', 'slug' => 'cultura-callejera'],
            ['nombre' => 'Open Mic', 'slug' => 'open-mic'],
            ['nombre' => 'Jam Session', 'slug' => 'jam-session'],
            ['nombre' => 'Block Party', 'slug' => 'block-party'],
            ['nombre' => 'Showcase', 'slug' => 'showcase'],
            ['nombre' => 'Cypher', 'slug' => 'cypher'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
