<?php
// Seeder to fill missing parts for tickets that do not have a related part

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartsDummySeeder extends Seeder
{
    public function run(): void
    {
        // No longer needed: parts table does not have ticket_id. Seeder is now a no-op.
    }
}
