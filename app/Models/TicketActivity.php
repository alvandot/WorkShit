<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketActivity extends Model
{
    /** @use HasFactory<\Database\Factories\TicketActivityFactory> */
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'visit_number',
        'activity_type',
        'title',
        'description',
        'activity_time',
        'user_id',
        'attachments',
    ];

    protected function casts(): array
    {
        return [
            'activity_time' => 'datetime',
            'attachments' => 'array',
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
