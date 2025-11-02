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
        $provinces = [
            ["code" => "11", "name" => "Aceh"],
            ["code" => "51", "name" => "Bali"],
            ["code" => "36", "name" => "Banten"],
            ["code" => "17", "name" => "Bengkulu"],
            ["code" => "34", "name" => "Daerah Istimewa Yogyakarta"],
            ["code" => "31", "name" => "DKI Jakarta"],
            ["code" => "75", "name" => "Gorontalo"],
            ["code" => "15", "name" => "Jambi"],
            ["code" => "32", "name" => "Jawa Barat"],
            ["code" => "33", "name" => "Jawa Tengah"],
            ["code" => "35", "name" => "Jawa Timur"],
            ["code" => "61", "name" => "Kalimantan Barat"],
            ["code" => "63", "name" => "Kalimantan Selatan"],
            ["code" => "62", "name" => "Kalimantan Tengah"],
            ["code" => "64", "name" => "Kalimantan Timur"],
            ["code" => "65", "name" => "Kalimantan Utara"],
            ["code" => "19", "name" => "Kepulauan Bangka Belitung"],
            ["code" => "21", "name" => "Kepulauan Riau"],
            ["code" => "18", "name" => "Lampung"],
            ["code" => "81", "name" => "Maluku"],
            ["code" => "82", "name" => "Maluku Utara"],
            ["code" => "52", "name" => "Nusa Tenggara Barat"],
            ["code" => "53", "name" => "Nusa Tenggara Timur"],
            ["code" => "91", "name" => "Papua"],
            ["code" => "92", "name" => "Papua Barat"],
            ["code" => "96", "name" => "Papua Barat Daya"],
            ["code" => "95", "name" => "Papua Pegunungan"],
            ["code" => "93", "name" => "Papua Selatan"],
            ["code" => "94", "name" => "Papua Tengah"],
            ["code" => "14", "name" => "Riau"],
            ["code" => "76", "name" => "Sulawesi Barat"],
            ["code" => "73", "name" => "Sulawesi Selatan"],
            ["code" => "72", "name" => "Sulawesi Tengah"],
            ["code" => "74", "name" => "Sulawesi Tenggara"],
            ["code" => "71", "name" => "Sulawesi Utara"],
            ["code" => "13", "name" => "Sumatera Barat"],
            ["code" => "16", "name" => "Sumatera Selatan"],
            ["code" => "12", "name" => "Sumatera Utara"],
        ];

        $sourceUpdatedAt = Carbon::parse('2025-07-04');

        collect($provinces)
            ->each(function (array $province) use ($sourceUpdatedAt): void {
                Province::updateOrCreate(
                    ['code' => str_pad($province['code'], 2, '0', STR_PAD_LEFT)],
                    [
                        'name' => $province['name'],
                        'source_updated_at' => $sourceUpdatedAt,
                    ]
                );
            });

        $this->outputMessage('✅ Provinces table seeded with static data', 'info');
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
