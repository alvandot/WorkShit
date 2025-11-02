<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EngineerController;
use App\Http\Controllers\SpecialPlaceController;
use App\Http\Controllers\TicketAssignmentController;
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
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Help & Support
    Route::get('help', function () {
        return Inertia::render('help/index');
    })->name('help.index');

    // Analytics routes
    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('analytics/overview', fn() => redirect('/analytics?tab=overview'))->name('analytics.overview');
    Route::get('analytics/trends', fn() => redirect('/analytics?tab=trends'))->name('analytics.trends');
    Route::get('analytics/performance', fn() => redirect('/analytics?tab=performance'))->name('analytics.performance');
    Route::get('analytics/realtime', fn() => redirect('/analytics?tab=realtime'))->name('analytics.realtime');

    // Analytics API endpoints (untuk fetch data via AJAX)
    Route::prefix('api/analytics')->group(function () {
        Route::get('overview', [AnalyticsController::class, 'overview'])->name('api.analytics.overview');
        Route::get('trends', [AnalyticsController::class, 'trends'])->name('api.analytics.trends');
        Route::get('performance', [AnalyticsController::class, 'performance'])->name('api.analytics.performance');
        Route::get('realtime', [AnalyticsController::class, 'realtime'])->name('api.analytics.realtime');
        Route::get('tickets', [AnalyticsController::class, 'tickets'])->name('api.analytics.tickets');
        Route::get('engineers', [AnalyticsController::class, 'engineers'])->name('api.analytics.engineers');
        Route::get('parts', [AnalyticsController::class, 'parts'])->name('api.analytics.parts');
        Route::get('comparisons', [AnalyticsController::class, 'comparisons'])->name('api.analytics.comparisons');
    });

    Route::get('analytics/export', [AnalyticsController::class, 'export'])->name('analytics.export');

    Route::resource('engineers', EngineerController::class)->except(['show']);
    Route::resource('special-places', SpecialPlaceController::class)->except(['show']);

    // Assignment routes
    Route::get('assignments', [TicketAssignmentController::class, 'index'])->name('assignments.index');
    Route::post('assignments', [TicketAssignmentController::class, 'store'])->name('assignments.store');
    Route::post('assignments/bulk', [TicketAssignmentController::class, 'bulkAssign'])->name('assignments.bulk');
    Route::post('tickets/{ticket}/assign', [TicketAssignmentController::class, 'reassign'])->name('tickets.assign');
    Route::delete('tickets/{ticket}/assignment', [TicketAssignmentController::class, 'destroy'])->name('tickets.unassign');
    Route::get('tickets/{ticket}/assignment-history', [TicketAssignmentController::class, 'history'])->name('tickets.assignment-history');

    // Ticket routes
    Route::get('tickets/export', [TicketController::class, 'export'])->name('tickets.export');
    Route::get('tickets/{ticket}/detail', [TicketController::class, 'detail'])->name('tickets.detail');
    Route::get('tickets/{ticket}/timeline', [TicketController::class, 'timeline'])->name('tickets.timeline');
    Route::get('tickets/{ticket}/download/{fileType}/{index?}', [TicketController::class, 'downloadFile'])->name('tickets.download');
    Route::get('tickets/{ticket}/bap/download', [TicketController::class, 'downloadBap'])->name('tickets.bap.download');
    Route::get('tickets/{ticket}/bap/preview', [TicketController::class, 'previewBap'])->name('tickets.bap.preview');
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
