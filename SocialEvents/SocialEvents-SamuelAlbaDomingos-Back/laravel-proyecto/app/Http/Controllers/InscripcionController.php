<?php

namespace App\Http\Controllers;

use App\Http\Resources\EntradaValidadaResource;
use App\Mail\AvanceColaTotal;
use App\Mail\ConfirmacionInscripcion;
use App\Models\ColaEspera;
use App\Models\Inscripcion;
use App\Http\Requests\InscripcionRequest;
use App\Http\Requests\BorrarInscripcionRequest;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Evento;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InscripcionController extends Controller
{
    public function store(InscripcionRequest $request)
    {
        $evento = Evento::findOrFail($request->evento_id);
        $user = $request->user();

        // --- Validaciones previas ---
        if ($user->estado != 0) {
            return response()->json(['mensaje' => 'Debido a tu sancion no puedes inscribirte a ningun evento ni entrar en cola'], 403);
        }
        if ($evento->fechaInicio < now()) {
            return response()->json(['mensaje' => 'El evento ya paso, no podemos inscribirte'], 400);
        }

        $yaInscrito = Inscripcion::where('evento_id', $evento->id)->where('user_id', $user->id)->exists();
        $yaEnCola = ColaEspera::where('evento_id', $evento->id)->where('user_id', $user->id)->exists();

        if ($yaInscrito || $yaEnCola) {
            return response()->json(['mensaje' => 'Ya estas inscrito en este evento o en su lista de espera'], 400);
        }

        $total = $request->numeroAcompañantes + 1;
        $libres = $evento->aforoMaximo - $evento->aforoActual;

        return DB::transaction(function () use ($request, $evento, $user, $total, $libres) {

            // --- CASO 1: No hay aforo, todo a cola ---
            if ($libres <= 0) {
                $this->insertarEnCola($evento->id, $user, $request->numeroAcompañantes, $request->mensaje, $request->paypalToken);
                return response()->json(['mensaje' => 'El aforo esta completo. Tu grupo queda en lista de espera'], 200);
            }

            // --- CASO 2: Caben algunos, inscripcion parcial ---
            if ($total > $libres) {
                $acompañantesConfirmados = $libres - 1;
                $acompañantesPendientes = $request->numeroAcompañantes - $libres;

                $this->insertarEnInscripciones($evento->id, $user, $acompañantesConfirmados, $request->mensaje, $request->paypalToken);
                $this->insertarEnCola($evento->id, $user, $acompañantesPendientes, $request->mensaje, $request->paypalToken);

                $evento->aforoActual = $evento->aforoMaximo;

                $precioFinal = $this->calcularPrecio($libres, $evento->precio);
                $evento->dineroGenerado += $precioFinal;
                $evento->save();

                $inscripcion = Inscripcion::where('evento_id', $evento->id)->where('user_id', $user->id)->first();
                Mail::to($user->email)->send(
                    new ConfirmacionInscripcion($evento, $user, $inscripcion->qr_token, $request->numeroAcompañantes)
                );
                return response()->json([
                    'mensaje' => 'Entraron ' . $libres . ' de tu grupo. Los ' . ($total - $libres) . ' restantes quedan en lista de espera'
                ], 200);
            }

            // --- CASO 3: Caben todos ---
            $this->insertarEnInscripciones($evento->id, $user, $request->numeroAcompañantes, $request->mensaje, $request->paypalToken);

            $evento->aforoActual += $total;
            $evento->dineroGenerado += $this->calcularPrecio($total, $evento->precio);
            $evento->save();
            $inscripcion = Inscripcion::where('evento_id', $evento->id)->where('user_id', $user->id)->first();
            Mail::to($user->email)->send(
                new ConfirmacionInscripcion($evento, $user, $inscripcion->qr_token, $request->numeroAcompañantes)
            );

            return response()->json('Inscripción realizada con éxito', 200);
        });
    }


    public function destroy(BorrarInscripcionRequest $request)
    {
        $evento = Evento::findOrFail($request->evento_id);
        $user = $request->user();

        if ($evento->fechaInicio < now()) {
            return response()->json(['mensaje' => 'El evento ya paso, no podemos borrar la inscripcion'], 400);
        }

        return DB::transaction(function () use ($evento, $user) {

            $inscripcion = Inscripcion::where('evento_id', $evento->id)->where('user_id', $user->id)->first();
            $enCola = ColaEspera::where('evento_id', $evento->id)->where('user_id', $user->id)->first();

            // Sin inscripcion ni cola
            if (!$inscripcion && !$enCola) {
                return response()->json(['mensaje' => 'No tienes ninguna inscripcion en este evento'], 400);
            }

            // Cancelar parte en cola si existe (parcial o total)
            if ($enCola) {
                $this->devolverDinero($enCola->paypalToken);
                $enCola->delete();
            }

            // Cancelar parte confirmada si existe
            if ($inscripcion) {
                $this->devolverDinero($inscripcion?->paypalToken);

                $totalConfirmado = $inscripcion->acompañantes + 1;
                $precioFinal = $this->calcularPrecio($totalConfirmado, $evento->precio);

                $inscripcion->delete();

                $evento->aforoActual -= $totalConfirmado;
                $evento->dineroGenerado -= $precioFinal;
                $evento->save();

                $this->avanzarCola($evento);
            }

            return response()->json('Inscripción borrada con éxito', 200);
        });
    }


    public function comprobarInscripcion(BorrarInscripcionRequest $request)
    {
        $usuario = $request->user();

        $inscripcion = Inscripcion::where('user_id', $usuario->id)
            ->where('evento_id', $request->evento_id)
            ->first();

        $enCola = ColaEspera::where('user_id', $usuario->id)
            ->where('evento_id', $request->evento_id)
            ->first();

        // Sin inscripcion
        if (!$inscripcion && !$enCola) {
            return response()->json(['mensaje' => 'No tienes ninguna inscripcion en este evento'], 400);
        }

        // Parcial: parte confirmada y parte en cola
        if ($inscripcion && $enCola) {
            $posicion = ColaEspera::where('evento_id', $request->evento_id)
                ->where('created_at', '<=', $enCola->created_at)
                ->count();
            return response()->json([
                'mensaje' => 'Tienes ' . ($inscripcion->acompañantes + 1) . ' personas confirmadas y ' . ($enCola->acompañantes) . ' en lista de espera (posicion ' . $posicion . ')',
                'estado' => 'parcial',
                'confirmados' => $inscripcion->acompañantes + 1,
                'pendientes' => $enCola->acompañantes + 1,
                'posicionCola' => $posicion,
            ], 200);
        }

        //Confirmado todo
        if ($inscripcion) {
            return response()->json([
                'mensaje' => 'Inscripcion confirmada para ' . ($inscripcion->acompañantes + 1) . ' personas',
                'estado' => 'confirmado',
                'confirmados' => $inscripcion->acompañantes + 1,
            ], 200);
        }

        //En cola todo
        $posicion = ColaEspera::where('evento_id', $request->evento_id)
            ->where('created_at', '<=', $enCola->created_at)
            ->count();

        return response()->json([
            'mensaje' => 'Estas en lista de espera en la posicion ' . $posicion . ' con ' . ($enCola->acompañantes + 1) . ' personas',
            'estado' => 'cola',
            'pendientes' => $enCola->acompañantes + 1,
            'posicionCola' => $posicion,
        ], 200);
    }


    public function avanzarCola(Evento $evento)
    {
        $cola = ColaEspera::where('evento_id', $evento->id)
            ->orderBy('created_at')
            ->get();

        foreach ($cola as $entrada) {
            $libres = $evento->aforoMaximo - $evento->aforoActual;
            $necesita = $entrada->acompañantes + 1;

            $user = User::find($entrada->user_id);

            if ($necesita <= $libres) {
                // Cabe el grupo completo
                // Comprobar si ya tiene parte confirmada (caso parcial previo)
                $inscripcionExistente = Inscripcion::where('evento_id', $evento->id)
                    ->where('user_id', $entrada->user_id)
                    ->first();

                if ($inscripcionExistente) {
                    // Sumar los nuevos confirmados a la fila existente
                    $inscripcionExistente->acompañantes += $necesita;
                    $inscripcionExistente->save();

                } else {
                    $this->insertarEnInscripciones(
                        $evento->id,
                        $user,
                        $entrada->acompañantes,
                        $entrada->mensaje,
                        $entrada->paypalToken
                    );
                    $inscripcion = Inscripcion::where('evento_id', $evento->id)->where('user_id', $user->id)->first();
                   
                }
                $evento->aforoActual += $necesita;
                $evento->dineroGenerado += $this->calcularPrecio($necesita, $evento->precio);

                $entrada->delete();

                $inscripcion = Inscripcion::where('evento_id', $evento->id)
                    ->where('user_id', $entrada->user_id)
                    ->first();

                Mail::to($entrada->email)->send(
                    new ConfirmacionInscripcion(
                        $evento,
                        $user,
                        $inscripcion->qr_token,
                        $inscripcion->acompañantes
                    )
                );

            } else {
                // Caben algunos — inscripcion parcial desde cola
                $acompañantesConfirmados = $libres - 1;

                $inscripcionExistente = Inscripcion::where('evento_id', $evento->id)
                    ->where('user_id', $entrada->user_id)
                    ->first();

                if ($inscripcionExistente) {
                    $inscripcionExistente->acompañantes += $libres;
                    $inscripcionExistente->save();
                } else {
                    $this->insertarEnInscripciones(
                        $evento->id,
                        $user,
                        $acompañantesConfirmados,
                        $entrada->mensaje,
                        $entrada->paypalToken
                    );
                }
                $entrada->acompañantes = $entrada->acompañantes - $acompañantesConfirmados - 1;
                $entrada->save();

                $evento->aforoActual = $evento->aforoMaximo;
                $evento->dineroGenerado += $this->calcularPrecio($libres, $evento->precio);

                $inscripcion = Inscripcion::where('evento_id', $evento->id)
                    ->where('user_id', $entrada->user_id)
                    ->first();

                Mail::to($entrada->email)->send(new AvanceColaTotal($inscripcion, $evento, $user));
            }

            $evento->save();
        }
    }

    public function validarEntrada(string $token)
    {
        $inscripcion = Inscripcion::where('qr_token', $token)->first();

        if (!$inscripcion) {
            return response()->json([
                'mensaje' => 'QR inválido o no registrado'
            ], 404);
        }
        if ($inscripcion->qr_usado) {
            $fechaUltimaVezUsado = $inscripcion->updated_at;
            $inscripcion->updated_at = now();
            $inscripcion->save();
            return response()->json([
                'mensaje' => 'Esta entrada ya fue utilizada. Ultima vez usada: ',
                'ultimoUso' => $fechaUltimaVezUsado
            ], 400);
        }

        $inscripcion->qr_usado = true;
        $inscripcion->save();

        return new EntradaValidadaResource($inscripcion);
    }


    private function insertarEnInscripciones(int $eventoId, User $user, int $acompañantes, ?string $mensaje, ?string $paypalToken): void
    {
        DB::insert(
            'INSERT INTO inscripciones (evento_id, user_id, acompañantes, email, mensaje, paypalToken, qr_token, created_at, updated_at)
             VALUES (?,?,?,?,?,?,?,?,?)',
            [$eventoId, $user->id, $acompañantes, $user->email, $mensaje, $paypalToken, Str::uuid(), now(), now()]
        );
    }

    private function insertarEnCola(int $eventoId, User $user, int $acompañantes, ?string $mensaje, ?string $paypalToken): void
    {
        DB::insert(
            'INSERT INTO cola_espera (evento_id, user_id, acompañantes, email, mensaje, paypalToken, created_at, updated_at)
             VALUES (?,?,?,?,?,?,?,?)',
            [$eventoId, $user->id, $acompañantes, $user->email, $mensaje, $paypalToken, now(), now()]
        );
    }

    private function calcularPrecio(int $total, float $precio): float
    {
        return match (true) {
            $total >= 20 => $total * $precio * 0.8,
            $total >= 10 => $total * $precio * 0.9,
            default => $total * $precio,
        };
    }

    private function devolverDinero(?string $paypalToken): void
    {
        if (!$paypalToken)
            return;

        $tokenPaypal = $this->getToken();
        Http::withToken($tokenPaypal)
            ->withBody('{}', 'application/json')
            ->post("https://api-m.sandbox.paypal.com/v2/payments/captures/{$paypalToken}/refund");
    }

    public function getToken(): string
    {
        $response = Http::withBasicAuth(
            config('services.paypal.client_id'),
            config('services.paypal.client_secret')
        )->asForm()->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                    'grant_type' => 'client_credentials',
                ]);

        return $response->json('access_token');
    }
}