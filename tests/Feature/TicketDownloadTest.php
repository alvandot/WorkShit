<?php

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;

it('can download a single file', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $ticket = Ticket::factory()->create([
        'ct_bad_part' => 'tickets/ct_bad_parts/test.pdf',
    ]);

    // Create a fake file
    Storage::disk('public')->put(
        'tickets/ct_bad_parts/test.pdf',
        'fake file content'
    );

    actingAs($user)
        ->get("/tickets/{$ticket->id}/download/ct_bad_part")
        ->assertSuccessful()
        ->assertDownload('test.pdf');
});

it('can download multiple files', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $files = [
        'tickets/ct_bad_parts/test1.pdf',
        'tickets/ct_bad_parts/test2.pdf',
    ];

    $ticket = Ticket::factory()->create([
        'ct_bad_part' => json_encode($files),
    ]);

    // Create fake files
    foreach ($files as $file) {
        Storage::disk('public')->put($file, 'fake file content');
    }

    // Test first file download
    actingAs($user)
        ->get("/tickets/{$ticket->id}/download/ct_bad_part/0")
        ->assertSuccessful()
        ->assertDownload('test1.pdf');

    // Test second file download
    actingAs($user)
        ->get("/tickets/{$ticket->id}/download/ct_bad_part/1")
        ->assertSuccessful()
        ->assertDownload('test2.pdf');
});

it('returns 404 for invalid file type', function () {
    $user = User::factory()->create();
    $ticket = Ticket::factory()->create();

    actingAs($user)
        ->get("/tickets/{$ticket->id}/download/invalid_type")
        ->assertNotFound();
});

it('returns 404 for non-existent file', function () {
    $user = User::factory()->create();
    $ticket = Ticket::factory()->create([
        'ct_bad_part' => null,
    ]);

    actingAs($user)
        ->get("/tickets/{$ticket->id}/download/ct_bad_part")
        ->assertNotFound();
});
