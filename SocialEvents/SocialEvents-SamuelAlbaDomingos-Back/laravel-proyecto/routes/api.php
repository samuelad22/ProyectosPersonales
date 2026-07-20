<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ConversacionController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\PayPalController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\IAController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\ValoracionController;
use Illuminate\Support\Facades\Route;

//BROADCAST
Broadcast::routes(['middleware' => ['auth:sanctum']]);

//EVENTOS
Route::get('/eventos', [EventoController::class, 'index']);
Route::get('/eventos/carrusel', [EventoController::class, 'carrusel']);
Route::post('/misEventos', [EventoController::class, 'misEventos'])->middleware('auth:sanctum');
Route::post('/eventos/crear', [EventoController::class, 'store'])->middleware('auth:sanctum');
Route::put('/eventos/editar', [EventoController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/eventos/borrar', [EventoController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/eventos/obtenerPorEtiquetas', [EventoController::class, 'obtenerPorEtiquetas']);
Route::post('/eventos/obtenerPorEtiquetasCategoria', [EventoController::class, 'obtenerPorEtiquetasCategorias']);
Route::post('/eventos/obtenerPorCreador', [EventoController::class, 'obtenerEventoPorCreador']);
Route::post('/eventos/obtenerFavoritos', [EventoController::class, 'obtenerEventosFavoritos']);
Route::post('/eventos/buscar', [EventoController::class, 'buscarPorNombre']);
Route::post('/eventos/filtrar', [EventoController::class,'filtrar']);
Route::get('/eventos/obtenerEventosDinero', [EventoController::class, 'eventosPagosPendientes'])->middleware(['auth:sanctum', 'abilities:administrar-pagos']);
Route::post('eventos/cambiarEstadoPago', [EventoController::class, "cambiarEstadoPago"])->middleware(['auth:sanctum', 'abilities:administrar-pagos']);
Route::post('/eventos/filtroPagar', [EventoController::class, 'filtrarEventosPagar'])->middleware(['auth:sanctum', 'abilities:administrar-pagos']);
Route::get('/eventos/{categoria}', [EventoController::class, 'buscarPorCategoria']);
Route::get('/eventos/detalle/{id}', [EventoController::class, 'show']);
//TAGS
Route::get('/tags', [TagController::class, 'index']);
Route::post('/tag/crear', [TagController::class, 'store']);
Route::delete('/tags/borrar', [TagController::class, 'destroy']);
Route::get('/tags', [TagController::class, 'listarTags'])->middleware(['auth:sanctum', 'abilities:administrar-tags']);
Route::post('/tags/buscarPorNombre', [TagController::class, 'buscarTagsPorNombre'])->middleware(['auth:sanctum', 'abilities:administrar-tags']);
Route::put('/tags/actualizar', [TagController::class, 'update'])->middleware(['auth:sanctum', 'abilities:administrar-tags']);
Route::post('/tag/recomendar', [TagController::class, 'recomendarTag']);
//CATEGORIAS
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::post('/categoria/crear', [CategoriaController::class, 'store'])->middleware(['auth:sanctum', 'abilities:administrar-categorias']);
Route::put('/categoria/editar', [CategoriaController::class, 'update'])->middleware(['auth:sanctum', 'abilities:administrar-categorias']);
//USUARIOS
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'store']);
Route::post('/usuario/recomendar', [UserController::class, 'recomendarUsuario']);
Route::get('/usuarioDetalle', [UserController::class,'show'])->middleware('auth:sanctum');
Route::put('/usuario/actualizar', [UserController::class, 'update'])->middleware('auth:sanctum');
Route::get('/usuarios/listar', [UserController::class, 'listarUsuarios'])->middleware(['auth:sanctum', 'abilities:administrar-usuarios']);
Route::put('/usuario/vetarTemporalmente', [UserController::class, 'vetarCuentaTemporalmente'])->middleware(['auth:sanctum', 'abilities:administrar-usuarios']);
Route::put('/usuario/vetarPermanentemente', [UserController::class, 'vetarCuentaPermanentemente'])->middleware(['auth:sanctum', 'abilities:administrar-usuarios']);
Route::put('/usuario/eliminarVeto', [UserController::class, 'eliminarVeto'])->middleware(['auth:sanctum', 'abilities:administrar-usuarios']);
Route::post('/usuarios/buscarPorNombre', [UserController::class, 'buscarPorNombre'])->middleware(['auth:sanctum']);
Route::post('/usuario/informacionBaneado', [UserController::class, 'informacionUsuarioBaneado'])->middleware('auth:sanctum');
Route::post('/usuario/comprobarVeto', [UserController::class, 'comprobarVeto'])->middleware('auth:sanctum');
//INSCRIPCIONES
Route::post('/eventos/inscribir', [InscripcionController::class, 'store'])->middleware('auth:sanctum');
Route::delete('/inscripcion/delete', [InscripcionController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/inscripcionRealizada', [InscripcionController::class, 'comprobarInscripcion'])->middleware('auth:sanctum');
//VALORACIONES
Route::post('/valorar', [ValoracionController::class, 'valorar',])->middleware('auth:sanctum');
Route::post('/valoracion/consultar', [ValoracionController::class, 'preguntarEventoValorado'])->middleware('auth:sanctum');
Route::post('/valoracion/obtenerComentariosUsuario', [ValoracionController::class, 'obtenerComentariosPorCreador'])->middleware(['auth:sanctum', 'abilities:administrar-usuarios']);
Route::delete('/valoracion/borrarComentario', [ValoracionController::class, 'borrarComentario'])->middleware('auth:sanctum');
//API DE IA
Route::get('/ia/mensajeIntroductorio', [IAController::class, 'mensajeIntroductorio']);
Route::post('/ia/recomendaciones', [IAController::class, 'recomendarEventos'])->middleware('auth:sanctum');
Route::get('/ia/posiblesVetos', [IAController::class, 'valorarPosiblesVetos'])->middleware(['auth:sanctum', 'abilities:administrar-usuarios']);
//CONVERSAICONES
Route::post('/enviarMensaje', [ConversacionController::class, 'enviarMensaje'])->middleware('auth:sanctum');
Route::post('/marcarLeido', [ConversacionController::class,'marcarLeido'])->middleware('auth:sanctum');
Route::get('/chats',[ConversacionController::class, "obtenerConversacionesPorUsuario"])->middleware('auth:sanctum');
Route::post('/chat/detalle', [ConversacionController::class, "obtenerConversacionDetalle"])->middleware('auth:sanctum');
Route::get('/mensajesNoLeidos', [ConversacionController::class, "mensajesNoLeidos"])->middleware('auth:sanctum');
//PASARELA DE PAGO
Route::post('/pago/realizarPago', [PayPalController::class, 'crearOrden'])->middleware('auth:sanctum');
Route::post('/pago/comprobarPago', [PayPalController::class, 'capturarPago'])->middleware('auth:sanctum');
//QR
Route::get('/validarEntrada/{token}', [InscripcionController::class, 'validarEntrada'])->middleware(['auth:sanctum', 'abilities:gestionar-entradas']);

