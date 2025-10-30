<?php

namespace App\Http\Controllers;

use App\Models\Engineer;
use App\Models\Part;
use App\Models\Ticket;
use App\Models\TicketActivity;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $startDate = $request->get('start_date', now()->subDays(30)->startOfDay());
        $endDate = $request->get('end_date', now()->endOfDay());

        return Inertia::render('analytics/index', [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'period' => $request->get('period', 'daily'),
            ],
        ]);
    }

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
            ->mapWithKeys(fn ($item) => [$item->status => $item->count]);

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

        $dateFormat = match ($period) {
            'daily' => '%Y-%m-%d',
            'weekly' => '%Y-%u',
            'monthly' => '%Y-%m',
            default => '%Y-%m'
        };

        $groupBy = match ($period) {
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
            ->mapWithKeys(fn ($item) => [$item->period => $item->count]);

        // Ticket closure trends
        $closureTrends = Ticket::selectRaw("{$groupBy} as period, COUNT(*) as count")
            ->where('status', 'Closed')
            ->where('updated_at', '>=', now()->subMonths($months))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->period => $item->count]);

        // Activity trends
        $activityTrends = TicketActivity::selectRaw("{$groupBy} as period, COUNT(*) as count")
            ->where('activity_time', '>=', now()->subMonths($months))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->period => $item->count]);

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
            ->mapWithKeys(fn ($item) => [$item->activity_type => $item->count]);

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

        $data = match ($type) {
            'overview' => $this->overview($request)->getData(),
            'trends' => $this->trends($request)->getData(),
            'performance' => $this->performance($request)->getData(),
            default => $this->overview($request)->getData(),
        };

        return response()->json($data, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="analytics_'.$type.'_'.now()->format('Y-m-d').'.json"',
        ]);
    }

    public function tickets(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->subDays(30)->startOfDay());
        $endDate = $request->get('end_date', now()->endOfDay());
        $groupBy = $request->get('group_by', 'day');

        $dateFormat = match ($groupBy) {
            'hour' => '%Y-%m-%d %H:00:00',
            'day' => '%Y-%m-%d',
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d'
        };

        $groupByRaw = match ($groupBy) {
            'hour' => "DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00')",
            'day' => 'DATE(created_at)',
            'week' => 'YEARWEEK(created_at)',
            'month' => "DATE_FORMAT(created_at, '%Y-%m')",
            default => 'DATE(created_at)'
        };

        // Ticket trends by status
        $ticketTrends = Ticket::selectRaw("{$groupByRaw} as period, status, COUNT(*) as count")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('period', 'status')
            ->orderBy('period')
            ->get()
            ->groupBy('period')
            ->map(function ($items) {
                return $items->mapWithKeys(fn ($item) => [$item->status => $item->count]);
            });

        // Response time distribution
        $responseTimeBuckets = Ticket::selectRaw("
            CASE
                WHEN TIMESTAMPDIFF(HOUR, created_at, updated_at) <= 1 THEN '0-1h'
                WHEN TIMESTAMPDIFF(HOUR, created_at, updated_at) <= 4 THEN '1-4h'
                WHEN TIMESTAMPDIFF(HOUR, created_at, updated_at) <= 24 THEN '4-24h'
                WHEN TIMESTAMPDIFF(HOUR, created_at, updated_at) <= 72 THEN '1-3d'
                ELSE '3d+'
            END as bucket,
            COUNT(*) as count
        ")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('updated_at')
            ->groupBy('bucket')
            ->orderByRaw("FIELD(bucket, '0-1h', '1-4h', '4-24h', '1-3d', '3d+')")
            ->get()
            ->mapWithKeys(fn ($item) => [$item->bucket => $item->count]);

        // Status funnel
        $statusFunnel = Ticket::selectRaw('status, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('status')
            ->orderByRaw("FIELD(status, 'Open', 'Need to Receive', 'In Progress', 'Resolved', 'Closed')")
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status,
                'count' => $item->count,
            ]);

        // Tickets by company (top 10)
        $topCompanies = Ticket::selectRaw('company, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('company')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(fn ($item) => [
                'company' => $item->company,
                'count' => $item->count,
            ]);

        return response()->json([
            'ticket_trends' => $ticketTrends,
            'response_time_distribution' => $responseTimeBuckets,
            'status_funnel' => $statusFunnel,
            'top_companies' => $topCompanies,
        ]);
    }

    public function engineers(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->subDays(30)->startOfDay());
        $endDate = $request->get('end_date', now()->endOfDay());

        // Engineer workload
        $engineerWorkload = User::withCount([
            'assignedTickets as total_assigned' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            },
            'assignedTickets as open_tickets' => function ($query) {
                $query->whereIn('status', ['Open', 'Need to Receive', 'In Progress']);
            },
            'assignedTickets as completed_tickets' => function ($query) use ($startDate, $endDate) {
                $query->where('status', 'Closed')
                    ->whereBetween('updated_at', [$startDate, $endDate]);
            },
        ])
            ->having('total_assigned', '>', 0)
            ->get()
            ->map(function ($user) {
                $avgCompletionTime = Ticket::where('assigned_to', $user->id)
                    ->where('status', 'Closed')
                    ->whereNotNull('completed_at')
                    ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_hours')
                    ->first()
                    ->avg_hours ?? 0;

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'total_assigned' => $user->total_assigned,
                    'open_tickets' => $user->open_tickets,
                    'completed_tickets' => $user->completed_tickets,
                    'completion_rate' => $user->total_assigned > 0
                        ? round(($user->completed_tickets / $user->total_assigned) * 100, 1)
                        : 0,
                    'avg_completion_hours' => round($avgCompletionTime, 1),
                ];
            })
            ->sortByDesc('total_assigned')
            ->values();

        // Engineer utilization over time
        $engineerUtilization = Ticket::selectRaw('DATE(created_at) as date, assigned_to, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('assigned_to')
            ->groupBy('date', 'assigned_to')
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(function ($items) {
                return $items->mapWithKeys(function ($item) {
                    $user = User::find($item->assigned_to);

                    return [$user?->name ?? 'Unknown' => $item->count];
                });
            });

        return response()->json([
            'engineer_workload' => $engineerWorkload,
            'engineer_utilization' => $engineerUtilization,
        ]);
    }

    public function parts(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->subDays(30)->startOfDay());
        $endDate = $request->get('end_date', now()->endOfDay());

        // Most used parts
        $topParts = Part::selectRaw('part_name, part_number, COUNT(*) as usage_count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('part_name', 'part_number')
            ->orderByDesc('usage_count')
            ->limit(20)
            ->get()
            ->map(fn ($item) => [
                'part_name' => $item->part_name,
                'part_number' => $item->part_number,
                'usage_count' => $item->usage_count,
            ]);

        // Parts trend over time
        $partsTrend = Part::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->date => $item->count]);

        // Parts by ticket
        $partsPerTicket = Part::selectRaw('ticket_id, COUNT(*) as parts_count')
            ->whereHas('ticket', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->groupBy('ticket_id')
            ->get()
            ->groupBy('parts_count')
            ->map(fn ($items) => $items->count())
            ->sortKeys();

        return response()->json([
            'top_parts' => $topParts,
            'parts_trend' => $partsTrend,
            'parts_per_ticket_distribution' => $partsPerTicket,
        ]);
    }

    public function comparisons(Request $request): JsonResponse
    {
        $currentStart = $request->get('current_start', now()->subDays(30)->startOfDay());
        $currentEnd = $request->get('current_end', now()->endOfDay());

        $days = Carbon::parse($currentStart)->diffInDays(Carbon::parse($currentEnd));
        $previousStart = Carbon::parse($currentStart)->subDays($days);
        $previousEnd = Carbon::parse($currentStart)->subDay();

        // Current period metrics
        $currentMetrics = [
            'total_tickets' => Ticket::whereBetween('created_at', [$currentStart, $currentEnd])->count(),
            'closed_tickets' => Ticket::where('status', 'Closed')
                ->whereBetween('updated_at', [$currentStart, $currentEnd])->count(),
            'avg_resolution_hours' => Ticket::where('status', 'Closed')
                ->whereNotNull('completed_at')
                ->whereBetween('completed_at', [$currentStart, $currentEnd])
                ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_hours')
                ->first()->avg_hours ?? 0,
            'revisit_rate' => Ticket::where('needs_revisit', true)
                ->whereBetween('created_at', [$currentStart, $currentEnd])->count(),
        ];

        // Previous period metrics
        $previousMetrics = [
            'total_tickets' => Ticket::whereBetween('created_at', [$previousStart, $previousEnd])->count(),
            'closed_tickets' => Ticket::where('status', 'Closed')
                ->whereBetween('updated_at', [$previousStart, $previousEnd])->count(),
            'avg_resolution_hours' => Ticket::where('status', 'Closed')
                ->whereNotNull('completed_at')
                ->whereBetween('completed_at', [$previousStart, $previousEnd])
                ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_hours')
                ->first()->avg_hours ?? 0,
            'revisit_rate' => Ticket::where('needs_revisit', true)
                ->whereBetween('created_at', [$previousStart, $previousEnd])->count(),
        ];

        // Calculate changes
        $changes = [
            'total_tickets' => $previousMetrics['total_tickets'] > 0
                ? round((($currentMetrics['total_tickets'] - $previousMetrics['total_tickets']) / $previousMetrics['total_tickets']) * 100, 1)
                : 0,
            'closed_tickets' => $previousMetrics['closed_tickets'] > 0
                ? round((($currentMetrics['closed_tickets'] - $previousMetrics['closed_tickets']) / $previousMetrics['closed_tickets']) * 100, 1)
                : 0,
            'avg_resolution_hours' => $previousMetrics['avg_resolution_hours'] > 0
                ? round((($currentMetrics['avg_resolution_hours'] - $previousMetrics['avg_resolution_hours']) / $previousMetrics['avg_resolution_hours']) * 100, 1)
                : 0,
            'revisit_rate' => $previousMetrics['revisit_rate'] > 0
                ? round((($currentMetrics['revisit_rate'] - $previousMetrics['revisit_rate']) / $previousMetrics['revisit_rate']) * 100, 1)
                : 0,
        ];

        return response()->json([
            'current_period' => [
                'start' => $currentStart,
                'end' => $currentEnd,
                'metrics' => $currentMetrics,
            ],
            'previous_period' => [
                'start' => $previousStart,
                'end' => $previousEnd,
                'metrics' => $previousMetrics,
            ],
            'changes' => $changes,
        ]);
    }
}
