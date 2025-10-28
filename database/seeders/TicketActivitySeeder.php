<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\TicketActivity;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tickets = Ticket::with('createdBy')->take(10)->get();
        $users = User::all();

        foreach ($tickets as $ticket) {
            $user = $ticket->createdBy ?? $users->random();
            $baseTime = now()->subDays(rand(1, 7));

            // Received activity
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'activity_type' => 'received',
                'title' => 'Received Ticket',
                'description' => 'Ticket project : 300 Cities Received',
                'activity_time' => $baseTime,
                'user_id' => $user->id,
            ]);

            // On the way
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'activity_type' => 'on_the_way',
                'title' => 'Hit the road',
                'description' => 'On The Way, meet with '.$users->random()->name,
                'activity_time' => $baseTime->copy()->addMinutes(rand(30, 120)),
                'user_id' => $user->id,
            ]);

            // Arrived
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'activity_type' => 'arrived',
                'title' => "It's Arrived",
                'description' => 'Landed to destination',
                'activity_time' => $baseTime->copy()->addMinutes(rand(130, 200)),
                'user_id' => $user->id,
            ]);

            // Start Working
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'activity_type' => 'start_working',
                'title' => 'Start Working',
                'description' => 'Commence',
                'activity_time' => $baseTime->copy()->addMinutes(rand(210, 250)),
                'user_id' => $user->id,
            ]);

            // Randomly add "Need a Part" or "Completed"
            if (rand(0, 1)) {
                TicketActivity::create([
                    'ticket_id' => $ticket->id,
                    'activity_type' => 'need_part',
                    'title' => 'Need a Part',
                    'description' => 'Ticket pending, note : Revisit REO New MBO , MB is Dead',
                    'activity_time' => $baseTime->copy()->addMinutes(rand(260, 300)),
                    'user_id' => $user->id,
                ]);
            } else {
                TicketActivity::create([
                    'ticket_id' => $ticket->id,
                    'activity_type' => 'completed',
                    'title' => 'Work Completed',
                    'description' => 'All work has been completed successfully',
                    'activity_time' => $baseTime->copy()->addMinutes(rand(260, 300)),
                    'user_id' => $user->id,
                ]);
            }
        }
    }
}
