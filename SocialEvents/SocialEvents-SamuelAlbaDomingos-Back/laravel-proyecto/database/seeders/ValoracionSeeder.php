<?php

namespace Database\Seeders;
use App\Models\Valoracion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ValoracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $valoraciones =  [['user_id' => 1, 'evento_id' => 1, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Increíble ambiente, los MCs estuvieron al nivel más alto. Repetiría sin dudarlo.'],
    ['user_id' => 1, 'evento_id' => 2, 'puntuacion' => 4, 'fecha' => now(), 'contenido' => 'Buena noche, el DJ estuvo brutal. Solo le faltó más espacio en la pista.'],
    ['user_id' => 1, 'evento_id' => 4, 'puntuacion' => 4, 'fecha' => now(), 'contenido' => 'Ambiente underground muy auténtico. Los beats que compartieron eran fuego.'],
    ['user_id' => 1, 'evento_id' => 6, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Los writers dejaron el muro espectacular. Arte urbano en estado puro.'],
    ['user_id' => 1, 'evento_id' => 9, 'puntuacion' => 4, 'fecha' => now(), 'contenido' => 'Aprendí técnicas de stencil que no conocía. Los materiales de calidad.'],
    ['user_id' => 1, 'evento_id' => 10, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'El open mic me sorprendió, hay talento emergente brutal en la ciudad.'],
    ['user_id' => 1, 'evento_id' => 12, 'puntuacion' => 4, 'fecha' => now(), 'contenido' => 'Aprendí mucho en poco tiempo, el instructor fue muy didáctico.'],
    ['user_id' => 1, 'evento_id' => 14, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Los trucos de los skaters fueron alucinantes. El mejor evento de skate que he visto.'],
    ['user_id' => 1, 'evento_id' => 15, 'puntuacion' => 4, 'fecha' => now(), 'contenido' => 'Muy competitivo, buen nivel general. El halftime show de freestyle increíble.'],
    ['user_id' => 1, 'evento_id' => 16, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Los saltos que hicieron fueron alucinantes. Nunca había visto nada igual.'],

    ['user_id' => 2, 'evento_id' => 1, 'puntuacion' => 4, 'fecha' => now(), 'contenido' => 'Gran batalla, el público empujó mucho. Volveré el año que viene.'],
    ['user_id' => 2, 'evento_id' => 2, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Las visuales del escenario eran una locura. Noche inolvidable.'],
    ['user_id' => 2, 'evento_id' => 4, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Vibra única, espero el Vol. 4 pronto. Gran nivel de los MCs emergentes.'],
    ['user_id' => 2, 'evento_id' => 6, 'puntuacion' => 3, 'fecha' => now(), 'contenido' => 'Estuvo bien pero hubiera preferido más variedad de estilos.'],
    ['user_id' => 2, 'evento_id' => 9, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Taller muy completo, aprendí técnicas nuevas que no conocía.'],
    ['user_id' => 2, 'evento_id' => 10, 'puntuacion' => 4, 'fecha' => now(), 'contenido' => 'Gran plataforma para talentos emergentes. Ambiente íntimo y muy buena vibra.'],
    ['user_id' => 2, 'evento_id' => 12, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Instructor muy paciente, las piezas que salieron fueron increíbles.'],
    ['user_id' => 2, 'evento_id' => 14, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Espectáculo total, los pros estuvieron a un nivel increíble.'],
    ['user_id' => 2, 'evento_id' => 15, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Ambiente increíble, volveré el año que viene sin dudarlo.'],
    ['user_id' => 2, 'evento_id' => 16, 'puntuacion' => 5, 'fecha' => now(), 'contenido' => 'Espectáculo puro de principio a fin. Los talleres también muy bien.'],
];
        foreach ($valoraciones as $valoracion) {
            Valoracion::create($valoracion);
        }
    }
}
