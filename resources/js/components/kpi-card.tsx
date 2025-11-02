import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
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
        <div className={`p-3 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300 ${colorClass}`}>{icon}</div>
        <div>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-1">{value}</CardTitle>
          <CardDescription className="text-xs md:text-sm font-medium">{label}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="font-semibold text-lg">{trend}</span>
        <span className="text-xs">{description}</span>
      </CardContent>
      <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:bg-cyan-400/10 transition-colors duration-300" />
    </Card>
  );
}
