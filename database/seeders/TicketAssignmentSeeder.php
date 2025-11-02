<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\TicketActivity;
use App\Models\TicketAssignment;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $tickets = Ticket::whereNull('assigned_to')->limit(10)->get();

        if ($users->isEmpty() || $tickets->isEmpty()) {
            $this->command->info('No users or tickets available for assignment seeding.');
            return;
        }

        foreach ($tickets as $ticket) {
            $assignedTo = $users->random();
            $assignedBy = $users->random();

            $assignment = TicketAssignment::create([
                'ticket_id' => $ticket->id,
                'assigned_to' => $assignedTo->id,
                'assigned_by' => $assignedBy->id,
                'notes' => 'Auto-assigned during seeding',
                'is_active' => true,
            ]);

            $ticket->update([
                'assigned_to' => $assignedTo->id,
                'assigned_by' => $assignedBy->id,
            ]);

            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $assignedBy->id,
                'activity_type' => 'assigned',
                'title' => 'Ticket assigned',
                'description' => "Assigned to {$assignedTo->name}",
                // 'activity_time' => $assignment->assigned_at, // removed
            ]);
        }

        $this->command->info('Successfully seeded ' . $tickets->count() . ' ticket assignments.');
    }
}
