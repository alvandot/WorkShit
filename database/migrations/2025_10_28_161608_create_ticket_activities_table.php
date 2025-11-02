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
        Schema::create('ticket_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->enum('activity_type', [
                'received',
                'on_the_way',
                'arrived',
                'start_working',
                'need_part',
                'completed',
                'revisit',
                'status_change',
                'note',
            ]);
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('activity_time');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->json('attachments')->nullable(); // Store file paths as JSON
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_activities');
    }
};
