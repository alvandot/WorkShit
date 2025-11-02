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
            // Add product_number if not exists (needed for BAP)
            if (! Schema::hasColumn('tickets', 'product_number')) {
                $table->string('product_number')->nullable()->after('serial_number');
            }

            // Add engineer_name for BAP signature section
            if (! Schema::hasColumn('tickets', 'engineer_name')) {
                $table->string('engineer_name')->nullable()->after('engineer_signature');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            if (Schema::hasColumn('tickets', 'engineer_name')) {
                $table->dropColumn('engineer_name');
            }
            if (Schema::hasColumn('tickets', 'product_number')) {
                $table->dropColumn('product_number');
            }
        });
    }
};
