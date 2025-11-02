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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->string('case_id')->nullable();
            $table->string('company');
            $table->string('pic')->nullable(); // Person in Charge
            $table->string('phone_number_2')->nullable();
            $table->string('email')->nullable();
            $table->string('unit')->nullable();
            $table->string('serial_number')->nullable();
            $table->text('problem');
            $table->dateTime('schedule')->nullable();
            $table->dateTime('deadline')->nullable();
            $table->enum('status', ['Open', 'Need to Receive', 'In Progress', 'Finish', 'Closed'])->default('Open');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('part_recommended')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
