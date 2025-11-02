import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

// Generic skeleton card
export function SkeletonCard({ className }: { className?: string }) {
    return (
        <Card className={className}>
            <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>
    );
}

// Metrics cards skeleton
export function MetricsCardSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="size-8 rounded-full" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-32" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Table skeleton
interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    showHeader?: boolean;
    className?: string;
}

export function TableSkeleton({ rows = 5, columns = 5, showHeader = true, className }: TableSkeletonProps) {
    return (
        <div className={cn('rounded-md border', className)}>
            <Table>
                {showHeader && (
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: columns }).map((_, i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-4 w-20" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                )}
                <TableBody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// Ticket row skeleton (for tickets table)
export function TicketRowSkeleton() {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="size-4 rounded" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </TableCell>
            <TableCell>
                <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell className="text-right">
                <Skeleton className="ml-auto size-8 rounded" />
            </TableCell>
        </TableRow>
    );
}

// Form skeleton
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
    return (
        <Card>
            <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
                {Array.from({ length: fields }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                ))}
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}

// List skeleton
export function ListSkeleton({ items = 5 }: { items?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-16 rounded-full" />
                </div>
            ))}
        </div>
    );
}

// Stats grid skeleton
export function StatsGridSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            <Skeleton className="size-12 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Chart skeleton
export function ChartSkeleton({ className }: { className?: string }) {
    const heights = [120, 180, 150, 200, 140, 190, 160];

    return (
        <Card className={className}>
            <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent>
                <div className="flex h-64 items-end gap-2">
                    {heights.map((height, i) => (
                        <Skeleton key={i} className="flex-1" style={{ height: `${height}px` }} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Avatar skeleton
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'size-6',
        md: 'size-10',
        lg: 'size-16',
    };

    return <Skeleton className={cn('rounded-full', sizes[size])} />;
}

// Page header skeleton
export function PageHeaderSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
}

// Combined page skeleton (common layout)
export function PageSkeleton() {
    return (
        <div className="space-y-6">
            <PageHeaderSkeleton />
            <MetricsCardSkeleton />
            <TableSkeleton />
        </div>
    );
}
