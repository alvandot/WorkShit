<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardKpiController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('dashboard/kpis', [DashboardKpiController::class, 'index']);
});
