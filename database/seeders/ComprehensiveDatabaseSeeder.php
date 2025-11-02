<?php

namespace Database\Seeders;

use App\Models\Part;
use App\Models\Ticket;
use App\Models\TicketActivity;
use App\Models\TicketStatusHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

class ComprehensiveDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting comprehensive database seeding...');

        // 1. Create Users (Engineers & Admins)
        $this->command->info('👥 Creating users...');
        $admin = User::firstOrCreate(
            ['email' => 'admin@appdesk.test'],
            [
                'name' => 'Admin User',
                'password' => 'password',
            ]
        );

        $engineers = User::factory(10)
            ->withoutTwoFactor()
            ->create();

        $this->command->info("✓ Created {$engineers->count()} engineers + 1 admin");

        // 2. Create Tickets with different statuses
        $this->command->info('🎫 Creating tickets...');

        $openTickets = Ticket::factory(5)->create([
            'status' => 'Open',
            'assigned_to' => null,
        ]);

        $inProgressTickets = Ticket::factory(8)->create([
            'status' => 'In Progress',
            'assigned_to' => $engineers->random()->id,
        ]);

        $resolvedTickets = Ticket::factory(6)->create([
            'status' => 'Resolved',
            'assigned_to' => $engineers->random()->id,
            'completed_at' => now()->subDays(rand(1, 7)),
        ]);

        $closedTickets = Ticket::factory(3)->create([
            'status' => 'Closed',
            'assigned_to' => $engineers->random()->id,
            'completed_at' => now()->subDays(rand(8, 30)),
        ]);

        $allTickets = $openTickets
            ->merge($inProgressTickets)
            ->merge($resolvedTickets)
            ->merge($closedTickets);

        $this->command->info("✓ Created {$allTickets->count()} tickets");

        // 3. Create Parts for tickets
        $this->command->info('🔧 Creating parts...');
        $partCount = 0;

        foreach ($allTickets as $ticket) {
            // Random number of parts (0-5)
            $numParts = rand(0, 5);

            if ($numParts > 0) {
                Part::factory($numParts)->create([
                    'ticket_id' => $ticket->id,
                ]);
                $partCount += $numParts;
            }
        }

        $this->command->info("✓ Created {$partCount} parts");

        // 4. Create Ticket Activities
        $this->command->info('📝 Creating ticket activities...');
        $activityCount = 0;

        foreach ($allTickets as $ticket) {
            // Each ticket gets 1-7 activities
            $numActivities = rand(1, 7);

            TicketActivity::factory($numActivities)->create([
                'ticket_id' => $ticket->id,
                'user_id' => $ticket->assigned_to ?? $admin->id,
            ]);

            $activityCount += $numActivities;
        }

        $this->command->info("✓ Created {$activityCount} activities");

        // 5. Create Status History
        $this->command->info('📊 Creating status history...');
        $historyCount = 0;

        foreach ($allTickets as $ticket) {
            // Create initial status history
            TicketStatusHistory::create([
                'ticket_id' => $ticket->id,
                'old_status' => null,
                'new_status' => 'Open',
                'changed_by' => $ticket->assigned_by ?? $admin->id,
                'notes' => 'Ticket created',
            ]);
            $historyCount++;

            // Add 1-3 more status changes for non-open tickets
            if ($ticket->status !== 'Open') {
                $statusProgression = $this->getStatusProgression($ticket->status);

                foreach ($statusProgression as $status) {
                    TicketStatusHistory::factory()->create([
                        'ticket_id' => $ticket->id,
                        'new_status' => $status,
                        'changed_by' => $ticket->assigned_to ?? $admin->id,
                    ]);
                    $historyCount++;
                }
            }
        }

        $this->command->info("✓ Created {$historyCount} status history records");

        // Summary
        $this->command->newLine();
        $this->command->info('✅ Seeding completed successfully!');
        $this->command->table(
            ['Model', 'Count'],
            [
                ['Users', User::count()],
                ['Tickets', Ticket::count()],
                ['Parts', Part::count()],
                ['Activities', TicketActivity::count()],
                ['Status History', TicketStatusHistory::count()],
            ]
        );
    }

    /**
     * Get status progression for a given final status.
     */
    private function getStatusProgression(string $finalStatus): array
    {
        return match ($finalStatus) {
            'In Progress' => ['Need to Receive'],
            'Resolved' => ['Need to Receive', 'In Progress'],
            'Closed' => ['Need to Receive', 'In Progress', 'Resolved'],
            default => [],
        };
    }
}
