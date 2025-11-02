<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketStatusHistory>
 */
class TicketStatusHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['Open', 'Need to Receive', 'In Progress', 'Resolved', 'Closed'];

        return [
            'ticket_id' => \App\Models\Ticket::factory(),
            'old_status' => fake()->optional()->randomElement($statuses),
            'new_status' => fake()->randomElement($statuses),
            'changed_by' => \App\Models\User::factory(),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
