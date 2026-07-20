<?php

namespace Database\Seeders;

use App\Models\Evento;
use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class EventoSeeder extends Seeder
{
    public function run(): void
    {
        $eventos = [
    [
        'nombre' => 'Batalla de Gallos',
        'ubicacion' => 'Plaza del Marqués, Gijón, Asturias, España',
        'aforoMaximo' => 500,
        'aforoActual' => 0,
        'fechaInicio' => '2027-01-10',
        'fechaFin' => '2027-01-10',
        'horaInicio' => '20:00:00',
        'horaFin' => '23:30:00',
        'descripcion' => 'La mejor batalla de freestyle de la ciudad. MCs locales y nacionales compitiendo en épicas batallas de improvisación. Entrada libre, ambiente 100% callejero.',
        'categoria_id' => 3,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [1, 5, 9, 13, 17],

    ],
    [
        'nombre' => 'Noche de Trap y Reggaeton',
        'ubicacion' => 'Calle Cabrales 14, Gijón, Asturias, España',
        'aforoMaximo' => 800,
        'aforoActual' => 0,
        'fechaInicio' => '2025-02-14',
        'fechaFin' => '2025-02-14',
        'horaInicio' => '22:00:00',
        'horaFin' => '04:00:00',
        'descripcion' => 'Los mejores exponentes del trap y reggaeton en una noche inolvidable. DJs invitados, visuales increíbles y la mejor vibra urbana.',
        'categoria_id' => 3,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [2, 6, 10, 14, 18],

    ],
    [
        'nombre' => 'Hip Hop Block Party',
        'ubicacion' => 'Parque del Rinconín, Gijón, Barcelona, España',
        'aforoMaximo' => 1500,
        'aforoActual' => 0,
        'fechaInicio' => '2026-04-10',
        'fechaFin' => '2026-04-10',
        'horaInicio' => '16:00:00',
        'horaFin' => '22:00:00',
        'descripcion' => 'Festival de hip hop al aire libre con conciertos en vivo, batallas de breakdance, food trucks y zona de graffiti.',
        'categoria_id' => 3,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [3, 7, 11, 15, 19],
    ],

    [
        'nombre' => 'Cypher Sessions Vol. 3',
        'ubicacion' => 'Calle Corrida 22, Gijón, Asturias, España',
        'aforoMaximo' => 150,
        'aforoActual' => 0,
        'fechaInicio' => '2025-03-05',
        'fechaFin' => '2025-03-05',
        'horaInicio' => '19:00:00',
        'horaFin' => '22:00:00',
        'descripcion' => 'Sesión íntima de rap y beatbox. Open mic para MCs emergentes, productores compartiendo beats y mucha improvisación.',
        'categoria_id' => 3,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [4, 8, 12, 16, 20],

    ],
    [
        'nombre' => 'Festival R&B Soul Night',
        'ubicacion' => 'Teatro Jovellanos, Paseo de Begoña, Gijón, Asturias, España',
        'aforoMaximo' => 600,
        'aforoActual' => 0,
        'fechaInicio' => '2027-05-05',
        'fechaFin' => '2027-05-05',
        'horaInicio' => '21:00:00',
        'horaFin' => '00:00:00',
        'descripcion' => 'Una noche dedicada al R&B y soul contemporáneo. Artistas nacionales e internacionales en un show íntimo y elegante.',
        'categoria_id' => 3,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [1, 4, 8, 15, 20],

    ],
    [
        'nombre' => 'Jam de Graffiti Primavera 2026',
        'ubicacion' => 'Muro Legal, Avenida Revolución',
        'aforoMaximo' => 300,
        'aforoActual' => 0,
        'fechaInicio' => '2026-04-23',
        'fechaFin' => '2026-05-20',
        'horaInicio' => '10:00:00',
        'horaFin' => '18:00:00',
        'descripcion' => 'Jornada de graffiti con writers de toda la ciudad. Intervenciones en vivo, demostración de técnicas, venta de aerosoles y merchandising.',
        'categoria_id' => 1,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [2, 5, 11, 17, 19],
        

    ],
    [
        'nombre' => 'Exposición Street Art Contemporáneo',
        'ubicacion' => 'Avenida de la Costa, Gijón, Asturias, España',
        'aforoMaximo' => 200,
        'aforoActual' => 0,
        'fechaInicio' => '2027-04-01',
        'fechaFin' => '2027-04-30',
        'horaInicio' => '11:00:00',
        'horaFin' => '20:00:00',
        'descripcion' => 'Muestra de arte urbano en galería. Obras de los mejores exponentes del street art local.',
        'categoria_id' => 1,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [3, 6, 12, 16, 18],
    ],
    [
        'nombre' => 'Festival de Muralismo Urbano',
        'ubicacion' => 'Centro Cultural Antiguo Instituto, Plaza del 6 de Agosto 8',
        'aforoMaximo' => 1000,
        'aforoActual' => 0,
        'fechaInicio' => '2026-05-15',
        'fechaFin' => '2026-05-17',
        'horaInicio' => '09:00:00',
        'horaFin' => '19:00:00',
        'descripcion' => 'Tres días de muralismo en vivo. Artistas locales e internacionales transformando fachadas del barrio.',
        'categoria_id' => 1,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [4, 7, 13, 15, 20],

    ],
    [
        'nombre' => 'Noche de Stencil y Paste-Up',
        'ubicacion' => 'Laboral Ciudad de la Cultura,  Gijón, Asturias, España',
        'aforoMaximo' => 80,
        'aforoActual' => 0,
        'fechaInicio' => '2025-02-20',
        'fechaFin' => '2025-02-20',
        'horaInicio' => '18:00:00',
        'horaFin' => '22:00:00',
        'descripcion' => 'Taller práctico de técnicas de stencil y paste-up. Aprende de los maestros del arte urbano. Materiales incluidos.',
        'categoria_id' => 1,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [1, 6, 10, 14, 19],

    ],
    [
        'nombre' => 'Open Mic Noche Urbana',
        'ubicacion' => 'Cimavilla, Gijón, Asturias, España',
        'aforoMaximo' => 180,
        'aforoActual' => 0,
        'fechaInicio' => '2027-01-25',
        'fechaFin' => '2027-01-25',
        'horaInicio' => '20:00:00',
        'horaFin' => '23:30:00',
        'descripcion' => 'Noche de micrófono abierto para artistas emergentes. Rap, R&B, soul y spoken word.',
        'categoria_id' => 3,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [2, 8, 12, 16, 20],

    ],
    [
        'nombre' => 'Intervención Urbana Colectiva',
        'ubicacion' => 'Calle Palacio Valdés, Gijón, Asturias, España',
        'aforoMaximo' => 500,
        'aforoActual' => 0,
        'fechaInicio' => '2027-06-01',
        'fechaFin' => '2027-06-01',
        'horaInicio' => '12:00:00',
        'horaFin' => '20:00:00',
        'descripcion' => 'Intervención artística participativa. Instalaciones urbanas, performance, live painting y actividades para toda la familia.',
        'categoria_id' => 1,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [2, 7, 9, 16, 20],

    ],
    [
        'nombre' => 'Taller de Lettering Urbano',
        'ubicacion' => 'Calle San Bernardo, Gijón, Asturias, España',
        'aforoMaximo' => 120,
        'aforoActual' => 0,
        'fechaInicio' => '2025-06-05',
        'fechaFin' => '2025-06-05',
        'horaInicio' => '10:00:00',
        'horaFin' => '14:00:00',
        'descripcion' => 'Aprende las bases del lettering urbano con artistas consagrados. Desde bocetos hasta la pieza final.',
        'categoria_id' => 1,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [3, 5, 10, 14, 18],

    ],
    [
        'nombre' => 'Torneo de Fútbol Sala Callejero',
        'ubicacion' => 'Parque de Isabel la Católica, Gijón, Asturias, España',
        'aforoMaximo' => 300,
        'aforoActual' => 0,
        'fechaInicio' => '2027-06-14',
        'fechaFin' => '2027-06-15',
        'horaInicio' => '10:00:00',
        'horaFin' => '20:00:00',
        'descripcion' => 'Torneo de fútbol sala urbano con equipos de toda la ciudad. Ambiente festivo, DJ en directo entre partidos.',
        'categoria_id' => 2,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [1, 6, 11, 15, 19],

    ],
    [
        'nombre' => 'Competencia de Skateboarding Pro',
        'ubicacion' => 'Skatepark Municipal, Zona Norte',
        'aforoMaximo' => 600,
        'aforoActual' => 0,
        'fechaInicio' => '2025-03-25',
        'fechaFin' => '2025-03-26',
        'horaInicio' => '10:00:00',
        'horaFin' => '18:00:00',
        'descripcion' => 'Dos días de competencia profesional de skateboarding. Categorías amateur y pro. Premios en efectivo.',
        'categoria_id' => 2,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [3, 5, 11, 13, 18],

    ],
    [
        'nombre' => 'Torneo Street Basketball 3x3',
        'ubicacion' => 'Centro Cultural Antiguo Instituto, Gijón, Asturias, España',
        'aforoMaximo' => 400,
        'aforoActual' => 0,
        'fechaInicio' => '2027-05-10',
        'fechaFin' => '2027-05-11',
        'horaInicio' => '09:00:00',
        'horaFin' => '17:00:00',
        'descripcion' => 'Torneo de basketball 3x3 estilo callejero. Equipos locales compitiendo por el título.',
        'categoria_id' => 2,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [4, 6, 12, 17, 19],

    ],
    [
        'nombre' => 'Exhibición de Parkour y Freerunning',
        'ubicacion' => 'Explanada Urbana, Distrito Comercial',
        'aforoMaximo' => 800,
        'aforoActual' => 0,
        'fechaInicio' => '2025-07-18',
        'fechaFin' => '2025-07-18',
        'horaInicio' => '16:00:00',
        'horaFin' => '20:00:00',
        'descripcion' => 'Los mejores traceurs del país en una exhibición espectacular. Demostraciones de parkour y talleres introductorios.',
        'categoria_id' => 2,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [1, 8, 10, 15, 20],

    ],
    [
        'nombre' => 'Batalla de Breaking',
        'ubicacion' => 'Pabellón de Danza Urbana',
        'aforoMaximo' => 350,
        'aforoActual' => 0,
        'fechaInicio' => '2027-05-20',
        'fechaFin' => '2027-05-20',
        'horaInicio' => '18:00:00',
        'horaFin' => '23:00:00',
        'descripcion' => 'Batalla internacional de breaking con B-boys y B-girls de élite. Categorías 1vs1 y crew.',
        'categoria_id' => 2,
        'creador_id' => 1,
        'dineroGenerado' => 50,
        'tags' => [2, 9, 13, 16, 18],

    ],
];


        foreach ($eventos as $evento) {
            $e = new Evento();
            $tags = $evento['tags'];
            $e->nombre = $evento['nombre'];
            $e->slug = Str::slug($evento['nombre']);
            $e->ubicacion = $evento['ubicacion'];
            $e->aforoMaximo = $evento['aforoMaximo'];
            $e->fechaInicio = $evento['fechaInicio'];
            $e->fechaFin = $evento['fechaFin'];
            $e->horaInicio = $evento['horaInicio'];
            $e->horaFin = $evento['horaFin'];
            $e->imagen ='imagenes/'. Str::slug($evento['nombre']) . '.png';
            $e->descripcion = $evento['descripcion'];
            $e->categoria_id = $evento['categoria_id'];
            $e->creador_id = $evento['creador_id'];
            $e->precio = 5.00;
            $e->dineroGenerado = $evento['dineroGenerado'] > 0 ? $evento['dineroGenerado'] : 0;
            $e->save();
            $e->tags()->attach($tags);
    }
}
}