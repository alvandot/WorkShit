<?php

use App\Models\Ticket;
use App\Models\TicketActivity;
use App\Models\User;
use App\Services\StageTimingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->service = new StageTimingService;
    $this->user = User::factory()->create();
});

test('getAverageTicketCompletionTime returns default when no activities exist', function () {
    $average = $this->service->getAverageTicketCompletionTime();

    expect($average)->toBe(180.0);
});

test('getAverageTicketCompletionTime calculates average from multiple tickets', function () {
    $ticket1 = Ticket::factory()->create();
    $ticket2 = Ticket::factory()->create();

    // Ticket 1: 60 minutes total (20 + 40)
    TicketActivity::factory()->create([
        'ticket_id' => $ticket1->id,
        'duration_minutes' => 20,
        'user_id' => $this->user->id,
    ]);
    TicketActivity::factory()->create([
        'ticket_id' => $ticket1->id,
        'duration_minutes' => 40,
        'user_id' => $this->user->id,
    ]);

    // Ticket 2: 100 minutes total (50 + 50)
    TicketActivity::factory()->create([
        'ticket_id' => $ticket2->id,
        'duration_minutes' => 50,
        'user_id' => $this->user->id,
    ]);
    TicketActivity::factory()->create([
        'ticket_id' => $ticket2->id,
        'duration_minutes' => 50,
        'user_id' => $this->user->id,
    ]);

    $average = $this->service->getAverageTicketCompletionTime();

    // Average should be (60 + 100) / 2 = 80
    expect($average)->toBe(80.0);
});

test('getAverageTicketCompletionTime ignores activities without duration', function () {
    $ticket = Ticket::factory()->create();

    TicketActivity::factory()->create([
        'ticket_id' => $ticket->id,
        'duration_minutes' => 30,
        'user_id' => $this->user->id,
    ]);

    // This activity should be ignored
    TicketActivity::factory()->create([
        'ticket_id' => $ticket->id,
        'duration_minutes' => null,
        'user_id' => $this->user->id,
    ]);

    $average = $this->service->getAverageTicketCompletionTime();

    expect($average)->toBe(30.0);
});
