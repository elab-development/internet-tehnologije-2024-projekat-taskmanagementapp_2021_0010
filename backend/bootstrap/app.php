<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
    api: __DIR__.'/../routes/api.php',
    web: __DIR__.'/../routes/web.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)

    ->withMiddleware(function (Middleware $middleware): void {
    
        $middleware->api(prepend: [
    //HandleCors ti je koristan ako frontend i backend rade na različitim domenima/portovima.
           \Illuminate\Http\Middleware\HandleCors::class,
           \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);


        $middleware->alias([
        'role' => \App\Http\Middleware\RoleMiddleware::class,
    ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();