<?php

namespace App\Exports;

use App\Models\Ticket;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TicketsExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Ticket::with(['assignedTo', 'assignedBy', 'createdBy'])->get();
    }

    public function headings(): array
    {
        return [
            'Ticket Number',
            'Case ID',
            'Company',
            'Serial Number',
            'Problem',
            'Schedule',
            'Deadline',
            'Status',
            'Assigned To',
            'Assigned At',
            'Assigned By',
            'Created By',
            'Created At',
        ];
    }

    /**
     * @param  Ticket  $ticket
     */
    public function map($ticket): array
    {
        return [
            $ticket->ticket_number,
            $ticket->case_id,
            $ticket->company,
            $ticket->serial_number,
            $ticket->problem,
            $ticket->schedule?->format('Y-m-d H:i:s'),
            $ticket->deadline?->format('Y-m-d H:i:s'),
            $ticket->status,
            $ticket->assignedTo?->name ?? 'Unassigned',
            $ticket->assigned_at?->format('Y-m-d H:i:s') ?? '-',
            $ticket->assignedBy?->name ?? '-',
            $ticket->createdBy?->name,
            $ticket->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
