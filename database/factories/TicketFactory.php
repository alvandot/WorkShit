<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_number' => fake()->unique()->numerify('########'),
            'case_id' => fake()->numerify('##########'),
            'company' => fake()->company(),
            'address' => fake()->address(),
            'phone_number' => fake()->phoneNumber(),
            'serial_number' => fake()->bothify('??##??####??'),
            'problem' => fake()->sentence(),
            'schedule' => fake()->dateTimeBetween('now', '+1 week'),
            'deadline' => fake()->dateTimeBetween('+1 week', '+2 weeks'),
            'status' => fake()->randomElement(['Open', 'Need to Receive', 'In Progress', 'Resolved', 'Closed']),
            'assigned_to' => null,
            'created_by' => null,
            'notes' => fake()->optional()->paragraph(),
        ];
    }
}
