<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $query = Ticket::query();

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $tickets = $query->get();
        $statuses = ['Open', 'Need to Receive', 'In Progress', 'Resolved', 'Closed'];

        // KPI cards
        $totalTickets = $tickets->count();
        $ticketsByStatus = $tickets->groupBy('status')->map->count();
        $avgResolutionTime = $tickets->where('status', 'Resolved')->avg(function ($t) {
            return $t->created_at && $t->updated_at ? $t->updated_at->diffInMinutes($t->created_at) : null;
        });
        $slaCompliant = $tickets->where('status', 'Resolved')->filter(function ($t) {
            // Example: SLA = resolved within 48h
            return $t->created_at && $t->updated_at && $t->updated_at->diffInHours($t->created_at) <= 48;
        })->count();
        $totalResolved = $tickets->where('status', 'Resolved')->count();
        $slaComplianceRate = $totalResolved ? round($slaCompliant / $totalResolved * 100, 1) : 0;

        // Tickets by company
        $ticketsByCompany = $tickets->groupBy('company')->map->count()->sortDesc()->take(10);
        // Tickets by assigned user
        $ticketsByUser = $tickets->groupBy('assigned_to')->map->count()->sortDesc()->take(10);
        $userNames = User::whereIn('id', $ticketsByUser->keys())->pluck('name', 'id');
        $ticketsByUser = $ticketsByUser->mapWithKeys(fn($v, $k) => [$userNames[$k] ?? 'Unassigned' => $v]);

        // Tickets created/resolved over time (last 30 days)
        $trend = collect(range(0, 29))->mapWithKeys(function ($i) use ($tickets) {
            $date = now()->subDays(29 - $i)->toDateString();
            return [
                $date => [
                    'created' => $tickets->where('created_at', '>=', $date.' 00:00:00')->where('created_at', '<=', $date.' 23:59:59')->count(),
                    'resolved' => $tickets->where('status', 'Resolved')->where('updated_at', '>=', $date.' 00:00:00')->where('updated_at', '<=', $date.' 23:59:59')->count(),
                ]
            ];
        });

        // Recent activity (last 10 tickets)
        $recentTickets = $tickets->sortByDesc('created_at')->take(10)->values();

        // Multi-visit stats
        $multiVisit = $tickets->filter(fn($t) => is_array($t->visit_schedules) && count($t->visit_schedules) > 1)->count();

        return Inertia::render('dashboard', [
            'analytics' => [
                'totalTickets' => $totalTickets,
                'ticketsByStatus' => $ticketsByStatus,
                'avgResolutionTime' => $avgResolutionTime,
                'slaComplianceRate' => $slaComplianceRate,
                'ticketsByCompany' => $ticketsByCompany,
                'ticketsByUser' => $ticketsByUser,
                'trend' => $trend,
                'recentTickets' => $recentTickets,
                'multiVisit' => $multiVisit,
                'statuses' => $statuses,
            ],
        ]);
    }
}
