<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    /** @use HasFactory<\Database\Factories\TicketFactory> */
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'schedule' => 'datetime',
            'deadline' => 'datetime',
            'completed_at' => 'datetime',
            'needs_revisit' => 'boolean',
            'visit_schedules' => 'array',
            'ct_bad_part' => 'array',
            'ct_good_part' => 'array',
            'bap_file' => 'array',
            'replaced_parts' => 'array',
            'visit_date' => 'datetime',
            'resolved_date' => 'datetime',
        ];
    }

    protected $fillable = [
        'ticket_number',
        'case_id',
        'company',
        'address',
        'phone_number',
        'serial_number',
        'product_number',
        'problem',
        'schedule',
        'deadline',
        'status',
        'assigned_to',
        'assigned_by',
        'created_by',
        'notes',
        'ct_bad_part',
        'ct_good_part',
        'bap_file',
        'needs_revisit',
        'current_visit',
        'visit_schedules',
        'completion_notes',
        'completed_at',
        // BAP fields
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
        'engineer_name',
    ];

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(TicketStatusHistory::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(TicketActivity::class)->orderBy('activity_time', 'asc');
    }


    public function recommendedPart(): BelongsTo
    {
        return $this->belongsTo(Part::class, 'part_recommended');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TicketAssignment::class);
    }

    public function activeAssignment(): HasMany
    {
        return $this->hasMany(TicketAssignment::class)->where('is_active', true);
    }

    public function scopeAssignedTo($query, int $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeUnassigned($query)
    {
        return $query->whereNull('assigned_to');
    }

    public function scopeWithAssignmentDetails($query)
    {
        return $query->with(['assignedTo', 'assignedBy', 'activeAssignment.assignedBy']);
    }
}
