<?php

use App\Models\Part;
use App\Models\Ticket;
use App\Models\User;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->user = User::factory()->create();
    actingAs($this->user);
});

test('can create a part for a ticket', function () {
    $ticket = Ticket::factory()->create(['created_by' => $this->user->id]);

    $part = Part::create([
        'ticket_id' => $ticket->id,
        'part_name' => 'Keyboard',
        'quantity' => 2,
        'serial_number' => 'SN-1234-ABCD-5678',
    ]);

    expect($part)
        ->part_name->toBe('Keyboard')
        ->quantity->toBe(2)
        ->serial_number->toBe('SN-1234-ABCD-5678')
        ->ticket_id->toBe($ticket->id);
});

test('part belongs to a ticket', function () {
    $ticket = Ticket::factory()->create(['created_by' => $this->user->id]);
    $part = Part::factory()->create(['ticket_id' => $ticket->id]);

    expect($part->ticket)->toBeInstanceOf(Ticket::class)
        ->and($part->ticket->id)->toBe($ticket->id);
});

test('ticket has many parts', function () {
    $ticket = Ticket::factory()->create(['created_by' => $this->user->id]);
    Part::factory(3)->create(['ticket_id' => $ticket->id]);

    expect($ticket->parts)->toHaveCount(3)
        ->and($ticket->parts->first())->toBeInstanceOf(Part::class);
});

test('deleting ticket cascades to parts', function () {
    $ticket = Ticket::factory()->create(['created_by' => $this->user->id]);
    $part = Part::factory()->create(['ticket_id' => $ticket->id]);

    $ticket->delete();

    expect(Part::find($part->id))->toBeNull();
});

test('part can have nullable serial number', function () {
    $ticket = Ticket::factory()->create(['created_by' => $this->user->id]);

    $part = Part::create([
        'ticket_id' => $ticket->id,
        'part_name' => 'RAM Module',
        'quantity' => 1,
        'serial_number' => null,
    ]);

    expect($part->serial_number)->toBeNull()
        ->and($part->part_name)->toBe('RAM Module');
});
