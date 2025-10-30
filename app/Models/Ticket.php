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
            'assigned_at' => 'datetime',
            'needs_revisit' => 'boolean',
            'visit_schedules' => 'array',
            'ct_bad_part' => 'array',
            'ct_good_part' => 'array',
            'bap_file' => 'array',
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
        'assigned_at',
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

    public function parts(): HasMany
    {
        return $this->hasMany(Part::class);
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
