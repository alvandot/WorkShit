import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
    CalendarClock,
    CheckCircle2,
    Circle,
    Clock,
    type LucideIcon,
    User,
    XCircle,
} from 'lucide-react';
import { type ReactNode } from 'react';

// Timeline Container
interface TimelineProps {
    children: ReactNode;
    className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
    return (
        <div className={cn('relative space-y-6', className)}>
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
            {children}
        </div>
    );
}

// Timeline Item
export type TimelineItemVariant =
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';

interface TimelineItemProps {
    title: string;
    description?: string;
    timestamp: string | Date;
    icon?: LucideIcon;
    variant?: TimelineItemVariant;
    user?: {
        name: string;
        avatar?: string;
    };
    children?: ReactNode;
    isActive?: boolean;
    className?: string;
}

const variantConfig: Record<
    TimelineItemVariant,
    {
        iconBg: string;
        iconColor: string;
        cardBorder: string;
        defaultIcon: LucideIcon;
    }
> = {
    default: {
        iconBg: 'bg-blue-500/10 ring-blue-500/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        cardBorder: 'border-blue-500/30',
        defaultIcon: Circle,
    },
    success: {
        iconBg: 'bg-emerald-500/10 ring-emerald-500/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        cardBorder: 'border-emerald-500/30',
        defaultIcon: CheckCircle2,
    },
    warning: {
        iconBg: 'bg-amber-500/10 ring-amber-500/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        cardBorder: 'border-amber-500/30',
        defaultIcon: Clock,
    },
    error: {
        iconBg: 'bg-rose-500/10 ring-rose-500/30',
        iconColor: 'text-rose-600 dark:text-rose-400',
        cardBorder: 'border-rose-500/30',
        defaultIcon: XCircle,
    },
    info: {
        iconBg: 'bg-cyan-500/10 ring-cyan-500/30',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        cardBorder: 'border-cyan-500/30',
        defaultIcon: CalendarClock,
    },
};

export function TimelineItem({
    title,
    description,
    timestamp,
    icon,
    variant = 'default',
    user,
    children,
    isActive = false,
    className,
}: TimelineItemProps) {
    const config = variantConfig[variant];
    const Icon = icon || config.defaultIcon;
    const formattedTime =
        typeof timestamp === 'string' ? timestamp : format(timestamp, 'PPp');

    return (
        <div className={cn('relative flex gap-4', className)}>
            {/* Icon */}
            <div className="relative z-10 flex-shrink-0">
                <div
                    className={cn(
                        'flex size-12 items-center justify-center rounded-full ring-4 ring-background transition-all duration-300',
                        config.iconBg,
                        isActive && 'scale-110 shadow-lg',
                    )}
                >
                    <Icon
                        className={cn(
                            'size-5',
                            config.iconColor,
                            isActive && 'animate-pulse',
                        )}
                    />
                </div>
            </div>

            {/* Content Card */}
            <Card
                className={cn(
                    'flex-1 border-2 transition-all duration-300 hover:shadow-md',
                    config.cardBorder,
                    isActive && 'shadow-lg ring-2 ring-primary/20',
                )}
            >
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                            <h4 className="leading-none font-semibold">
                                {title}
                            </h4>
                            {description && (
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                        <time className="flex-shrink-0 text-xs text-muted-foreground">
                            {formattedTime}
                        </time>
                    </div>

                    {user && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="size-3.5" />
                            <span>{user.name}</span>
                        </div>
                    )}

                    {children && (
                        <div className="mt-3 border-t pt-3">{children}</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Visit Timeline (specialized for ticket visits)
interface VisitTimelineProps {
    visitNumber: number;
    status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    schedule?: string | Date | null;
    activities?: Array<{
        id: number;
        title: string;
        description?: string;
        timestamp: string | Date;
        user?: { name: string };
    }>;
    className?: string;
}

const visitStatusConfig = {
    pending: {
        label: 'Pending Schedule',
        variant: 'warning' as TimelineItemVariant,
        icon: Clock,
    },
    scheduled: {
        label: 'Scheduled',
        variant: 'info' as TimelineItemVariant,
        icon: CalendarClock,
    },
    in_progress: {
        label: 'In Progress',
        variant: 'default' as TimelineItemVariant,
        icon: Circle,
    },
    completed: {
        label: 'Completed',
        variant: 'success' as TimelineItemVariant,
        icon: CheckCircle2,
    },
    cancelled: {
        label: 'Cancelled',
        variant: 'error' as TimelineItemVariant,
        icon: XCircle,
    },
};

export function VisitTimeline({
    visitNumber,
    status,
    schedule,
    activities = [],
    className,
}: VisitTimelineProps) {
    const config = visitStatusConfig[status];

    return (
        <div className={cn('space-y-4', className)}>
            {/* Visit Header */}
            <div className="flex items-center gap-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {visitNumber}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold">Visit {visitNumber}</h3>
                    <div className="mt-1 flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={cn(
                                'gap-1',
                                status === 'completed' &&
                                    'bg-emerald-500/10 text-emerald-600',
                                status === 'in_progress' &&
                                    'bg-blue-500/10 text-blue-600',
                                status === 'scheduled' &&
                                    'bg-cyan-500/10 text-cyan-600',
                                status === 'pending' &&
                                    'bg-amber-500/10 text-amber-600',
                                status === 'cancelled' &&
                                    'bg-rose-500/10 text-rose-600',
                            )}
                        >
                            <config.icon className="size-3" />
                            {config.label}
                        </Badge>
                        {schedule && (
                            <span className="text-sm text-muted-foreground">
                                {typeof schedule === 'string'
                                    ? schedule
                                    : format(schedule, 'PPp')}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Activities */}
            {activities.length > 0 && (
                <Timeline>
                    {activities.map((activity) => (
                        <TimelineItem
                            key={activity.id}
                            title={activity.title}
                            description={activity.description}
                            timestamp={activity.timestamp}
                            user={activity.user}
                            variant="default"
                        />
                    ))}
                </Timeline>
            )}
        </div>
    );
}
