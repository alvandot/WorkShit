import { KpiStatCard } from '@/components/kpi-stat-card';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Loader2,
    Ticket,
} from 'lucide-react';

interface QuickStat {
    label: string;
    value: number | string;
    change?: number;
    trend?: 'up' | 'down';
    icon?: React.ReactNode;
    color?: string;
}

interface QuickStatsProps {
    stats: QuickStat[];
    loading?: boolean;
    className?: string;
}

export function QuickStats({
    stats,
    loading = false,
    className,
}: QuickStatsProps) {
    if (loading) {
        return (
            <div
                className={cn(
                    'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
                    className,
                )}
            >
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Map stats to KpiStatCard format
    const getIconForStat = (label: string) => {
        if (label.includes('Open')) return Ticket;
        if (label.includes('Progress')) return Loader2;
        if (label.includes('Completed')) return CheckCircle2;
        if (label.includes('Overdue')) return Clock;
        return AlertCircle;
    };

    const getColorScheme = (label: string) => {
        if (label.includes('Open')) return 'blue' as const;
        if (label.includes('Progress')) return 'purple' as const;
        if (label.includes('Completed')) return 'emerald' as const;
        if (label.includes('Overdue')) return 'rose' as const;
        return 'blue' as const;
    };

    return (
        <div
            className={cn(
                'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
                className,
            )}
        >
            {stats.map((stat, index) => (
                <KpiStatCard
                    key={index}
                    title={stat.label}
                    value={stat.value}
                    icon={getIconForStat(stat.label)}
                    colorScheme={getColorScheme(stat.label)}
                    variant="gradient"
                    trend={
                        stat.change !== undefined
                            ? {
                                  value: Math.abs(stat.change),
                                  isPositive: stat.trend === 'up',
                              }
                            : undefined
                    }
                />
            ))}
        </div>
    );
}

// Predefined stat configurations
export const ticketStatsConfig = {
    open: {
        label: 'Open Tickets',
        icon: <AlertCircle className="size-5" />,
        color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    inProgress: {
        label: 'In Progress',
        icon: <Loader2 className="size-5 animate-spin" />,
        color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    completed: {
        label: 'Completed',
        icon: <CheckCircle2 className="size-5" />,
        color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    overdue: {
        label: 'Overdue',
        icon: <Clock className="size-5" />,
        color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    },
};

// Helper function to generate stats from tickets
interface Ticket {
    status: string;
    deadline?: string;
}

export function generateTicketStats(tickets: Ticket[]): QuickStat[] {
    const now = new Date();

    const openCount = tickets.filter((t) => t.status === 'Open').length;
    const inProgressCount = tickets.filter(
        (t) => t.status === 'In Progress',
    ).length;
    const completedCount = tickets.filter(
        (t) => t.status === 'Finish' || t.status === 'Closed',
    ).length;
    const overdueCount = tickets.filter(
        (t) =>
            t.deadline &&
            new Date(t.deadline) < now &&
            t.status !== 'Finish' &&
            t.status !== 'Closed',
    ).length;

    return [
        {
            ...ticketStatsConfig.open,
            value: openCount,
            trend: 'up',
            change: 12,
        },
        {
            ...ticketStatsConfig.inProgress,
            value: inProgressCount,
            trend: 'up',
            change: 8,
        },
        {
            ...ticketStatsConfig.completed,
            value: completedCount,
            trend: 'up',
            change: 23,
        },
        {
            ...ticketStatsConfig.overdue,
            value: overdueCount,
            trend: overdueCount > 0 ? 'down' : 'up',
            change: 5,
        },
    ];
}
