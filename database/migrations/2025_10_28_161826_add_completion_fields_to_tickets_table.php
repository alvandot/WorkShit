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
            $table->string('ct_bad_part')->nullable()->after('notes');
            $table->string('ct_good_part')->nullable()->after('ct_bad_part');
            $table->string('bap_file')->nullable()->after('ct_good_part');
            $table->boolean('needs_revisit')->default(false)->after('bap_file');
            $table->text('completion_notes')->nullable()->after('needs_revisit');
            $table->timestamp('completed_at')->nullable()->after('completion_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'ct_bad_part',
                'ct_good_part',
                'bap_file',
                'needs_revisit',
                'completion_notes',
                'completed_at',
            ]);
        });
    }
};
