<?php

namespace App\Services\Analytics;

use App\Models\Ticket;
use App\Models\TicketActivity;
use Illuminate\Support\Collection;

class TicketAnalyticsService
{
    public function getOverviewStats(string $startDate, string $endDate): array
    {
        $totalTickets = Ticket::whereBetween('created_at', [$startDate, $endDate])->count();
        $activeTickets = Ticket::where('status', '!=', 'Closed')->count();
        $closedTickets = Ticket::where('status', 'Closed')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->count();

        return [
            'total_tickets' => $totalTickets,
            'active_tickets' => $activeTickets,
            'closed_tickets' => $closedTickets,
        ];
    }

    public function getStatusDistribution(): Collection
    {
        return Ticket::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->status => $item->count]);
    }

    public function getPriorityDistribution(): array
    {
        return [
            'High' => Ticket::where('status', 'Open')->whereRaw('DATEDIFF(CURDATE(), created_at) > 7')->count(),
            'Medium' => Ticket::where('status', 'In Progress')->count(),
            'Low' => Ticket::where('status', 'Resolved')->count(),
        ];
    }

    public function getAverageResolutionTime(): float
    {
        $avgHours = Ticket::where('status', 'Closed')
            ->whereNotNull('completed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, completed_at)) as avg_hours')
            ->first()
            ->avg_hours ?? 0;

        return round($avgHours, 1);
    }

    public function getTrendData(string $period, int $months): array
    {
        $groupBy = $this->getGroupByExpression($period);

        $creationTrends = Ticket::selectRaw("{$groupBy} as period, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths($months))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->period => $item->count]);

        $closureTrends = Ticket::selectRaw("{$groupBy} as period, COUNT(*) as count")
            ->where('status', 'Closed')
            ->where('updated_at', '>=', now()->subMonths($months))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->period => $item->count]);

        $activityTrends = TicketActivity::selectRaw("{$groupBy} as period, COUNT(*) as count")
            ->where('activity_time', '>=', now()->subMonths($months))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->period => $item->count]);

        return [
            'creation_trends' => $creationTrends,
            'closure_trends' => $closureTrends,
            'activity_trends' => $activityTrends,
        ];
    }

    public function getRealtimeStats(int $hours): array
    {
        return [
            'tickets_created' => Ticket::whereDate('created_at', today())->count(),
            'tickets_closed' => Ticket::where('status', 'Closed')
                ->whereDate('updated_at', today())
                ->count(),
            'activities_logged' => TicketActivity::whereDate('activity_time', today())->count(),
        ];
    }

    public function getRecentActivities(int $hours, int $limit = 50): Collection
    {
        return TicketActivity::with(['ticket', 'user'])
            ->where('activity_time', '>=', now()->subHours($hours))
            ->orderBy('activity_time', 'desc')
            ->limit($limit)
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
    }

    public function getActiveTickets(int $limit = 20): Collection
    {
        return Ticket::where('status', '!=', 'Closed')
            ->with(['assignedTo', 'activities' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
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
    }

    protected function getGroupByExpression(string $period): string
    {
        return match ($period) {
            'daily' => 'DATE(created_at)',
            'weekly' => 'YEARWEEK(created_at)',
            'monthly' => 'DATE_FORMAT(created_at, "%Y-%m")',
            default => 'DATE_FORMAT(created_at, "%Y-%m")'
        };
    }
}
