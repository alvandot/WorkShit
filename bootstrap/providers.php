<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    // Register BoostServiceProvider only in local/dev environments
    ...((env('APP_ENV') === 'local' || env('APP_ENV') === 'development') ? [
        Laravel\Boost\BoostServiceProvider::class,
    ] : []),
];
