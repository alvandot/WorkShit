<?php

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    Storage::fake('public');
    $this->user = User::factory()->create();
    actingAs($this->user);
});

it('can upload and compress ct_bad_part to webp', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'In Progress',
        'current_visit' => 1,
    ]);

    // Create a fake image
    $file = UploadedFile::fake()->image('bad_part.jpg', 1000, 1000);

    // Complete ticket with file upload
    $response = $this->post("/tickets/{$ticket->id}/complete", [
        'ct_bad_part' => $file,
        'completion_notes' => 'Test completion',
    ]);

    $response->assertRedirect();

    // Refresh ticket
    $ticket->refresh();

    // Assert file was stored
    expect($ticket->ct_bad_part)->not->toBeNull();

    // Assert file exists in storage
    expect(Storage::disk('public')->exists($ticket->ct_bad_part))->toBeTrue();

    // Check if file is WebP (should end with .webp)
    expect($ticket->ct_bad_part)->toContain('.webp');
});

it('can upload and compress ct_good_part to webp', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'In Progress',
        'current_visit' => 1,
    ]);

    $file = UploadedFile::fake()->image('good_part.png', 800, 600);

    $response = $this->post("/tickets/{$ticket->id}/complete", [
        'ct_good_part' => $file,
        'completion_notes' => 'Test completion',
    ]);

    $response->assertRedirect();

    $ticket->refresh();

    expect($ticket->ct_good_part)->not->toBeNull();
    expect(Storage::disk('public')->exists($ticket->ct_good_part))->toBeTrue();
    expect($ticket->ct_good_part)->toContain('.webp');
});

it('can upload and compress bap_file to webp', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'In Progress',
        'current_visit' => 1,
    ]);

    $file = UploadedFile::fake()->image('bap.jpg', 1200, 900);

    $response = $this->post("/tickets/{$ticket->id}/complete", [
        'bap_file' => $file,
        'completion_notes' => 'Test completion',
    ]);

    $response->assertRedirect();

    $ticket->refresh();

    expect($ticket->bap_file)->not->toBeNull();
    expect(Storage::disk('public')->exists($ticket->bap_file))->toBeTrue();
    expect($ticket->bap_file)->toContain('.webp');
});

it('stores pdf files without converting to webp', function () {
    $ticket = Ticket::factory()->create([
        'status' => 'In Progress',
        'current_visit' => 1,
    ]);

    // Create a fake PDF
    $file = UploadedFile::fake()->create('document.pdf', 1000, 'application/pdf');

    $response = $this->post("/tickets/{$ticket->id}/complete", [
        'ct_bad_part' => $file,
        'completion_notes' => 'Test completion',
    ]);

    $response->assertRedirect();

    $ticket->refresh();

    expect($ticket->ct_bad_part)->not->toBeNull();
    Storage::disk('public')->assertExists($ticket->ct_bad_part);

    // PDF should NOT be converted to WebP
    expect($ticket->ct_bad_part)->toContain('.pdf');
    expect($ticket->ct_bad_part)->not->toContain('.webp');
});

it('deletes old file when uploading new one', function () {
    Storage::fake('public');

    $ticket = Ticket::factory()->create([
        'status' => 'In Progress',
        'current_visit' => 1,
        'ct_bad_part' => 'tickets/ct_bad_parts/old_file.webp',
    ]);

    // Create the old file
    Storage::disk('public')->put('tickets/ct_bad_parts/old_file.webp', 'old content');

    // Upload new file
    $newFile = UploadedFile::fake()->image('new_part.jpg', 500, 500);

    $response = $this->post("/tickets/{$ticket->id}/complete", [
        'ct_bad_part' => $newFile,
        'completion_notes' => 'Updated',
    ]);

    $response->assertRedirect();

    $ticket->refresh();

    // Old file should be deleted
    Storage::disk('public')->assertMissing('tickets/ct_bad_parts/old_file.webp');

    // New file should exist
    Storage::disk('public')->assertExists($ticket->ct_bad_part);
    expect($ticket->ct_bad_part)->toContain('.webp');
});
