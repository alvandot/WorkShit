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
            $table->string('serial_number')->nullable();
            $table->text('problem');
            $table->string('status')->default('Open');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('schedule')->nullable();
            $table->timestamp('deadline')->nullable();
            $table->string('notes')->nullable();
            $table->json('ct_bad_part')->nullable();
            $table->json('ct_good_part')->nullable();
            $table->json('bap_file')->nullable();
            $table->text('completion_notes')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->boolean('needs_revisit')->default(false);
            $table->unsignedTinyInteger('current_visit')->default(1);
            $table->json('visit_schedules')->nullable();
            $table->softDeletes();
            $table->timestamps();
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
