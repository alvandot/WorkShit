<?php

<<<<<<< HEAD
use App\Http\Controllers\AnalyticsController;
=======
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EngineerController;
use App\Http\Controllers\SpecialPlaceController;
>>>>>>> cfd1cf556cf1f2157eeeb48de797d9c5684c8b8a
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
<<<<<<< HEAD
    Route::get('dashboard', \App\Http\Controllers\DashboardController::class)->name('dashboard');

    // Analytics routes
    Route::prefix('analytics')->group(function () {
        Route::get('overview', [AnalyticsController::class, 'overview'])->name('analytics.overview');
        Route::get('trends', [AnalyticsController::class, 'trends'])->name('analytics.trends');
        Route::get('performance', [AnalyticsController::class, 'performance'])->name('analytics.performance');
        Route::get('realtime', [AnalyticsController::class, 'realtime'])->name('analytics.realtime');
        Route::get('export', [AnalyticsController::class, 'export'])->name('analytics.export');
    });
=======
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('engineers', EngineerController::class)->except(['show']);
    Route::resource('special-places', SpecialPlaceController::class)->except(['show']);
>>>>>>> cfd1cf556cf1f2157eeeb48de797d9c5684c8b8a

    // Ticket routes
    Route::get('tickets/export', [TicketController::class, 'export'])->name('tickets.export');
    Route::get('tickets/{ticket}/detail', [TicketController::class, 'detail'])->name('tickets.detail');
    Route::get('tickets/{ticket}/timeline', [TicketController::class, 'timeline'])->name('tickets.timeline');
    Route::get('tickets/{ticket}/download/{fileType}', [TicketController::class, 'downloadFile'])->name('tickets.download');
    Route::post('tickets/{ticket}/activities', [TicketController::class, 'addActivity'])->name('tickets.activities.add');
    Route::post('tickets/{ticket}/complete', [TicketController::class, 'complete'])->name('tickets.complete');
    Route::post('tickets/{ticket}/revisit', [TicketController::class, 'revisit'])->name('tickets.revisit');
    Route::post('tickets/{ticket}/schedule-visit/{visitNumber}', [TicketController::class, 'scheduleVisit'])->name('tickets.schedule-visit');

    // Resource routes
    Route::get('tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('tickets/create', [TicketController::class, 'create'])->name('tickets.create');
    Route::post('tickets', [TicketController::class, 'store'])->name('tickets.store')->middleware('precognitive');
    Route::get('tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    Route::get('tickets/{ticket}/edit', [TicketController::class, 'edit'])->name('tickets.edit');
    Route::put('tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update')->middleware('precognitive');
    Route::patch('tickets/{ticket}', [TicketController::class, 'update'])->middleware('precognitive');
    Route::delete('tickets/{ticket}', [TicketController::class, 'destroy'])->name('tickets.destroy');
});

require __DIR__.'/settings.php';
