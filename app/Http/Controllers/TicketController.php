<?php

namespace App\Http\Controllers;

use App\Exports\TicketsExport;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Ticket::query()->with(['assignedTo', 'createdBy']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('case_id', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('problem', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            if (strtolower($request->status) === 'open') {
                // 'Open' means all tickets except Closed
                $query->where('status', '!=', 'Closed');
            } else {
                // Specific status filter
                $query->where('status', $request->status);
            }
        }

        $tickets = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('tickets/create', [
            'users' => \App\Models\User::select('id', 'name', 'email')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_number' => 'required|string|unique:tickets,ticket_number',
            'case_id' => 'nullable|string',
            'company' => 'required|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'problem' => 'required|string',
            'schedule' => 'nullable|date',
            'deadline' => 'nullable|date',
            'status' => 'required|in:Open,Need to Receive,In Progress,Resolved,Closed',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()?->id;

        Ticket::create($validated);

        return redirect()->route('tickets.index')->with('success', 'Ticket created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket): Response
    {
        return Inertia::render('tickets/show', [
            'ticket' => $ticket->load([
                'assignedTo',
                'createdBy',
                'statusHistories.changedBy',
            ]),
        ]);
    }

    /**
     * Display complete details of the ticket with all relations and history.
     */
    public function detail(Ticket $ticket): Response
    {
        $ticket->load([
            'assignedTo',
            'createdBy',
            'activities.user',
            'statusHistories.changedBy',
        ]);

        return Inertia::render('tickets/detail', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket): Response
    {
        return Inertia::render('tickets/edit', [
            'ticket' => $ticket,
            'users' => \App\Models\User::select('id', 'name', 'email')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'ticket_number' => 'required|string|unique:tickets,ticket_number,'.$ticket->id,
            'case_id' => 'nullable|string',
            'company' => 'required|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'problem' => 'required|string',
            'schedule' => 'nullable|date',
            'deadline' => 'nullable|date',
            'status' => 'required|in:Open,Need to Receive,In Progress,Resolved,Closed',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $ticket->update($validated);

        return redirect()->route('tickets.index')->with('success', 'Ticket updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return redirect()->route('tickets.index')->with('success', 'Ticket deleted successfully.');
    }

    /**
     * Export tickets to Excel.
     */
    public function export()
    {
        return Excel::download(new TicketsExport, 'tickets-'.now()->format('Y-m-d').'.xlsx');
    }

    /**
     * Display ticket timeline with activities.
     */
    public function timeline(Ticket $ticket): Response
    {
        $ticket->load(['assignedTo', 'createdBy', 'activities.user']);

        // Transform the data to match frontend expectations
        $ticketData = $ticket->toArray();
        $ticketData['assigned_to_user'] = $ticket->assignedTo;
        $ticketData['created_by_user'] = $ticket->createdBy;
        $ticketData['activities'] = $ticket->activities->map(function ($activity) {
            $activityData = $activity->toArray();
            $activityData['user'] = $activity->user;

            return $activityData;
        });

        return Inertia::render('tickets/timeline', [
            'ticket' => $ticketData,
        ]);
    }

    /**
     * Add a new activity to the ticket timeline.
     */
    public function addActivity(Request $request, Ticket $ticket)
    {
        // Prevent adding activity to closed tickets
        if ($ticket->status === 'Closed') {
            return back()->withErrors(['error' => 'Cannot add activity to a closed ticket.']);
        }

        $validated = $request->validate([
            'activity_type' => 'required|in:received,on_the_way,arrived,start_working,need_part,completed,revisit,status_change,note',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'activity_time' => 'required|date',
        ]);

        // Update ticket status based on activity type
        $statusMap = [
            'received' => 'In Progress',
            'on_the_way' => 'In Progress',
            'arrived' => 'In Progress',
            'start_working' => 'In Progress',
            'completed' => 'Resolved',
        ];

        $newStatus = $statusMap[$validated['activity_type']] ?? $ticket->status;

        $ticket->activities()->create([
            ...$validated,
            'user_id' => $request->user()->id,
            'visit_number' => $ticket->current_visit,
        ]);

        // Update ticket status
        $ticket->update(['status' => $newStatus]);

        return back()->with('success', 'Activity added successfully.');
    }

    /**
     * Mark ticket as completed with file uploads.
     */
    public function complete(Request $request, Ticket $ticket)
    {
        // Prevent completing closed tickets
        if ($ticket->status === 'Closed') {
            return back()->withErrors(['error' => 'Cannot complete a closed ticket.']);
        }

        $validated = $request->validate([
            'ct_bad_part' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'ct_good_part' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'bap_file' => 'nullable|file|mimes:jpg,jpeg,png|max:20480', // Changed to jpg/jpeg/png and 20MB
            'completion_notes' => 'nullable|string',
        ]);

        if ($request->hasFile('ct_bad_part')) {
            $file = $request->file('ct_bad_part');
            $extension = $file->getClientOriginalExtension();
            $filename = 'CTBAD_' . $ticket->ticket_number . '_' . now()->format('Y-m-d') . '.' . $extension;
            $validated['ct_bad_part'] = $file->storeAs('tickets/ct_bad_parts', $filename, 'public');
        }

        if ($request->hasFile('ct_good_part')) {
            $file = $request->file('ct_good_part');
            $extension = $file->getClientOriginalExtension();
            $filename = 'CTGOOD_' . $ticket->ticket_number . '_' . now()->format('Y-m-d') . '.' . $extension;
            $validated['ct_good_part'] = $file->storeAs('tickets/ct_good_parts', $filename, 'public');
        }

        if ($request->hasFile('bap_file')) {
            $file = $request->file('bap_file');
            $extension = $file->getClientOriginalExtension();
            $filename = 'BAP_' . $ticket->ticket_number . '_' . now()->format('Y-m-d') . '.' . $extension;
            $validated['bap_file'] = $file->storeAs('tickets/bap_files', $filename, 'public');
        }

        // Update visit schedules status to completed
        $visitSchedules = $ticket->visit_schedules ?? [];
        if (isset($visitSchedules[$ticket->current_visit])) {
            $visitSchedules[$ticket->current_visit]['status'] = 'completed';
        }

        $ticket->update([
            ...$validated,
            'status' => 'In Progress', // Keep status as In Progress instead of Resolved
            'completed_at' => now(),
            'visit_schedules' => $visitSchedules,
        ]);

        // Add completion activity
        $ticket->activities()->create([
            'activity_type' => 'completed',
            'title' => 'Work Completed',
            'description' => $validated['completion_notes'] ?? 'Ticket work has been completed successfully.',
            'activity_time' => now(),
            'user_id' => $request->user()->id,
            'visit_number' => $ticket->current_visit,
            'attachments' => array_filter([
                'ct_bad_part' => $validated['ct_bad_part'] ?? null,
                'ct_good_part' => $validated['ct_good_part'] ?? null,
                'bap_file' => $validated['bap_file'] ?? null,
            ]),
        ]);

        return redirect()->route('tickets.timeline', $ticket)->with('success', 'Ticket marked as completed.');
    }

    /**
     * Mark ticket for revisit.
     */
    public function revisit(Request $request, Ticket $ticket)
    {
        // Prevent revisit on closed tickets
        if ($ticket->status === 'Closed') {
            return back()->withErrors(['error' => 'Cannot revisit a closed ticket.']);
        }

        $validated = $request->validate([
            'reason' => 'required|string',
        ]);

        // Increment visit number (max 3 visits)
        $nextVisit = min($ticket->current_visit + 1, 3);

        // Initialize visit schedules if null
        $visitSchedules = $ticket->visit_schedules ?? [];

        // Set the new visit as pending (waiting for admin to schedule)
        $visitSchedules[$nextVisit] = [
            'status' => 'pending_schedule', // pending_schedule, scheduled, in_progress, completed
            'schedule' => null,
            'scheduled_by' => null,
            'scheduled_at' => null,
            'reason' => $validated['reason'],
        ];

        $ticket->update([
            'needs_revisit' => true,
            'current_visit' => $nextVisit,
            'status' => 'Need to Receive',
            'visit_schedules' => $visitSchedules,
        ]);

        // Add revisit activity
        $ticket->activities()->create([
            'activity_type' => 'revisit',
            'title' => "Revisit Required - Visit {$nextVisit}",
            'description' => $validated['reason'],
            'activity_time' => now(),
            'user_id' => $request->user()->id,
            'visit_number' => $nextVisit,
        ]);

        return back()->with('success', "Ticket marked for revisit. Visit #{$nextVisit} is waiting for admin to schedule.");
    }

    /**
     * Download ticket file.
     */
    public function downloadFile(Ticket $ticket, string $fileType)
    {
        // Validate file type
        if (! in_array($fileType, ['ct_bad_part', 'ct_good_part', 'bap_file'])) {
            abort(404, 'Invalid file type');
        }

        // Check if file exists in ticket
        $filePath = $ticket->{$fileType};

        if (! $filePath) {
            abort(404, 'File not found');
        }

        // Get the full path
        $fullPath = storage_path('app/public/'.$filePath);

        // Check if file exists
        if (! file_exists($fullPath)) {
            abort(404, 'File not found on server');
        }

        // Use the stored filename for download
        $fileName = basename($filePath);

        return response()->download($fullPath, $fileName);
    }

    /**
     * Schedule a visit (admin only).
     */
    public function scheduleVisit(Request $request, Ticket $ticket, int $visitNumber)
    {
        $validated = $request->validate([
            'schedule' => 'required|date',
        ]);

        $visitSchedules = $ticket->visit_schedules ?? [];

        if (! isset($visitSchedules[$visitNumber])) {
            return back()->withErrors(['error' => 'Visit not found']);
        }

        $visitSchedules[$visitNumber]['status'] = 'scheduled';
        $visitSchedules[$visitNumber]['schedule'] = $validated['schedule'];
        $visitSchedules[$visitNumber]['scheduled_by'] = $request->user()->id;
        $visitSchedules[$visitNumber]['scheduled_at'] = now();

        $ticket->update([
            'visit_schedules' => $visitSchedules,
        ]);

        // Add activity
        $ticket->activities()->create([
            'activity_type' => 'status_change',
            'title' => "Visit {$visitNumber} Scheduled",
            'description' => 'Visit scheduled for '.date('d M Y H:i', strtotime($validated['schedule'])),
            'activity_time' => now(),
            'user_id' => $request->user()->id,
            'visit_number' => $visitNumber,
        ]);

        return back()->with('success', "Visit #{$visitNumber} has been scheduled.");
    }
}
