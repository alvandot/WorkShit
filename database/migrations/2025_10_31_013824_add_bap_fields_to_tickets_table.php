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
            $table->string('bap_code')->nullable()->after('ticket_number');
            $table->string('user_name')->nullable()->after('company');
            $table->string('user_id_number')->nullable()->after('user_name');
            $table->string('location')->nullable()->after('address');
            $table->string('user_phone')->nullable()->after('phone_number');
            $table->string('user_email')->nullable()->after('user_phone');
            $table->enum('unit_type', ['Desktop', 'Laptop', 'Printer', 'Projector', 'Scanner', 'Monitor', 'Other'])->nullable()->after('serial_number');
            $table->enum('category', ['Incident', 'Request'])->nullable()->after('unit_type');
            $table->enum('scope', ['Maintenance Support', 'Void', 'Out of Scope'])->nullable()->after('category');
            $table->enum('warranty_status', ['Warranty', 'Out of Warranty'])->nullable()->after('scope');
            $table->text('case_description')->nullable()->after('problem');
            $table->text('work_notes')->nullable()->after('case_description');
            $table->enum('solution_category', ['Repair', 'Re/Install', 'Reimage', 'Pemindahan Data', 'Other'])->nullable()->after('work_notes');
            $table->json('replaced_parts')->nullable()->after('solution_category');
            $table->timestamp('visit_date')->nullable()->after('schedule');
            $table->time('visit_time')->nullable()->after('visit_date');
            $table->timestamp('resolved_date')->nullable()->after('completed_at');
            $table->time('resolved_time')->nullable()->after('resolved_date');
            $table->text('disclaimer_agreement')->nullable()->after('completion_notes');
            $table->text('user_signature')->nullable()->after('disclaimer_agreement');
            $table->text('engineer_signature')->nullable()->after('user_signature');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'bap_code',
                'user_name',
                'user_id_number',
                'location',
                'user_phone',
                'user_email',
                'unit_type',
                'category',
                'scope',
                'warranty_status',
                'case_description',
                'work_notes',
                'solution_category',
                'replaced_parts',
                'visit_date',
                'visit_time',
                'resolved_date',
                'resolved_time',
                'disclaimer_agreement',
                'user_signature',
                'engineer_signature',
            ]);
        });
    }
};
