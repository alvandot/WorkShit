<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketActivity;
use Carbon\Carbon;

class StageTimingService
{
    /**
     * Calculate the duration for a stage based on previous activity
     *
     * @return array{started_at: Carbon|null, duration_minutes: int|null}
     */
    public function calculateStageTiming(Ticket $ticket, string $currentStageType): array
    {
        // Get the previous activity for this visit
        $previousActivity = TicketActivity::where('ticket_id', $ticket->id)
            ->where('visit_number', $ticket->current_visit)
            ->where('activity_type', '!=', $currentStageType)
            ->latest('activity_time')
            ->first();

        if (! $previousActivity) {
            // This is the first activity, no previous stage to calculate from
            return [
                'started_at' => now(),
                'duration_minutes' => null,
            ];
        }

        // Calculate duration from previous activity's started_at (or activity_time if started_at is null)
        $startTime = $previousActivity->started_at ?? $previousActivity->activity_time;
        $durationMinutes = Carbon::parse($startTime)->diffInMinutes(now());

        // Update the previous activity with duration if not already set
        if ($previousActivity->duration_minutes === null) {
            $previousActivity->update([
                'duration_minutes' => $durationMinutes,
            ]);
        }

        return [
            'started_at' => now(),
            'duration_minutes' => null, // Will be calculated when next stage starts
        ];
    }

    /**
     * Get average stage completion time
     *
     * @return float Average time in minutes
     */
    public function getAverageStageTime(string $stageType): float
    {
        $average = TicketActivity::where('activity_type', $stageType)
            ->whereNotNull('duration_minutes')
            ->avg('duration_minutes');

        return $average ?? 30; // Default to 30 minutes if no data
    }

    /**
     * Get stage timing analytics for a ticket
     */
    public function getTicketTimingAnalytics(Ticket $ticket): array
    {
        $activities = TicketActivity::where('ticket_id', $ticket->id)
            ->where('visit_number', $ticket->current_visit)
            ->orderBy('activity_time')
            ->get();

        $totalDuration = 0;
        $stages = [];

        foreach ($activities as $activity) {
            $averageTime = $this->getAverageStageTime($activity->activity_type);
            $isCompleted = $activity->duration_minutes !== null;

            $stages[] = [
                'type' => $activity->activity_type,
                'title' => $activity->title,
                'started_at' => $activity->started_at,
                'completed_at' => $activity->activity_time,
                'duration_minutes' => $activity->duration_minutes,
                'average_minutes' => round($averageTime, 1),
                'is_faster_than_average' => $isCompleted && $activity->duration_minutes < $averageTime,
                'is_completed' => $isCompleted,
            ];

            if ($isCompleted) {
                $totalDuration += $activity->duration_minutes;
            }
        }

        return [
            'stages' => $stages,
            'total_duration_minutes' => $totalDuration,
            'average_duration_minutes' => $this->getAverageTicketCompletionTime(),
            'is_faster_than_average' => $totalDuration > 0 && $totalDuration < $this->getAverageTicketCompletionTime(),
        ];
    }

    /**
     * Get average ticket completion time across all tickets
     *
     * @return float Average time in minutes
     */
    public function getAverageTicketCompletionTime(): float
    {
        // Get completed tickets and sum their stage durations
        $ticketDurations = TicketActivity::whereNotNull('duration_minutes')
            ->selectRaw('ticket_id, SUM(duration_minutes) as total_duration')
            ->groupBy('ticket_id')
            ->pluck('total_duration');

        if ($ticketDurations->isEmpty()) {
            return 180; // Default to 3 hours if no data
        }

        return $ticketDurations->avg();
    }

    /**
     * Calculate points earned for a stage completion
     */
    public function calculateStagePoints(string $stageType, ?int $durationMinutes, bool $isOnTime = true): int
    {
        // Base points for each stage
        $stagePoints = [
            'received' => 10,
            'on_the_way' => 15,
            'arrived' => 20,
            'start_working' => 25,
            'need_part' => 20,
            'completed' => 50,
        ];

        $basePoints = $stagePoints[$stageType] ?? 10;

        if ($durationMinutes === null) {
            return $basePoints;
        }

        // Get average time for this stage
        $averageTime = $this->getAverageStageTime($stageType);

        // Bonus for speed
        if ($durationMinutes < $averageTime * 0.5) {
            $basePoints += 50; // Super fast bonus
        } elseif ($durationMinutes < $averageTime * 0.8) {
            $basePoints += 25; // Speed bonus
        } elseif ($durationMinutes < $averageTime) {
            $basePoints += 10; // Minor speed bonus
        }

        // On-time bonus
        if ($isOnTime) {
            $basePoints += 25;
        }

        return $basePoints;
    }

    /**
     * Check if technician has a streak
     *
     * @param  string  $streakType  'completion'|'speed'|'quality'
     * @return int Streak count
     */
    public function getStreakCount(int $userId, string $streakType = 'completion'): int
    {
        if ($streakType === 'speed') {
            // Count consecutive tickets completed faster than average
            $recentActivities = TicketActivity::where('user_id', $userId)
                ->where('activity_type', 'completed')
                ->whereNotNull('duration_minutes')
                ->latest('activity_time')
                ->take(20)
                ->get();

            $streak = 0;
            foreach ($recentActivities as $activity) {
                $average = $this->getAverageStageTime($activity->activity_type);
                if ($activity->duration_minutes < $average) {
                    $streak++;
                } else {
                    break;
                }
            }

            return $streak;
        }

        // Default: completion streak (consecutive completed stages)
        $recentActivities = TicketActivity::where('user_id', $userId)
            ->whereNotNull('duration_minutes')
            ->latest('activity_time')
            ->take(20)
            ->get();

        return min($recentActivities->count(), 20);
    }

    /**
     * Format duration for display
     */
    public function formatDuration(int $minutes): string
    {
        if ($minutes < 1) {
            return 'less than a minute';
        }

        if ($minutes < 60) {
            return "{$minutes} min";
        }

        $hours = floor($minutes / 60);
        $mins = $minutes % 60;

        if ($mins === 0) {
            return "{$hours}h";
        }

        return "{$hours}h {$mins}m";
    }
}
