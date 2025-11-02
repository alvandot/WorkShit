import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { type ReactNode } from 'react';

interface KpiStatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    description?: string;
    variant?: 'default' | 'gradient' | 'glass';
    colorScheme?:
        | 'blue'
        | 'purple'
        | 'emerald'
        | 'amber'
        | 'rose'
        | 'cyan'
        | 'orange';
    className?: string;
    children?: ReactNode;
}

const gradientVariants = {
    blue: 'from-blue-500/20 via-blue-500/10 to-transparent border-blue-500/30',
    purple: 'from-purple-500/20 via-purple-500/10 to-transparent border-purple-500/30',
    emerald:
        'from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/30',
    amber: 'from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/30',
    rose: 'from-rose-500/20 via-rose-500/10 to-transparent border-rose-500/30',
    cyan: 'from-cyan-500/20 via-cyan-500/10 to-transparent border-cyan-500/30',
    orange: 'from-orange-500/20 via-orange-500/10 to-transparent border-orange-500/30',
};

const iconColorVariants = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-purple-500/20',
    emerald:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-cyan-500/20',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-orange-500/20',
};

export function KpiStatCard({
    title,
    value,
    icon: Icon,
    trend,
    description,
    variant = 'gradient',
    colorScheme = 'blue',
    className,
    children,
}: KpiStatCardProps) {
    return (
        <Card
            className={cn(
                'group relative overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
                variant === 'gradient' &&
                    `bg-gradient-to-br ${gradientVariants[colorScheme]}`,
                variant === 'glass' &&
                    'border-border/50 bg-background/50 backdrop-blur-sm',
                className,
            )}
        >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-6 -translate-y-6 opacity-30 blur-2xl">
                <div
                    className={cn(
                        'h-full w-full rounded-full',
                        colorScheme === 'blue' && 'bg-blue-500',
                        colorScheme === 'purple' && 'bg-purple-500',
                        colorScheme === 'emerald' && 'bg-emerald-500',
                        colorScheme === 'amber' && 'bg-amber-500',
                        colorScheme === 'rose' && 'bg-rose-500',
                        colorScheme === 'cyan' && 'bg-cyan-500',
                        colorScheme === 'orange' && 'bg-orange-500',
                    )}
                />
            </div>

            <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <div className="flex items-baseline gap-3">
                            <h3 className="text-4xl font-bold tracking-tight">
                                {value}
                            </h3>
                            {trend && (
                                <div
                                    className={cn(
                                        'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                                        trend.isPositive
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                                    )}
                                >
                                    {trend.isPositive ? (
                                        <TrendingUp className="size-3" />
                                    ) : (
                                        <TrendingDown className="size-3" />
                                    )}
                                    {trend.value}%
                                    {trend.label && (
                                        <span className="ml-1 text-muted-foreground">
                                            {trend.label}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    <div
                        className={cn(
                            'flex size-12 items-center justify-center rounded-xl ring-4 transition-all duration-300 group-hover:scale-110',
                            iconColorVariants[colorScheme],
                        )}
                    >
                        <Icon className="size-6" />
                    </div>
                </div>

                {children && <div className="mt-4">{children}</div>}
            </CardContent>
        </Card>
    );
}

// Mini sparkline component (optional)
interface SparklineProps {
    data: number[];
    className?: string;
    color?: string;
}

export function Sparkline({
    data,
    className,
    color = 'currentColor',
}: SparklineProps) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
        .map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg
            className={cn('h-8 w-full', className)}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
                vectorEffect="non-scaling-stroke"
                className="opacity-50"
            />
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                points={points}
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-300"
            />
        </svg>
    );
}
