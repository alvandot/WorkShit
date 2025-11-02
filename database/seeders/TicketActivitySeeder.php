<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\TicketActivity;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketActivitySeeder extends Seeder
{
    /**
     * Define the sequential stages for ticket activities.
     */
    private const TIMELINE_STAGES = [
        [
            'type' => 'received',
            'title' => 'Ticket Received',
            'descriptions' => [
                'Ticket has been received and acknowledged',
                'Assignment confirmed, preparing to visit',
                'Ticket received from support desk',
            ],
        ],
        [
            'type' => 'on_the_way',
            'title' => 'On The Road',
            'descriptions' => [
                'Engineer is on the way to customer location',
                'Departed from office, ETA in 45 minutes',
                'En route to site location',
            ],
        ],
        [
            'type' => 'arrived',
            'title' => "It's Arrived",
            'descriptions' => [
                'Arrived at customer location',
                'Engineer has reached the destination',
                'On-site and ready to begin work',
            ],
        ],
        [
            'type' => 'start_working',
            'title' => 'Start Working',
            'descriptions' => [
                'Work has commenced on the issue',
                'Diagnosing the problem',
                'Started troubleshooting and repair',
            ],
        ],
        [
            'type' => 'completed',
            'title' => 'Work Completed',
            'descriptions' => [
                'All work has been completed successfully',
                'Issue resolved and tested',
                'Work finished, customer satisfaction confirmed',
            ],
        ],
    ];

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

            // Determine how many stages to complete (random between 1-5)
            $stagesToComplete = rand(1, 5);

            $minutesElapsed = 0;

            // Create activities in sequential order
            foreach (self::TIMELINE_STAGES as $index => $stage) {
                // Only create if we're completing this many stages
                if ($index >= $stagesToComplete) {
                    break;
                }

                // Progressive time gaps between stages
                $timeGaps = [0, rand(30, 90), rand(20, 60), rand(10, 30), rand(60, 180)];
                $minutesElapsed += $timeGaps[$index];

                TicketActivity::create([
                    'ticket_id' => $ticket->id,
                    'visit_number' => 1, // Default to first visit
                    'activity_type' => $stage['type'],
                    'title' => $stage['title'],
                    'description' => $stage['descriptions'][array_rand($stage['descriptions'])],
                    'activity_time' => $baseTime->copy()->addMinutes($minutesElapsed),
                    'user_id' => $user->id,
                ]);
            }

            // Update ticket status based on completed stages
            $newStatus = match ($stagesToComplete) {
                1 => 'Need to Receive',
                2, 3, 4 => 'In Progress',
                5 => 'Finish',
                default => 'Open',
            };

            if ($ticket->status !== 'Closed') {
                $ticket->update(['status' => $newStatus]);
            }
        }
    }
}
