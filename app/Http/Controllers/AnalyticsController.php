<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketActivity;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        // Basic ticket statistics
        $totalTickets = Ticket::whereBetween('created_at', [$startDate, $endDate])->count();
        $activeTickets = Ticket::where('status', '!=', 'Closed')->count();
        $closedTickets = Ticket::where('status', 'Closed')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->count();

        // Status distribution
        $statusDistribution = Ticket::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn($item) => [$item->status => $item->count]);

        // Priority distribution (assuming we have priority field, or we can derive from other fields)
        $priorityDistribution = [
            'High' => Ticket::where('status', 'Open')->whereRaw('DATEDIFF(CURDATE(), created_at) > 7')->count(),
            'Medium' => Ticket::where('status', 'In Progress')->count(),
            'Low' => Ticket::where('status', 'Resolved')->count(),
        ];

        // Average resolution time
        $avgResolutionTime = Ticket::where('status', 'Closed')
            ->whereNotNull('completed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_hours')
            ->first()
            ->avg_hours ?? 0;

        // Technician performance
        $technicianStats = User::withCount(['assignedTickets' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }])
        ->withCount(['assignedTickets as completed_tickets_count' => function ($query) use ($startDate, $endDate) {
            $query->where('status', 'Closed')
                  ->whereBetween('updated_at', [$startDate, $endDate]);
        }])
        ->having('assigned_tickets_count', '>', 0)
        ->get()
        ->map(function ($user) {
            $completionRate = $user->assigned_tickets_count > 0
                ? round(($user->completed_tickets_count / $user->assigned_tickets_count) * 100, 1)
                : 0;

            return [
                'id' => $user->id,
                'name' => $user->name,
                'assigned_tickets' => $user->assigned_tickets_count,
                'completed_tickets' => $user->completed_tickets_count,
                'completion_rate' => $completionRate,
            ];
        });

        return response()->json([
            'total_tickets' => $totalTickets,
            'active_tickets' => $activeTickets,
            'closed_tickets' => $closedTickets,
            'status_distribution' => $statusDistribution,
            'priority_distribution' => $priorityDistribution,
            'avg_resolution_time_hours' => round($avgResolutionTime, 1),
            'technician_stats' => $technicianStats,
        ]);
    }

    public function trends(Request $request): JsonResponse
    {
        $period = $request->get('period', 'monthly'); // daily, weekly, monthly
        $months = $request->get('months', 12);

        $dateFormat = match($period) {
            'daily' => '%Y-%m-%d',
            'weekly' => '%Y-%u',
            'monthly' => '%Y-%m',
            default => '%Y-%m'
        };

        $groupBy = match($period) {
            'daily' => 'DATE(created_at)',
            'weekly' => 'YEARWEEK(created_at)',
            'monthly' => 'DATE_FORMAT(created_at, "%Y-%m")',
            default => 'DATE_FORMAT(created_at, "%Y-%m")'
        };

        // Ticket creation trends
        $creationTrends = Ticket::selectRaw("{$groupBy} as period, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths($months))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->mapWithKeys(fn($item) => [$item->period => $item->count]);

        // Ticket closure trends
        $closureTrends = Ticket::selectRaw("{$groupBy} as period, COUNT(*) as count")
            ->where('status', 'Closed')
            ->where('updated_at', '>=', now()->subMonths($months))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->mapWithKeys(fn($item) => [$item->period => $item->count]);

        // Activity trends
        $activityTrends = TicketActivity::selectRaw("{$groupBy} as period, COUNT(*) as count")
            ->where('activity_time', '>=', now()->subMonths($months))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->mapWithKeys(fn($item) => [$item->period => $item->count]);

        return response()->json([
            'creation_trends' => $creationTrends,
            'closure_trends' => $closureTrends,
            'activity_trends' => $activityTrends,
            'period' => $period,
        ]);
    }

    public function performance(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        // SLA compliance (tickets resolved within 24 hours)
        $slaCompliant = Ticket::where('status', 'Closed')
            ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, completed_at) <= 24')
            ->whereBetween('completed_at', [$startDate, $endDate])
            ->count();

        $totalClosed = Ticket::where('status', 'Closed')
            ->whereBetween('completed_at', [$startDate, $endDate])
            ->count();

        $slaComplianceRate = $totalClosed > 0 ? round(($slaCompliant / $totalClosed) * 100, 1) : 0;

        // First response time
        $avgFirstResponseTime = TicketActivity::selectRaw('AVG(TIMESTAMPDIFF(HOUR, tickets.created_at, ticket_activities.activity_time)) as avg_hours')
            ->join('tickets', 'ticket_activities.ticket_id', '=', 'tickets.id')
            ->where('ticket_activities.activity_type', 'received')
            ->whereBetween('ticket_activities.activity_time', [$startDate, $endDate])
            ->first()
            ->avg_hours ?? 0;

        // Customer satisfaction (if we had ratings, for now using revisit rates)
        $revisitRate = Ticket::where('needs_revisit', true)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $totalTickets = Ticket::whereBetween('created_at', [$startDate, $endDate])->count();
        $revisitPercentage = $totalTickets > 0 ? round(($revisitRate / $totalTickets) * 100, 1) : 0;

        // Activity breakdown by type
        $activityBreakdown = TicketActivity::selectRaw('activity_type, COUNT(*) as count')
            ->whereBetween('activity_time', [$startDate, $endDate])
            ->groupBy('activity_type')
            ->get()
            ->mapWithKeys(fn($item) => [$item->activity_type => $item->count]);

        return response()->json([
            'sla_compliance_rate' => $slaComplianceRate,
            'avg_first_response_time_hours' => round($avgFirstResponseTime, 1),
            'revisit_rate' => $revisitPercentage,
            'activity_breakdown' => $activityBreakdown,
        ]);
    }

    public function realtime(Request $request): JsonResponse
    {
        $hours = $request->get('hours', 24);

        // Recent activities
        $recentActivities = TicketActivity::with(['ticket', 'user'])
            ->where('activity_time', '>=', now()->subHours($hours))
            ->orderBy('activity_time', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'ticket_number' => $activity->ticket->ticket_number,
                    'activity_type' => $activity->activity_type,
                    'title' => $activity->title,
                    'user_name' => $activity->user->name,
                    'activity_time' => $activity->activity_time->diffForHumans(),
                    'timestamp' => $activity->activity_time,
                ];
            });

        // Current active tickets
        $activeTickets = Ticket::where('status', '!=', 'Closed')
            ->with(['assignedTo', 'activities' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->orderBy('updated_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($ticket) {
                $lastActivity = $ticket->activities->first();
                return [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'company' => $ticket->company,
                    'status' => $ticket->status,
                    'assigned_to' => $ticket->assignedTo?->name,
                    'last_activity' => $lastActivity ? $lastActivity->title : 'No activity',
                    'last_activity_time' => $lastActivity ? $lastActivity->activity_time->diffForHumans() : null,
                    'created_at' => $ticket->created_at->diffForHumans(),
                ];
            });

        // Today's statistics
        $todayStats = [
            'tickets_created' => Ticket::whereDate('created_at', today())->count(),
            'tickets_closed' => Ticket::where('status', 'Closed')
                ->whereDate('updated_at', today())
                ->count(),
            'activities_logged' => TicketActivity::whereDate('activity_time', today())->count(),
        ];

        return response()->json([
            'recent_activities' => $recentActivities,
            'active_tickets' => $activeTickets,
            'today_stats' => $todayStats,
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->get('type', 'overview');
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $data = match($type) {
            'overview' => $this->overview($request)->getData(),
            'trends' => $this->trends($request)->getData(),
            'performance' => $this->performance($request)->getData(),
            default => $this->overview($request)->getData(),
        };

        return response()->json($data, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="analytics_' . $type . '_' . now()->format('Y-m-d') . '.json"'
        ]);
    }
}
