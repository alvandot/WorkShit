<?php

namespace App\Http\Controllers;

use App\Models\Engineer;
use App\Models\SpecialPlace;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $statusCounts = Ticket::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $metrics = [
            'tickets_total' => Ticket::count(),
            'tickets_open' => $statusCounts['Open'] ?? 0,
            'tickets_need_receive' => $statusCounts['Need to Receive'] ?? 0,
            'tickets_in_progress' => $statusCounts['In Progress'] ?? 0,
            'tickets_finish' => $statusCounts['Finish'] ?? 0,
            'tickets_closed' => $statusCounts['Closed'] ?? 0,
            'engineers_total' => Engineer::count(),
            'special_places_total' => SpecialPlace::count(),
        ];

        $recentTickets = Ticket::query()
            ->with('assignedTo:id,name')
            ->latest()
            ->limit(5)
            ->get(['id', 'ticket_number', 'company', 'status', 'assigned_to', 'created_at'])
            ->map(static function (Ticket $ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'company' => $ticket->company,
                    'status' => $ticket->status,
                    'assigned_to' => $ticket->assignedTo?->name,
                    'created_at' => $ticket->created_at?->toDateTimeString(),
                ];
            });

        $upcomingSchedules = Ticket::query()
            ->whereNotNull('schedule')
            ->where('schedule', '>=', now())
            ->orderBy('schedule')
            ->limit(5)
            ->get(['id', 'ticket_number', 'company', 'schedule', 'status'])
            ->map(static function (Ticket $ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'company' => $ticket->company,
                    'status' => $ticket->status,
                    'schedule' => $ticket->schedule?->toIso8601String(),
                ];
            });

        $engineerHighlights = Engineer::query()
            ->with(['primaryProvince:id,name'])
            ->withCount('specialPlaces')
            ->orderByDesc('special_places_count')
            ->orderBy('name')
            ->limit(5)
            ->get(['id', 'name', 'specialization', 'primary_province_id', 'is_active'])
            ->map(static function (Engineer $engineer) {
                return [
                    'id' => $engineer->id,
                    'name' => $engineer->name,
                    'specialization' => $engineer->specialization,
                    'province' => $engineer->primaryProvince?->name,
                    'is_active' => $engineer->is_active,
                    'special_places_count' => $engineer->special_places_count,
                ];
            });

        $specialPlaceDistribution = SpecialPlace::query()
            ->selectRaw('province_id, COUNT(*) as total')
            ->groupBy('province_id')
            ->with('province:id,name,code')
            ->orderByDesc('total')
            ->limit(6)
            ->get()
            ->map(static function (SpecialPlace $place) {
                return [
                    'province' => $place->province?->name,
                    'code' => $place->province?->code,
                    'total' => $place->total,
                ];
            });

        $trendStart = now()->subDays(6)->startOfDay();
        $weeklyTicketTrend = Ticket::query()
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->where('created_at', '>=', $trendStart)
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->map(static function ($row) {
                return [
                    'day' => Carbon::parse($row->day)->format('D'),
                    'total' => (int) $row->total,
                ];
            });

        return Inertia::render('dashboard', [
            'filters' => [
                'range' => $request->input('range', '7d'),
            ],
            'metrics' => $metrics,
            'recentTickets' => $recentTickets,
            'upcomingSchedules' => $upcomingSchedules,
            'engineerHighlights' => $engineerHighlights,
            'specialPlaceDistribution' => $specialPlaceDistribution,
            'weeklyTicketTrend' => $weeklyTicketTrend,
        ]);
    }
}
