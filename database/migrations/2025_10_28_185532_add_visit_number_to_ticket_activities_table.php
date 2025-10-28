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
        Schema::table('ticket_activities', function (Blueprint $table) {
            $table->unsignedInteger('visit_number')->default(1)->after('ticket_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ticket_activities', function (Blueprint $table) {
            $table->dropColumn('visit_number');
        });
    }
};
