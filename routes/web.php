<?php

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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Ticket routes
    Route::get('tickets/export', [TicketController::class, 'export'])->name('tickets.export');
    Route::get('tickets/{ticket}/timeline', [TicketController::class, 'timeline'])->name('tickets.timeline');
    Route::get('tickets/{ticket}/download/{fileType}', [TicketController::class, 'downloadFile'])->name('tickets.download');
    Route::post('tickets/{ticket}/activities', [TicketController::class, 'addActivity'])->name('tickets.activities.add');
    Route::post('tickets/{ticket}/complete', [TicketController::class, 'complete'])->name('tickets.complete');
    Route::post('tickets/{ticket}/revisit', [TicketController::class, 'revisit'])->name('tickets.revisit');
    Route::post('tickets/{ticket}/schedule-visit/{visitNumber}', [TicketController::class, 'scheduleVisit'])->name('tickets.schedule-visit');
    Route::resource('tickets', TicketController::class);
});

require __DIR__.'/settings.php';
