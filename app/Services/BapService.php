<?php

namespace App\Services;

use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class BapService
{
    /**
     * Generate BAP PDF untuk ticket
     */
    public function generateBapPdf(Ticket $ticket)
    {
        // Load ticket dengan relationships
        $ticket->load(['assignedTo', 'createdBy']);

        // Prepare data untuk template
        $data = $this->prepareData($ticket);

        // Generate PDF with proper configuration
        $pdf = Pdf::loadView('pdf.bap', $data);

        // Set paper size dan orientation
        $pdf->setPaper('a4', 'portrait');

        // Set options for better rendering
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => false,
            'defaultFont' => 'dejavu sans',
        ]);

        return $pdf;
    }

    /**
     * Prepare data untuk BAP template
     * Support untuk draft BAP (ticket belum complete)
     */
    private function prepareData(Ticket $ticket): array
    {
        // Generate temporary BAP code if not exists
        $bapCode = $ticket->bap_code ?? $this->generateTempBapCode($ticket);

        return [
            'ticket' => $ticket,
            'bap_code' => $bapCode,
            'ticket_number' => $ticket->ticket_number,
            'case_id' => $ticket->case_id ?? $ticket->ticket_number,

            // Visit Information - Use today's date if not set
            'visit_date' => $ticket->visit_date
                ? $ticket->visit_date->format('d/m/Y')
                : ($ticket->schedule ? $ticket->schedule->format('d/m/Y') : now()->format('d/m/Y')),
            'visit_time' => $ticket->visit_time ?? now()->format('H:i').' WIB',

            // Case Details
            'serial_number' => $ticket->serial_number ?? '',
            'product_number' => $ticket->product_number ?? '',
            'unit_type' => $ticket->unit_type ?? 'Laptop',
            'category' => $ticket->category ?? 'Incident',
            'scope' => $ticket->scope ?? 'Maintenance Support',
            'warranty_status' => $ticket->warranty_status ?? 'Warranty',
            'case_description' => $ticket->case_description ?? $ticket->problem ?? '',

            // User Information
            'user_name' => $ticket->user_name ?? '',
            'user_id_number' => $ticket->user_id_number ?? '',
            'location' => $ticket->location ?? $ticket->address ?? '',
            'company' => $ticket->company ?? '',
            'user_phone' => $ticket->user_phone ?? $ticket->phone_number ?? '',
            'user_email' => $ticket->user_email ?? '',

            // Work Information
            'work_notes' => $ticket->work_notes ?? $ticket->completion_notes ?? '',
            'solution_category' => $ticket->solution_category ?? 'Repair',

            // Replaced Parts
            'replaced_parts' => $ticket->replaced_parts ?? [],

            // Resolution Information
            'resolved_date' => $ticket->resolved_date
                ? $ticket->resolved_date->format('d/m/Y')
                : ($ticket->completed_at ? $ticket->completed_at->format('d/m/Y') : now()->format('d/m/Y')),
            'resolved_time' => $ticket->resolved_time
                ?? ($ticket->completed_at ? $ticket->completed_at->format('H:i').' WIB' : now()->format('H:i').' WIB'),

            // Engineer Information
            'engineer_name' => $ticket->assignedTo?->name ?? '',

            // Signatures
            'user_signature' => $ticket->user_signature,
            'engineer_signature' => $ticket->engineer_signature,

            // Disclaimer
            'disclaimer' => $ticket->disclaimer_agreement ?? 'Dengan ini saya mengakui bahwa informasi di atas adalah benar dan bahwa pihak HP tidak bertanggung jawab atas kehilangan / kerusakan data setelah Berita Acara ini ditandatangani.',

            // Generated date
            'generated_at' => Carbon::now()->format('d/m/Y H:i'),
        ];
    }

    /**
     * Generate temporary BAP code for draft/preview
     */
    private function generateTempBapCode(Ticket $ticket): string
    {
        $date = Carbon::now()->format('Ymd');

        return sprintf('BAP-%s-DRAFT', $date);
    }

    /**
     * Auto-generate BAP code jika belum ada
     */
    public function generateBapCode(Ticket $ticket): string
    {
        if ($ticket->bap_code) {
            return $ticket->bap_code;
        }

        // Format: BAP-YYYYMMDD-XXXX
        $date = Carbon::now()->format('Ymd');
        $count = Ticket::whereDate('created_at', Carbon::today())
            ->whereNotNull('bap_code')
            ->count() + 1;

        $code = sprintf('BAP-%s-%04d', $date, $count);

        $ticket->update(['bap_code' => $code]);

        return $code;
    }

    /**
     * Download BAP PDF
     */
    public function downloadBap(Ticket $ticket)
    {
        // Generate BAP code jika belum ada
        $this->generateBapCode($ticket);

        $pdf = $this->generateBapPdf($ticket);

        $filename = sprintf('BAP-%s-%s.pdf', $ticket->ticket_number, Carbon::now()->format('Ymd'));

        return $pdf->download($filename);
    }

    /**
     * Stream BAP PDF (untuk preview)
     */
    public function streamBap(Ticket $ticket)
    {
        $this->generateBapCode($ticket);

        $pdf = $this->generateBapPdf($ticket);

        return $pdf->stream();
    }
}
