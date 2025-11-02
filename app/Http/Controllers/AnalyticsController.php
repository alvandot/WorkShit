<?php

namespace App\Http\Controllers;

use App\Models\Engineer;
use App\Models\Part;
use App\Models\Ticket;
use App\Models\User;
use App\Services\Analytics\PerformanceAnalyticsService;
use App\Services\Analytics\TicketAnalyticsService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(
        protected TicketAnalyticsService $ticketAnalytics,
        protected PerformanceAnalyticsService $performanceAnalytics
    ) {}

    public function index(Request $request): Response
    {
        $startDate = $request->get('start_date', now()->subDays(30)->startOfDay());
        $endDate = $request->get('end_date', now()->endOfDay());
        $tab = $request->get('tab', 'overview');

        return Inertia::render('analytics/index', [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'period' => $request->get('period', 'daily'),
                'tab' => $tab,
            ],
        ]);
    }

    public function overview(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $stats = $this->ticketAnalytics->getOverviewStats($startDate, $endDate);
        $statusDistribution = $this->ticketAnalytics->getStatusDistribution();
        $priorityDistribution = $this->ticketAnalytics->getPriorityDistribution();
        $avgResolutionTime = $this->ticketAnalytics->getAverageResolutionTime();

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
            ...$stats,
            'status_distribution' => $statusDistribution,
            'priority_distribution' => $priorityDistribution,
            'avg_resolution_time_hours' => $avgResolutionTime,
            'technician_stats' => $technicianStats,
        ]);
    }

    public function trends(Request $request): JsonResponse
    {
        $period = $request->get('period', 'monthly');
        $months = $request->get('months', 12);

        $trendData = $this->ticketAnalytics->getTrendData($period, $months);

        return response()->json([
            ...$trendData,
            'period' => $period,
        ]);
    }

    public function performance(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $metrics = $this->performanceAnalytics->getPerformanceMetrics($startDate, $endDate);

        return response()->json($metrics);
    }

    public function realtime(Request $request): JsonResponse
    {
        $hours = $request->get('hours', 24);

        $recentActivities = $this->ticketAnalytics->getRecentActivities($hours);
        $activeTickets = $this->ticketAnalytics->getActiveTickets();
        $todayStats = $this->ticketAnalytics->getRealtimeStats($hours);

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
