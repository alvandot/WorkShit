<?php

namespace App\Observers;

use App\Models\Ticket;
use App\Models\TicketStatusHistory;

class TicketObserver
{
    /**
     * Handle the Ticket "created" event.
     */
    public function created(Ticket $ticket): void
    {
        TicketStatusHistory::create([
            'ticket_id' => $ticket->id,
            'old_status' => null,
            'new_status' => $ticket->status,
            'changed_by' => $ticket->created_by,
            'notes' => 'Ticket created',
        ]);
    }

    /**
     * Handle the Ticket "updated" event.
     */
    public function updated(Ticket $ticket): void
    {
        if ($ticket->isDirty('status')) {
            TicketStatusHistory::create([
                'ticket_id' => $ticket->id,
                'old_status' => $ticket->getOriginal('status'),
                'new_status' => $ticket->status,
                'changed_by' => request()->user()?->id,
                'notes' => 'Status updated',
            ]);
        }
    }
}
