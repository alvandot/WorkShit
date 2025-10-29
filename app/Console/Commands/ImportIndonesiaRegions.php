<?php

namespace App\Console\Commands;

use App\Models\Regency;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ImportIndonesiaRegions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:indonesia-regions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import provinces, regencies, and districts from wilayah.id API';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting import of Indonesia regencies (Kota/Kabupaten)...');

        $this->importRegencies();

        $this->newLine();
        $this->info('Import completed successfully!');

        return Command::SUCCESS;
    }

    protected function importRegencies(): void
    {
        $this->info('Fetching all regencies from API...');

        // Get all provinces first to loop through them
        $provincesResponse = Http::withOptions(['verify' => false])
            ->get('https://wilayah.id/api/provinces.json');

        if (! $provincesResponse->successful()) {
            $this->error('Failed to fetch provinces list');

            return;
        }

        $provinces = $provincesResponse->json('data');
        $progressBar = $this->output->createProgressBar(count($provinces));
        $progressBar->start();

        foreach ($provinces as $province) {
            $response = Http::withOptions(['verify' => false])
                ->get("https://wilayah.id/api/regencies/{$province['code']}.json");

            if ($response->successful()) {
                $regencies = $response->json('data');

                if ($regencies) {
                    foreach ($regencies as $regency) {
                        Regency::updateOrCreate(
                            ['code' => $regency['code']],
                            ['name' => $regency['name']]
                        );
                    }
                }
            }

            $progressBar->advance();
            usleep(100000); // 100ms delay
        }

        $progressBar->finish();
        $this->newLine();

        $totalRegencies = Regency::count();
        $this->info("Total regencies imported: {$totalRegencies}");
    }
}
