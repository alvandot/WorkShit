<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardKpiController;

// Public dashboard KPIs endpoint (no auth for dev/demo). If you want to protect
// this route, re-add an appropriate auth guard (e.g. sanctum) and middleware.
Route::get('dashboard/kpis', [DashboardKpiController::class, 'index']);
