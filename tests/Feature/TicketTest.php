<?php

use App\Models\Ticket;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

beforeEach(function () {
    $this->user = User::factory()->create();
    actingAs($this->user);
});

it('can display tickets index page', function () {
    $response = get('/tickets');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('tickets/index'));
});

it('can display create ticket page', function () {
    $response = get('/tickets/create');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('tickets/create'));
});

it('can create a new ticket', function () {
    $ticketData = [
        'ticket_number' => '12345678',
        'case_id' => '9876543210',
        'company' => 'Test Company',
        'serial_number' => 'SN123456',
        'problem' => 'Test problem description',
        'schedule' => now()->addDays(1)->format('Y-m-d\TH:i'),
        'deadline' => now()->addDays(7)->format('Y-m-d\TH:i'),
        'status' => 'Open',
        'notes' => 'Test notes',
    ];

    $response = post('/tickets', $ticketData);

    $response->assertRedirect('/tickets');
    assertDatabaseHas('tickets', [
        'ticket_number' => '12345678',
        'company' => 'Test Company',
        'problem' => 'Test problem description',
    ]);
});

it('validates required fields when creating ticket', function () {
    $response = post('/tickets', []);

    $response->assertSessionHasErrors(['ticket_number', 'company', 'problem', 'status']);
});

it('can display ticket details', function () {
    $ticket = Ticket::factory()->create();

    $response = get("/tickets/{$ticket->id}");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('tickets/show')
        ->has('ticket')
    );
});

it('can display edit ticket page', function () {
    $ticket = Ticket::factory()->create();

    $response = get("/tickets/{$ticket->id}/edit");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('tickets/edit'));
});

it('can update a ticket', function () {
    $ticket = Ticket::factory()->create([
        'company' => 'Old Company',
        'problem' => 'Old problem',
    ]);

    $updateData = [
        'ticket_number' => $ticket->ticket_number,
        'company' => 'Updated Company',
        'problem' => 'Updated problem',
        'status' => 'In Progress',
    ];

    $response = put("/tickets/{$ticket->id}", $updateData);

    $response->assertRedirect('/tickets');
    assertDatabaseHas('tickets', [
        'id' => $ticket->id,
        'company' => 'Updated Company',
        'problem' => 'Updated problem',
    ]);
});

it('can delete a ticket', function () {
    $ticket = Ticket::factory()->create();

    $response = delete("/tickets/{$ticket->id}");

    $response->assertRedirect('/tickets');
    expect(Ticket::withTrashed()->find($ticket->id)->deleted_at)->not->toBeNull();
});

it('creates status history when ticket is created', function () {
    $ticketData = [
        'ticket_number' => '12345678',
        'company' => 'Test Company',
        'problem' => 'Test problem',
        'status' => 'Open',
    ];

    post('/tickets', $ticketData);

    $ticket = Ticket::where('ticket_number', '12345678')->first();

    assertDatabaseHas('ticket_status_histories', [
        'ticket_id' => $ticket->id,
        'new_status' => 'Open',
        'old_status' => null,
    ]);
});

it('creates status history when ticket status is updated', function () {
    $ticket = Ticket::factory()->create(['status' => 'Open']);

    put("/tickets/{$ticket->id}", [
        'ticket_number' => $ticket->ticket_number,
        'company' => $ticket->company,
        'problem' => $ticket->problem,
        'status' => 'In Progress',
    ]);

    assertDatabaseHas('ticket_status_histories', [
        'ticket_id' => $ticket->id,
        'old_status' => 'Open',
        'new_status' => 'In Progress',
    ]);
});

it('can assign ticket to user', function () {
    $assignedUser = User::factory()->create();
    $ticket = Ticket::factory()->create(['assigned_to' => null]);

    put("/tickets/{$ticket->id}", [
        'ticket_number' => $ticket->ticket_number,
        'company' => $ticket->company,
        'problem' => $ticket->problem,
        'status' => $ticket->status,
        'assigned_to' => $assignedUser->id,
    ]);

    assertDatabaseHas('tickets', [
        'id' => $ticket->id,
        'assigned_to' => $assignedUser->id,
    ]);
});

it('can search tickets by ticket number', function () {
    Ticket::factory()->create(['ticket_number' => 'SEARCH123']);
    Ticket::factory()->create(['ticket_number' => 'OTHER456']);

    $response = get('/tickets?search=SEARCH123');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('tickets/index')
        ->has('tickets.data', 1)
    );
});

it('can filter tickets by status', function () {
    Ticket::factory()->create(['status' => 'Open']);
    Ticket::factory()->create(['status' => 'Closed']);
    Ticket::factory()->create(['status' => 'Open']);

    $response = get('/tickets?status=Open');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('tickets/index')
        ->has('tickets.data', 2)
    );
});

it('can export tickets to excel', function () {
    Ticket::factory()->count(5)->create();

    $response = get('/tickets/export');

    $response->assertOk();
    $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
});

it('prevents unauthorized access to tickets', function () {
    $this->app['auth']->logout();

    $response = get('/tickets');

    $response->assertRedirect('/login');
});
