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
            $table->text('ct_bad_part')->nullable()->change();
            $table->text('ct_good_part')->nullable()->change();
            $table->text('bap_file')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('ct_bad_part')->nullable()->change();
            $table->string('ct_good_part')->nullable()->change();
            $table->string('bap_file')->nullable()->change();
        });
    }
};
