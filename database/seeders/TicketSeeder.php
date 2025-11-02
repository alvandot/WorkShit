<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Remove existing dummy tickets to avoid unique constraint violation
        DB::table('tickets')->where('ticket_number', 'like', 'TCK-DUMMY-%')->delete();

        // Ensure both users exist and get their IDs
        $user1 = \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $user2 = \App\Models\User::firstOrCreate(
            ['email' => 'alfan.fauzan@example.com'],
            [
                'name' => 'Alfan Fauzan',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        for ($i = 0; $i < 50; $i++) {
            $part = \App\Models\Part::create([
                'part_name' => fake()->randomElement([
                    'Keyboard', 'LCD Screen', 'Battery', 'Hard Drive', 'RAM Module',
                    'Motherboard', 'Power Adapter', 'Cooling Fan', 'WiFi Card', 'Touchpad',
                ]),
                'quantity' => fake()->numberBetween(1, 5),
                'serial_number' => fake()->bothify('SN-####-????-####'),
            ]);
            \App\Models\Ticket::factory()->create([
                'part_recommended' => $part->id,
            ]);
        }

        // Dummy data for tickets: pic (Nama Orang), email, assigned_to (Nama Engineer)
        $engineers = [
            ['id' => $user1->id, 'name' => $user1->name],
            ['id' => $user2->id, 'name' => $user2->name],
        ];

        $dummyTickets = [
            [
                'pic' => 'Budi Santoso',
                'email' => 'budi.santoso@example.com',
                'assigned_to' => $engineers[0]['id'],
            ],
            [
                'pic' => 'Siti Aminah',
                'email' => 'siti.aminah@example.com',
                'assigned_to' => $engineers[1]['id'],
            ],
            [
                'pic' => 'Rizky Pratama',
                'email' => 'rizky.pratama@example.com',
                'assigned_to' => $engineers[0]['id'],
            ],
            [
                'pic' => 'Dewi Lestari',
                'email' => 'dewi.lestari@example.com',
                'assigned_to' => $engineers[1]['id'],
            ],
            [
                'pic' => 'Agus Wijaya',
                'email' => 'agus.wijaya@example.com',
                'assigned_to' => $engineers[0]['id'],
            ],
        ];

        foreach ($dummyTickets as $i => $data) {
            DB::table('tickets')->insert([
                'ticket_number' => 'TCK-DUMMY-'.($i + 1),
                'case_id' => 'DUMMY-'.($i + 1),
                'company' => 'PT Dummy Company',
                'address' => 'Jl. Dummy No. '.($i + 1),
                'phone_number' => '+6281234567'.($i + 1),
                'pic' => $data['pic'],
                'phone_number_2' => '+6221123456'.($i + 1),
                'email' => $data['email'],
                'unit' => 'Unit Dummy '.($i + 1),
                'serial_number' => 'SN-DUMMY-'.($i + 1),
                'product_number' => 'PN-DUMMY-'.($i + 1),
                'problem' => 'Dummy problem '.($i + 1),
                'schedule' => now(),
                'deadline' => now()->addDays(3),
                'status' => 'Open',
                'assigned_to' => $data['assigned_to'],
                'assigned_by' => $engineers[0]['id'],
                'part_recommended' => null,
                'notes' => 'Dummy notes',
                'ct_bad_part' => json_encode([]),
                'ct_good_part' => json_encode([]),
                'bap_file' => json_encode([]),
                'needs_revisit' => false,
                'current_visit' => 1,
                'visit_schedules' => json_encode([]),
                'completion_notes' => null,
                'completed_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null,
            ]);
        }
    }
}
