<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FakeTicketSeeder extends Seeder
{
    public function run(): void
    {
        // Create a user/engineer for assignment (idempotent)
        $user = DB::table('users')->where('email', 'alfan.fauzan@example.com')->first();
        if ($user) {
            $userId = $user->id;
        } else {
            $userId = DB::table('users')->insertGetId([
                'name' => 'Alfan Fauzan',
                'email' => 'alfan.fauzan@example.com',
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert a part for the ticket (idempotent)
        $part = DB::table('parts')->where('part_name', 'SPS-TOP COVER W/KB BL US | N01287-001')->first();
        if ($part) {
            $partId = $part->id;
        } else {
            $partId = DB::table('parts')->insertGetId([
                'part_name' => 'SPS-TOP COVER W/KB BL US | N01287-001',
                'quantity' => 1,
                'serial_number' => 'PARTSN123456',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert a ticket with all fields filled (idempotent)
        $ticket = DB::table('tickets')->where('ticket_number', 'TCK-5150897256')->first();
        if (! $ticket) {
            DB::table('tickets')->insert([
                'ticket_number' => 'TCK-5150897256',
                'case_id' => '5150897256',
                'company' => 'PT Services Tamayuda Sales Indonesia',
                'pic' => 'Anugerah',
                'address' => 'Kawasan Industri MM 2100 Jalan Madura Lock L 17 Cebitung',
                'phone_number' => '+6282177802952',
                'phone_number_2' => '+622180000000',
                'email' => 'andoni@bsi.co.id',
                'unit' => 'HP ProBook 440 14 inch G9 Notebook PC IDS Base Model',
                'serial_number' => '5CD30206MK',
                'product_number' => '678R0AV',
                'problem' => 'key right arrow detach',
                'schedule' => Carbon::parse('2025-11-01 10:00:00'),
                'deadline' => Carbon::parse('2025-11-05 17:00:00'),
                'status' => 'Open',
                'assigned_to' => $userId,
                'assigned_by' => $userId,
                'part_recommended' => $partId,
                'notes' => 'Customer requested urgent handling.',
                'ct_bad_part' => json_encode(['bad_part_photo.jpg']),
                'ct_good_part' => json_encode(['good_part_photo.jpg']),
                'bap_file' => json_encode(['bap_document.pdf']),
                'needs_revisit' => false,
                'current_visit' => 1,
                'visit_schedules' => json_encode([
                    [
                        'visit_number' => 1,
                        'scheduled_date' => '2025-11-01',
                        'status' => 'pending',
                    ],
                ]),
                'completion_notes' => 'Initial visit scheduled.',
                'completed_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null,
            ]);
        }
    }
}
