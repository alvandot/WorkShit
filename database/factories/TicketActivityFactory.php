<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketActivity>
 */
class TicketActivityFactory extends Factory
{
    /**
     * Sequential stages configuration.
     */
    private const TIMELINE_STAGES = [
        'received' => 'Ticket Received',
        'on_the_way' => 'Engineer On The Way',
        'arrived' => 'Engineer Arrived at Location',
        'start_working' => 'Started Working on Issue',
        'completed' => 'Work Completed',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Default to a valid activity type from timeline stages
        $activityType = fake()->randomElement(array_keys(self::TIMELINE_STAGES));

        return [
            'ticket_id' => \App\Models\Ticket::factory(),
            'visit_number' => 1,
            'activity_type' => $activityType,
            'title' => self::TIMELINE_STAGES[$activityType],
            'description' => fake()->optional(0.7)->paragraph(),
            'activity_time' => fake()->dateTimeBetween('-30 days', 'now'),
            'user_id' => \App\Models\User::factory(),
            'attachments' => null,
        ];
    }

    /**
     * Create a "received" activity state.
     */
    public function received(): static
    {
        return $this->state(fn (array $attributes) => [
            'activity_type' => 'received',
            'title' => self::TIMELINE_STAGES['received'],
            'description' => 'Ticket has been received and acknowledged',
        ]);
    }

    /**
     * Create an "on_the_way" activity state.
     */
    public function onTheWay(): static
    {
        return $this->state(fn (array $attributes) => [
            'activity_type' => 'on_the_way',
            'title' => self::TIMELINE_STAGES['on_the_way'],
            'description' => 'Engineer is on the way to customer location',
        ]);
    }

    /**
     * Create an "arrived" activity state.
     */
    public function arrived(): static
    {
        return $this->state(fn (array $attributes) => [
            'activity_type' => 'arrived',
            'title' => self::TIMELINE_STAGES['arrived'],
            'description' => 'Arrived at customer location',
        ]);
    }

    /**
     * Create a "start_working" activity state.
     */
    public function startWorking(): static
    {
        return $this->state(fn (array $attributes) => [
            'activity_type' => 'start_working',
            'title' => self::TIMELINE_STAGES['start_working'],
            'description' => 'Work has commenced on the issue',
        ]);
    }

    /**
     * Create a "completed" activity state.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'activity_type' => 'completed',
            'title' => self::TIMELINE_STAGES['completed'],
            'description' => 'All work has been completed successfully',
        ]);
    }

    /**
     * Set visit number for the activity.
     */
    public function forVisit(int $visitNumber): static
    {
        return $this->state(fn (array $attributes) => [
            'visit_number' => $visitNumber,
        ]);
    }
}
