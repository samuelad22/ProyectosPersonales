<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;
use App\Models\Valoracion;
use Illuminate\Support\Facades\DB;
use Mockery\Undefined;
class IAController extends Controller
{
    public function mensajeIntroductorio(Request $request)
    {

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROK_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.1-8b-instant',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => ' Eres StreetBot, el asistente de Street Connect. Responde SIEMPRE en español. 
                                    Tu única función es dar UN dato curioso de 1-2 líneas sobre uno de estos temas: 
                                    rap, freestyle, beatbox, hip-hop, arte callejero, skateboarding, parkour, street workout, BMX.
                                    El dato puede ser histórico o actual, pero es preferible que sea lo mas reciente posible. No saludes, no te presentes, solo da el dato directamente. 
                                    Varía los temas lo maximo posible y los datos para no repetirte. Si te piden otra cosa, 
                                    responde solo con un dato curioso igualmente.
                                    Centrate en contenido relacionado con España o América Latina, pero puedes incluir datos de otros lugares si son interesantes de forma puntual.
                                    Asegurate que toda la informacion que das sea veridica y contrastada, no inventes datos curiosos. Si no sabes un dato curioso, mejor di que no lo sabes a inventar uno.'
                        ],
                        [
                            'role' => 'user',
                            'content' => 'Dame un dato curioso'
                        ]
                    ],
                    'max_tokens' => 150,
                    'temperature' => 0.7,
                ]);

        $data = $response->json();
        $texto = $data['choices'][0]['message']['content'];

        return response()->json(['dato' => $texto]);
    }



    public function recomendarEventos(Request $request)
    {
        $usuario = $request->user();
        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
        $intereses = DB::select(
            'SELECT t.nombre FROM tags t INNER JOIN intereses i ON i.tag_id = t.id where i.user_id =' . $usuario->id
        );
        $eventosFuturos = DB::select(
            'SELECT nombre, ubicacion FROM eventos WHERE fechaInicio > NOW()'
        );
        $prompt = "Intereses del usuario: " . json_encode($intereses) . ". "
            . "Ciudad: {$usuario->localidadResidencia}. "
            . "Eventos disponibles: " . json_encode($eventosFuturos) . ". "
            . "Recomienda de 1 a 2 eventos en un mensaje corto y amigable en español , mencionando el nombre de cada evento."
            . 'Eres StreetBot, el asistente de Street Connect. Responde en español con jerga urbana callejera natural 
           (usa expresiones como , "flipa", "pasarse", "rollo", "bro", "tío/a"). 
           No seas cursi ni formal. Habla como alguien de la escena urbana hablaría con un colega. 
           No uses listas, solo un párrafo breve de 2-3 frases máximo. No uses emojis. Tampoco exageres con la jerga, que sea natural, no forzada.

           Si hay eventos que coincidan con sus intereses y su ciudad, recomiéndalos primero y recuerdale que esta cerca. 
           Si hay eventos que coincidan con sus intereses pero no con su ciudad, recomiéndalos después.'
            . "En caso de que no coincida la ciudad del usuario con la ubicación de ningún evento, recomienda los eventos que más se ajusten a sus intereses 
           aunque no estén en su ciudad. Nunca menciones que el evento no está en su ciudad, solo recomiéndalo directamente. 
           Si no hay eventos que coincidan con sus intereses, recomienda los eventos que vayan a tener lugar próximamente aunque no coincidan con sus intereses.
           No uses listas, solo un párrafo breve.";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROK_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.3-70b-versatile',
                    'max_tokens' => 200,
                    'temperature' => 0.7,
                    'messages' => [
                        ['role' => 'system', 'content' => 'Eres StreetBot, el asistente de Street Connect. Responde en español con un mensaje corto y cercano recomendando eventos. No uses listas, solo un párrafo breve.'],
                        ['role' => 'user', 'content' => $prompt]
                    ],
                ]);
        $texto = $response->json()['choices'][0]['message']['content'];
        return response()->json(['respuesta' => $texto]);
    }
    public function valorarPosiblesVetos()
    {
        $usuarios = User::whereHas('valoracionesRecientes')->get();

        $contexto = [];
        foreach ($usuarios as $usuario) {
            $valoraciones = DB::select(
                'SELECT contenido FROM valoraciones WHERE user_id = ?',
                [$usuario->id]
            );

            $contenidos = [];
            foreach ($valoraciones as $valoracion) {
                $contenidos[] = $valoracion->contenido;
            }

            $contexto[] = [
                'user_id' => $usuario->id,
                'nombre_usuario' => $usuario->nombreUsuario,
                'comentarios' => $contenidos,
            ];
        }
        $response = Http::withHeaders([
            'x-goog-api-key' => env('GEMINI_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', [
                    'system_instruction' => [
                        'parts' => [
                            ['text' => '
                                        Eres StreetBot Moderator, el sistema de moderación automática de StreetConnect,
                                        una plataforma de cultura urbana (hip hop, freestyle, graffiti, deportes urbanos).

                                        CONTEXTO CULTURAL:
                                        El lenguaje en esta plataforma puede ser más directo que en otras redes sociales.
                                        Sin embargo, esto NO justifica ningún tipo de insulto o amenaza dirigida a una persona.

                                        CRITERIOS DE EVALUACIÓN — OBLIGATORIOS:

                                        1. AMENAZAS DE CUALQUIER TIPO → riesgo: alto
                                           Ejemplos: "te voy a quemar la casa", "te voy a partir la cara", "ya sabes dónde vives"

                                        2. INSULTOS DIRECTOS A UNA PERSONA → riesgo: medio o alto según gravedad
                                           Tolerancia CERO. Cualquier insulto dirigido a un usuario concreto debe aparecer en la lista,
                                           sin excepciones. Ejemplos: "eres subnormal", "eres un idiota", "inútil"

                                        3. LENGUAJE OFENSIVO GENERAL O DUDOSO → riesgo: bajo
                                           Si existe cualquier duda, el usuario DEBE aparecer en la lista.
                                           Es preferible que el administrador descarte un caso a que se ignore uno real.

                                        IMPORTANTE SOBRE LAS RECOMENDACIONES:
                                        No determines por tu cuenta si el veto debe ser temporal o permanente.
                                        El administrador tomará esa decisión. Tu recomendacion siempre será "revision_admin".

                                        FORMATO DE RESPUESTA:
                                        Devuelve ÚNICAMENTE un array JSON válido. Sin texto adicional, sin bloques de código,
                                        sin explicaciones fuera del JSON:
                                        [
                                          {
                                            "user_id": 123,
                                            "nombreUsuario": "Nombre Usuario",
                                            "riesgo": "alto|medio|bajo",
                                            "comentarios": ["cita textual exacta del comentario ofensivo", "amenaza"],
                                            "motivo": "explicación breve y clara del motivo",
                                            "recomendacion": "revision_admin"
                                          }
                                        ]
                                        Si ningún usuario merece atención, devuelve exclusivamente: []
                                        '
                        ]]],
                        'contents' => [['parts'=>[['text' => "Comentarios de las ultimas 48 horas:" . json_encode($contexto)]]]]
                    
                ]);
        $data = $response->json();
        if (!isset($data['candidates'])) {
            return response()->json(["mensaje"=> "No se ha podido conecatar a la ia"], 503);
        }
        $texto = $data['candidates'][0]['content']['parts'][0]['text'];
        $textoLimpio = preg_replace('/```json|```/', '', $texto);
        return json_decode(trim($textoLimpio), true);
    }
}
