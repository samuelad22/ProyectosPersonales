<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;
use Symfony\Component\HttpFoundation\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        channels: __DIR__.'/../routes/channels.php',
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });
    })
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias(['abilities' => CheckAbilities::class, 'ability' => CheckForAnyAbility::class,]);
    })

    ->withMiddleware(function (Middleware $middleware) {
    $middleware->redirectGuestsTo(fn () => null);
})
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
