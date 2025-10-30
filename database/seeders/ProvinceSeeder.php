<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $endpoint = 'https://wilayah.id/api/provinces.json';

        $response = Http::timeout(15)
            ->retry(3, 1000)
            ->acceptJson()
            ->get($endpoint);

        if ($response->failed()) {
            $this->outputMessage('⚠️  Unable to fetch provinces from wilayah.id. Seeder skipped.');

            return;
        }

        $provinces = $response->json('data');

        if (!is_array($provinces)) {
            $this->outputMessage('⚠️  Invalid provinces response received. Seeder skipped.');

            return;
        }

        $sourceUpdatedAt = $this->parseDate($response->json('meta.updated_at') ?? null);

        collect($provinces)
            ->filter(fn ($province) => is_array($province) && isset($province['code'], $province['name']))
            ->each(function (array $province) use ($sourceUpdatedAt): void {
                Province::updateOrCreate(
                    ['code' => Str::padLeft($province['code'], 2, '0')],
                    [
                        'name' => $province['name'],
                        'source_updated_at' => $sourceUpdatedAt,
                    ]
                );
            });

        $this->outputMessage('✅ Provinces table synced from wilayah.id', 'info');
    }

    private function parseDate(?string $value): ?Carbon
    {
        if (!$value) {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (\Throwable $exception) {
            $this->outputMessage('⚠️  Unable to parse province updated_at timestamp: '.$exception->getMessage());

            return null;
        }
    }

    private function outputMessage(string $message, string $level = 'warn'): void
    {
        if (isset($this->command)) {
            $this->command->{$level}($message);

            return;
        }

        logger()->{$level === 'info' ? 'info' : 'warning'}($message);
    }
}
