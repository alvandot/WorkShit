<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketActivity;
use App\Models\TicketAssignment;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TicketAssignmentController extends Controller
{
    /**
     * Display assignments dashboard
     */
    public function index(Request $request): Response
    {
        $query = TicketAssignment::query()
            ->with(['ticket', 'assignedTo', 'assignedBy'])
            ->active();

        // Filter by engineer
        if ($request->has('engineer_id') && $request->engineer_id) {
            $query->forEngineer($request->engineer_id);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->where('assigned_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->where('assigned_at', '<=', $request->date_to);
        }

        $assignments = $query->latest('assigned_at')->paginate(20)->withQueryString();

        // Get engineer workload statistics
        $engineerStats = User::query()
            ->select('users.id', 'users.name', 'users.email')
            ->withCount([
                'assignedTickets as active_tickets_count' => function ($query) {
                    $query->whereNotIn('status', ['Closed', 'Finish']);
                },
                'assignedTickets as total_tickets_count',
                'assignedTickets as completed_tickets_count' => function ($query) {
                    $query->whereIn('status', ['Closed', 'Finish']);
                },
            ])
            ->having('total_tickets_count', '>', 0)
            ->orderBy('active_tickets_count', 'desc')
            ->get();

        return Inertia::render('assignments/index', [
            'assignments' => $assignments,
            'engineerStats' => $engineerStats,
            'engineers' => User::select('id', 'name', 'email')->get(),
            'filters' => [
                'engineer_id' => $request->engineer_id,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
        ]);
    }

    /**
     * Assign a ticket to an engineer
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'assigned_to' => 'required|exists:users,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        $ticket = Ticket::findOrFail($validated['ticket_id']);

        // Check if ticket is closed
        if ($ticket->status === 'Closed') {
            return back()->withErrors(['error' => 'Cannot assign a closed ticket.']);
        }

        DB::transaction(function () use ($ticket, $validated, $request) {
            // Deactivate previous assignments
            TicketAssignment::where('ticket_id', $ticket->id)
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'unassigned_at' => now(),
                    'unassigned_by' => $request->user()->id,
                ]);

            // Create new assignment
            $assignment = TicketAssignment::create([
                'ticket_id' => $ticket->id,
                'assigned_to' => $validated['assigned_to'],
                'assigned_by' => $request->user()->id,
                'assigned_at' => now(),
                'notes' => $validated['notes'] ?? null,
                'is_active' => true,
            ]);

            // Update ticket
            $ticket->update([
                'assigned_to' => $validated['assigned_to'],
                'assigned_at' => now(),
                'assigned_by' => $request->user()->id,
            ]);

            // Log activity
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $request->user()->id,
                'activity_type' => 'assigned',
                'title' => 'Ticket assigned',
                'description' => "Assigned to {$assignment->assignedTo->name}" .
                    ($validated['notes'] ? " - {$validated['notes']}" : ''),
                'activity_time' => now(),
            ]);

            // Send WhatsApp notification
            if ($assignment->assignedTo->phone_number) {
                $whatsappService = app(WhatsAppService::class);
                $message = "Halo {$assignment->assignedTo->name}, Anda telah ditugaskan tiket #{$ticket->ticket_number}. Problem: {$ticket->problem}. Silakan periksa aplikasi untuk detail lebih lanjut.";
                $whatsappService->sendMessage($assignment->assignedTo->phone_number, $message);
            }
        });

        return back()->with('success', 'Ticket assigned successfully.');
    }

    /**
     * Unassign a ticket
     */
    public function destroy(Request $request, Ticket $ticket)
    {
        // Check if ticket is closed
        if ($ticket->status === 'Closed') {
            return back()->withErrors(['error' => 'Cannot unassign a closed ticket.']);
        }

        DB::transaction(function () use ($ticket, $request) {
            // Deactivate current assignments
            TicketAssignment::where('ticket_id', $ticket->id)
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'unassigned_at' => now(),
                    'unassigned_by' => $request->user()->id,
                ]);

            // Clear ticket assignment
            $ticket->update([
                'assigned_to' => null,
                'assigned_at' => null,
                'assigned_by' => null,
            ]);

            // Log activity
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $request->user()->id,
                'activity_type' => 'unassigned',
                'title' => 'Ticket unassigned',
                'description' => 'Engineer assignment removed',
                'activity_time' => now(),
            ]);
        });

        return back()->with('success', 'Ticket unassigned successfully.');
    }

    /**
     * Bulk assign tickets
     */
    public function bulkAssign(Request $request)
    {
        $validated = $request->validate([
            'ticket_ids' => 'required|array|min:1',
            'ticket_ids.*' => 'exists:tickets,id',
            'assigned_to' => 'required|exists:users,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        $tickets = Ticket::whereIn('id', $validated['ticket_ids'])
            ->where('status', '!=', 'Closed')
            ->get();

        if ($tickets->isEmpty()) {
            return back()->withErrors(['error' => 'No valid tickets to assign.']);
        }

        DB::transaction(function () use ($tickets, $validated, $request) {
            foreach ($tickets as $ticket) {
                // Deactivate previous assignments
                TicketAssignment::where('ticket_id', $ticket->id)
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'unassigned_at' => now(),
                        'unassigned_by' => $request->user()->id,
                    ]);

                // Create new assignment
                $assignment = TicketAssignment::create([
                    'ticket_id' => $ticket->id,
                    'assigned_to' => $validated['assigned_to'],
                    'assigned_by' => $request->user()->id,
                    'assigned_at' => now(),
                    'notes' => $validated['notes'] ?? null,
                    'is_active' => true,
                ]);

                // Update ticket
                $ticket->update([
                    'assigned_to' => $validated['assigned_to'],
                    'assigned_at' => now(),
                    'assigned_by' => $request->user()->id,
                ]);

                // Log activity
                TicketActivity::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $request->user()->id,
                    'activity_type' => 'assigned',
                    'title' => 'Ticket assigned (bulk)',
                    'description' => "Assigned to {$assignment->assignedTo->name}" .
                        ($validated['notes'] ? " - {$validated['notes']}" : ''),
                    'activity_time' => now(),
                ]);

                // Send WhatsApp notification
                if ($assignment->assignedTo->phone_number) {
                    $whatsappService = app(WhatsAppService::class);
                    $message = "Halo {$assignment->assignedTo->name}, Anda telah ditugaskan tiket #{$ticket->ticket_number} (bulk assignment). Problem: {$ticket->problem}. Silakan periksa aplikasi untuk detail lebih lanjut.";
                    $whatsappService->sendMessage($assignment->assignedTo->phone_number, $message);
                }
            }
        });

        $count = $tickets->count();
        return back()->with('success', "{$count} ticket(s) assigned successfully.");
    }

    /**
     * Reassign a ticket to a different engineer
     */
    public function reassign(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check if ticket is closed
        if ($ticket->status === 'Closed') {
            return back()->withErrors(['error' => 'Cannot reassign a closed ticket.']);
        }

        // Check if already assigned to this engineer
        if ($ticket->assigned_to == $validated['assigned_to']) {
            return back()->withErrors(['error' => 'Ticket is already assigned to this engineer.']);
        }

        DB::transaction(function () use ($ticket, $validated, $request) {
            $previousEngineer = $ticket->assignedTo?->name;

            // Deactivate previous assignment
            TicketAssignment::where('ticket_id', $ticket->id)
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'unassigned_at' => now(),
                    'unassigned_by' => $request->user()->id,
                ]);

            // Create new assignment
            $assignment = TicketAssignment::create([
                'ticket_id' => $ticket->id,
                'assigned_to' => $validated['assigned_to'],
                'assigned_by' => $request->user()->id,
                'assigned_at' => now(),
                'notes' => $validated['notes'] ?? null,
                'is_active' => true,
            ]);

            // Update ticket
            $ticket->update([
                'assigned_to' => $validated['assigned_to'],
                'assigned_at' => now(),
                'assigned_by' => $request->user()->id,
            ]);

            // Log activity
            TicketActivity::create([
                'ticket_id' => $ticket->id,
                'user_id' => $request->user()->id,
                'activity_type' => 'reassigned',
                'title' => 'Ticket reassigned',
                'description' => "Reassigned from {$previousEngineer} to {$assignment->assignedTo->name}" .
                    ($validated['notes'] ? " - {$validated['notes']}" : ''),
                'activity_time' => now(),
            ]);

            // Send WhatsApp notification
            if ($assignment->assignedTo->phone_number) {
                $whatsappService = app(WhatsAppService::class);
                $message = "Halo {$assignment->assignedTo->name}, Tiket #{$ticket->ticket_number} telah di-reassign ke Anda. Problem: {$ticket->problem}. Silakan periksa aplikasi untuk detail lebih lanjut.";
                $whatsappService->sendMessage($assignment->assignedTo->phone_number, $message);
            }
        });

        return back()->with('success', 'Ticket reassigned successfully.');
    }

    /**
     * Get assignment history for a ticket
     */
    public function history(Ticket $ticket): Response
    {
        $assignments = TicketAssignment::where('ticket_id', $ticket->id)
            ->with(['assignedTo', 'assignedBy', 'unassignedBy'])
            ->orderBy('assigned_at', 'desc')
            ->get();

        return Inertia::render('assignments/history', [
            'ticket' => $ticket->load(['assignedTo', 'createdBy']),
            'assignments' => $assignments,
        ]);
    }
}
