<?php

// Migration to update parts and tickets relationship
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Remove ticket_id from parts
        Schema::table('parts', function (Blueprint $table) {
            $table->dropForeign(['ticket_id']);
            $table->dropColumn('ticket_id');
        });
        // Change part_recommended in tickets to unsignedBigInteger and add foreign key
        Schema::table('tickets', function (Blueprint $table) {
            $table->unsignedBigInteger('part_recommended')->nullable()->change();
            $table->foreign('part_recommended')->references('id')->on('parts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Add ticket_id back to parts
        Schema::table('parts', function (Blueprint $table) {
            $table->foreignId('ticket_id')->nullable()->constrained()->onDelete('cascade');
        });
        // Revert part_recommended in tickets to string
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['part_recommended']);
            $table->string('part_recommended')->nullable()->change();
        });
    }
};
