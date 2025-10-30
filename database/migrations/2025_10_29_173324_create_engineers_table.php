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
        Schema::create('engineers', function (Blueprint $table) {
            $table->id();
            $table->string('employee_code')->nullable()->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('specialization')->nullable();
            $table->unsignedTinyInteger('experience_years')->nullable();
            $table->foreignId('primary_province_id')->nullable()->constrained('provinces')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->date('hired_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engineers');
    }
};
