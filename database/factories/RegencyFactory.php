<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Regency>
 */
class RegencyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cities = [
            ['code' => '31.71', 'name' => 'Kota Jakarta Pusat'],
            ['code' => '31.72', 'name' => 'Kota Jakarta Utara'],
            ['code' => '32.73', 'name' => 'Kota Bandung'],
            ['code' => '33.71', 'name' => 'Kota Semarang'],
            ['code' => '35.78', 'name' => 'Kota Surabaya'],
            ['code' => '12.71', 'name' => 'Kota Medan'],
            ['code' => '73.71', 'name' => 'Kota Makassar'],
            ['code' => '64.71', 'name' => 'Kota Balikpapan'],
        ];

        $city = fake()->randomElement($cities);

        return [
            'code' => $city['code'],
            'name' => $city['name'],
        ];
    }
}
