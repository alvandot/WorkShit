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
        ];
    }

    protected $fillable = [
        'ticket_number',
        'case_id',
        'company',
        'serial_number',
        'problem',
        'schedule',
        'deadline',
        'status',
        'assigned_to',
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
}
