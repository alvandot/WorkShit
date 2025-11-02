import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React from 'react';

interface KpiCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend: string;
    description: string;
    colorClass?: string;
    hovered?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    className?: string;
}

export function KpiCard({
    label,
    value,
    icon,
    trend,
    description,
    colorClass = '',
    hovered = false,
    onMouseEnter,
    onMouseLeave,
    className = '',
}: KpiCardProps) {
    return (
        <Card
            className={`group relative transition-transform duration-300 ${hovered ? 'ring-2 ring-cyan-400' : ''} ${className}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            tabIndex={0}
        >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div
                    className={`rounded-full p-3 shadow-md transition-transform duration-300 group-hover:scale-110 ${colorClass}`}
                >
                    {icon}
                </div>
                <div>
                    <CardTitle className="mb-1 text-2xl font-bold md:text-3xl">
                        {value}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium md:text-sm">
                        {label}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <span className="text-lg font-semibold">{trend}</span>
                <span className="text-xs">{description}</span>
            </CardContent>
            <div className="pointer-events-none absolute inset-0 rounded-xl transition-colors duration-300 group-hover:bg-cyan-400/10" />
        </Card>
    );
}
