<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            // Change file fields from string to JSON to support multiple files
            $table->json('ct_bad_part')->nullable()->change();
            $table->json('ct_good_part')->nullable()->change();
            $table->json('bap_file')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            // Revert back to string
            $table->string('ct_bad_part')->nullable()->change();
            $table->string('ct_good_part')->nullable()->change();
            $table->string('bap_file')->nullable()->change();
        });
    }
};
