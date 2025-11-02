import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, Loader2, XCircle } from 'lucide-react';

export type TicketStatus =
    | 'Open'
    | 'Need to Receive'
    | 'In Progress'
    | 'Finish'
    | 'Closed';

interface StatusBadgeProps {
    status: TicketStatus | string;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

const statusConfig: Record<
    string,
    {
        label: string;
        icon: typeof Circle;
        className: string;
        animate?: boolean;
    }
> = {
    Open: {
        label: 'Open',
        icon: Circle,
        className:
            'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800',
    },
    'Need to Receive': {
        label: 'Need to Receive',
        icon: Clock,
        className:
            'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800',
    },
    'In Progress': {
        label: 'In Progress',
        icon: Loader2,
        className:
            'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800',
        animate: true,
    },
    Finish: {
        label: 'Finished',
        icon: CheckCircle2,
        className:
            'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800',
    },
    Closed: {
        label: 'Closed',
        icon: XCircle,
        className:
            'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-950/30 dark:text-slate-300 dark:border-slate-800',
    },
};

const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
};

const iconSizes = {
    sm: 'size-2.5',
    md: 'size-3',
    lg: 'size-3.5',
};

export function StatusBadge({
    status,
    size = 'md',
    showIcon = true,
    className,
}: StatusBadgeProps) {
    const config = statusConfig[status as TicketStatus] || {
        label: status,
        icon: Circle,
        className: 'bg-muted text-muted-foreground border-border',
    };

    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={cn(
                'inline-flex items-center font-semibold transition-all',
                sizeClasses[size],
                config.className,
                className,
            )}
        >
            {showIcon && (
                <Icon
                    className={cn(
                        iconSizes[size],
                        config.animate && 'animate-spin',
                    )}
                />
            )}
            <span>{config.label}</span>
        </Badge>
    );
}

// Priority badge component
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface PriorityBadgeProps {
    priority: Priority | string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const priorityConfig = {
    low: {
        label: 'Low',
        className:
            'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300',
    },
    medium: {
        label: 'Medium',
        className:
            'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-300',
    },
    high: {
        label: 'High',
        className:
            'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-300',
    },
    urgent: {
        label: 'Urgent',
        className: 'bg-red-600 text-white border-red-700 animate-pulse',
    },
};

export function PriorityBadge({
    priority,
    size = 'md',
    className,
}: PriorityBadgeProps) {
    const config = priorityConfig[priority as Priority] || {
        label: priority,
        className: 'bg-muted text-muted-foreground border-border',
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                'inline-flex items-center font-semibold tracking-wider uppercase',
                sizeClasses[size],
                config.className,
                className,
            )}
        >
            {config.label}
        </Badge>
    );
}
