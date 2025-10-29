<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketActivity>
 */
class TicketActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $activityTypes = [
            'received',
            'on_the_way',
            'arrived',
            'start_working',
            'need_part',
            'completed',
            'revisit',
            'status_change',
            'note',
        ];

        $activityType = fake()->randomElement($activityTypes);

        $titles = [
            'received' => 'Ticket Received',
            'on_the_way' => 'Engineer On The Way',
            'arrived' => 'Engineer Arrived at Location',
            'start_working' => 'Started Working on Issue',
            'need_part' => 'Waiting for Replacement Part',
            'completed' => 'Work Completed',
            'revisit' => 'Scheduled for Revisit',
            'status_change' => 'Status Changed',
            'note' => 'Added Note',
        ];

        return [
            'ticket_id' => \App\Models\Ticket::factory(),
            'activity_type' => $activityType,
            'title' => $titles[$activityType] ?? fake()->sentence(3),
            'description' => fake()->optional(0.7)->paragraph(),
            'activity_time' => fake()->dateTimeBetween('-30 days', 'now'),
            'user_id' => \App\Models\User::factory(),
            'attachments' => fake()->optional(0.3)->randomElements(
                ['photo1.jpg', 'photo2.jpg', 'document.pdf'],
                fake()->numberBetween(1, 2)
            ),
        ];
    }
}
