<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Part>
 */
class PartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $partNames = [
            'Keyboard',
            'LCD Screen',
            'Battery',
            'Hard Drive',
            'RAM Module',
            'Motherboard',
            'Power Adapter',
            'Cooling Fan',
            'WiFi Card',
            'Touchpad',
        ];

        return [
            'ticket_id' => \App\Models\Ticket::factory(),
            'part_name' => fake()->randomElement($partNames),
            'quantity' => fake()->numberBetween(1, 5),
            'serial_number' => fake()->optional(0.7)->bothify('SN-####-????-####'),
        ];
    }
}
