<?php

use App\Models\Ticket;
use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('prevents adding activity to a closed ticket', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'Closed',
        'created_by' => $this->user->id,
    ]);

    $response = $this->postJson(route('tickets.activities.add', $ticket), [
        'activity_type' => 'received',
        'title' => 'Test Activity',
        'description' => 'Test description',
        'activity_time' => now()->toDateTimeString(),
    ]);

    $response->assertSessionHasErrors(['error' => 'Cannot add activity to a closed ticket.']);
    expect($ticket->activities()->count())->toBe(0);
});

it('prevents marking closed ticket as complete', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'Closed',
        'created_by' => $this->user->id,
    ]);

    $response = $this->postJson(route('tickets.complete', $ticket), [
        'completion_notes' => 'Test completion',
    ]);

    $response->assertSessionHasErrors(['error' => 'Cannot complete a closed ticket.']);
    expect($ticket->fresh()->completed_at)->toBeNull();
});

it('prevents marking closed ticket for revisit', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'Closed',
        'created_by' => $this->user->id,
    ]);

    $response = $this->postJson(route('tickets.revisit', $ticket), [
        'reason' => 'Need to revisit',
    ]);

    $response->assertSessionHasErrors(['error' => 'Cannot revisit a closed ticket.']);
    expect($ticket->fresh()->needs_revisit)->toBeFalse();
});

it('allows adding activity to an open ticket', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'Need to Receive',
        'created_by' => $this->user->id,
    ]);

    $response = $this->postJson(route('tickets.activities.add', $ticket), [
        'activity_type' => 'received',
        'title' => 'Ticket Received',
        'description' => 'Received at warehouse',
        'activity_time' => now()->toDateTimeString(),
    ]);

    $response->assertSessionHas('success', 'Activity added successfully.');
    expect($ticket->activities()->count())->toBe(1);
});

it('allows marking open ticket as complete', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'In Progress',
        'created_by' => $this->user->id,
    ]);

    $response = $this->postJson(route('tickets.complete', $ticket), [
        'completion_notes' => 'Work completed successfully',
    ]);

    $response->assertSessionHas('success', 'Ticket marked as completed.');
    expect($ticket->fresh()->completed_at)->not->toBeNull();
});

it('allows marking open ticket for revisit', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'In Progress',
        'created_by' => $this->user->id,
        'current_visit' => 1,
    ]);

    $response = $this->postJson(route('tickets.revisit', $ticket), [
        'reason' => 'Additional work required',
    ]);

    $response->assertSessionHas('success');
    expect($ticket->fresh()->current_visit)->toBe(2);
});
