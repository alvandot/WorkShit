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
        Schema::create('special_places', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('province_id')->constrained('provinces')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('engineer_id')->nullable()->constrained('engineers')->nullOnDelete();
            $table->string('city')->nullable();
            $table->text('address')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('special_places');
    }
};
