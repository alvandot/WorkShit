<?php

namespace App\Services\Analytics;

use App\Models\Ticket;
use App\Models\TicketActivity;
use Illuminate\Support\Collection;

class PerformanceAnalyticsService
{
    public function getSlaCompliance(string $startDate, string $endDate): float
    {
        $slaCompliant = Ticket::where('status', 'Closed')
            ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, completed_at) <= 24')
            ->whereBetween('completed_at', [$startDate, $endDate])
            ->count();

        $totalClosed = Ticket::where('status', 'Closed')
            ->whereBetween('completed_at', [$startDate, $endDate])
            ->count();

        return $totalClosed > 0 ? round(($slaCompliant / $totalClosed) * 100, 1) : 0;
    }

    public function getAverageFirstResponseTime(string $startDate, string $endDate): float
    {
        $avgHours = TicketActivity::selectRaw('AVG(TIMESTAMPDIFF(HOUR, tickets.created_at, ticket_activities.activity_time)) as avg_hours')
            ->join('tickets', 'ticket_activities.ticket_id', '=', 'tickets.id')
            ->where('ticket_activities.activity_type', 'received')
            ->whereBetween('ticket_activities.activity_time', [$startDate, $endDate])
            ->first()
            ->avg_hours ?? 0;

        return round($avgHours, 1);
    }

    public function getRevisitRate(string $startDate, string $endDate): float
    {
        $revisitCount = Ticket::where('needs_revisit', true)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $totalTickets = Ticket::whereBetween('created_at', [$startDate, $endDate])->count();

        return $totalTickets > 0 ? round(($revisitCount / $totalTickets) * 100, 1) : 0;
    }

    public function getActivityBreakdown(string $startDate, string $endDate): Collection
    {
        return TicketActivity::selectRaw('activity_type, COUNT(*) as count')
            ->whereBetween('activity_time', [$startDate, $endDate])
            ->groupBy('activity_type')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->activity_type => $item->count]);
    }

    public function getPerformanceMetrics(string $startDate, string $endDate): array
    {
        return [
            'sla_compliance_rate' => $this->getSlaCompliance($startDate, $endDate),
            'avg_first_response_time_hours' => $this->getAverageFirstResponseTime($startDate, $endDate),
            'revisit_rate' => $this->getRevisitRate($startDate, $endDate),
            'activity_breakdown' => $this->getActivityBreakdown($startDate, $endDate),
        ];
    }
}
