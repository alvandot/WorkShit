<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $webMiddleware = [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ];

        // Only add Boost InjectBoost middleware in local/dev
        if (in_array(env('APP_ENV'), ['local', 'development'])) {
            $webMiddleware[] = \Laravel\Boost\Middleware\InjectBoost::class;
        }

        $middleware->web(append: $webMiddleware);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
