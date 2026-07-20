<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PayPalController extends Controller
{
    private string $urlBase= "https://api-m.sandbox.paypal.com/";
    /*
        METODO USADO PARA OBTENER EL TOKEN, los config(...) se refiere a que obtiene el valor del
        archivo config, a partir de ahi se va seleccionando dentro del string el archivo/indice requerido,
        en caso del primer config accedera a la carpeta config, al archivo services, y al array anidado que devuelve services
        cuyos indeces recogidos son paypal y client_id

        asForm es un metodo usado para devolver en formato HTML, ya que sino paypal devovleria error

        En resumen el metodo hace una peticion con autenticacion basica, pasandole parametros definidos en services
        en formato HTML
        
    */

    public function getToken():string {
        $response = Http::withBasicAuth(
           config("services.paypal.client_id"),
           config("services.paypal.client_secret") 
        )->asForm()->post($this->urlBase . "v1/oauth2/token", [
            'grant_type'=>"client_credentials"
        ]);
        $token = $response->json('access_token');
        if (!$token) {
            throw new \Exception('No se pudo obtener token de PayPal: '. json_encode($response->json()));
        }
        return $token;
    }
    /*
    METODO CREADO PARA REALIZAR EL PAGO, en este metodo se hace la peticion para realizar el pago,
    se envio el token que nos devuelve getToken, el formato en el que se realiza l pago, la cantidad,
    y le especificamos que haga el pago, no que reserve el dinero como viene por defecto,
    nos devolvera una lista de URLs de la cual solo nos interesa la que de valor del indice 'rel' es approve,
    que es el que se usa para efectuar el pago.

    collect es unicamente una forma de tratar los arrays de forma mas liviana por metodos como firstWhere
    */
    public function crearOrden(Request $request){

    $eventoId = $request->evento_id;
    $precioEstandar = Evento::findOrFail($request->evento_id)->precio;
    $precioFinal = 0;
    $token = $this->getToken();
    if($request->numeroAcompañantes + 1 >= 20){
        $precioFinal = ($precioEstandar * ($request->numeroAcompañantes+1)) - ($precioEstandar * ($request->numeroAcompañantes+1))* 0.2;
    }
    else if ($request->numeroAcompañantes + 1 >=10 ) {
        $precioFinal = ($precioEstandar * ($request->numeroAcompañantes+1)) - ($precioEstandar * ($request->numeroAcompañantes+1))* 0.1;
    }
    else ($precioFinal = $precioEstandar * ($request->numeroAcompañantes +1));
    $frontend = config('services.frontend.url');
    
    if (empty($frontend)) {
        return response()->json(['error' => 'FRONTEND_URL no establecido en .env. Establece FRONTEND_URL en tu archivo .env'], 500);
    }

    $response = Http::withToken($token)
        ->post($this->urlBase . "v2/checkout/orders", [
            "intent" => "CAPTURE",
            "purchase_units" => [[
                'amount' => ['currency_code'=> "EUR", 'value'=> $precioFinal],
            ]],
            'application_context' => [
                'return_url'=> $frontend . "inscripcion/{$eventoId}",
                'cancel_url'=> $frontend . "inscripcion/{$eventoId}"
            ],
        ]);

    $orden = $response->json();

    if (!is_array($orden) || empty($orden['links'] ?? null)) {
        return response()->json(['error' => 'PayPal orden inválida', 'detail' => $orden], $response->status() ?: 500);
    }

    $link = collect($orden['links'])->firstWhere('rel', 'approve');
    if (!$link || !isset($link['href'])) {
        return response()->json(['error' => 'No se encontró enlace de aprobación', 'detail' => $orden], $response->status() ?: 500);
    }

    return response()->json(['urlPago' => $link['href']], 201);
    }

    /*
    METODO PARA COMPROBAR SI LLEGO EL DINERO
    en caso de que la respuesta este vacia o status sea distinto de completada
    significara que todavia no se realiza el pago 
    */
    public function capturarPago(Request $request) {
        $token = $this->getToken();
        $response = Http::withToken($token)
            ->withBody('{}', 'application/json')
            ->post($this->urlBase . "v2/checkout/orders/{$request->token}/capture")
            ->json();
        if(($response['status'] ?? '') != 'COMPLETED'){
            return response()->json(['mensaje'=> 'Pago no completado'], 400);
        }
        else {
            $captureId = $response['purchase_units'][0]['payments']['captures'][0]['id'];
            return response()->json(['captureId' => $captureId], 201);
        }
    }
}
