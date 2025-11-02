import AssignmentCard from '@/components/assignment-card';
import EngineerWorkloadCard from '@/components/engineer-workload-card';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    AssignmentFilters,
    EngineerStats,
    PaginatedData,
    TicketAssignment,
    User,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ClipboardList,
    Filter,
    RefreshCcw,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
    assignments: PaginatedData<TicketAssignment>;
    engineerStats: EngineerStats[];
    engineers: User[];
    filters: AssignmentFilters;
}

export default function AssignmentsIndex({
    assignments,
    engineerStats,
    engineers,
    filters,
}: Props) {
    const [engineerId, setEngineerId] = useState(
        filters.engineer_id?.toString() || 'all',
    );
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = () => {
        router.get(
            '/assignments',
            {
                engineer_id: engineerId !== 'all' ? engineerId : undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleReset = () => {
        setEngineerId('all');
        setDateFrom('');
        setDateTo('');
        router.get('/assignments', {}, { preserveState: true, replace: true });
    };

    const metrics = useMemo(() => {
        return {
            totalAssignments: assignments.total,
            totalEngineers: engineerStats.length,
            activeTickets: engineerStats.reduce(
                (sum, eng) => sum + eng.active_tickets_count,
                0,
            ),
            completedTickets: engineerStats.reduce(
                (sum, eng) => sum + eng.completed_tickets_count,
                0,
            ),
        };
    }, [assignments, engineerStats]);

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <Head title="Assignments" />

            <div className="space-y-6">
                <div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-3xl font-bold text-transparent">
                                Assignment Management
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Manage and track ticket assignments to engineers
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/tickets">
                                    <ClipboardList className="mr-2 size-4" />
                                    View Tickets
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total Assignments</CardDescription>
                            <CardTitle className="text-3xl">
                                {metrics.totalAssignments}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                Active assignments tracked
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Engineers</CardDescription>
                            <CardTitle className="flex items-baseline gap-2 text-3xl">
                                <Users className="size-6" />
                                {metrics.totalEngineers}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                Engineers with assignments
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Active Tickets</CardDescription>
                            <CardTitle className="text-3xl text-orange-600">
                                {metrics.activeTickets}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                Currently in progress
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Completed</CardDescription>
                            <CardTitle className="text-3xl text-green-600">
                                {metrics.completedTickets}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <TrendingUp className="size-3" />
                                Total completed tickets
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="size-5" />
                            Engineer Workload
                        </CardTitle>
                        <CardDescription>
                            Track engineer capacity and performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {engineerStats.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {engineerStats.map((engineer) => (
                                    <EngineerWorkloadCard
                                        key={engineer.id}
                                        engineer={engineer}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                No engineer statistics available
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="size-5" />
                                    Active Assignments
                                </CardTitle>
                                <CardDescription>
                                    Filter and view current assignments
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="min-w-[200px] flex-1 space-y-2">
                                <label className="text-sm font-medium">
                                    Engineer
                                </label>
                                <Select
                                    value={engineerId}
                                    onValueChange={setEngineerId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All engineers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Engineers
                                        </SelectItem>
                                        {engineers.map((engineer) => (
                                            <SelectItem
                                                key={engineer.id}
                                                value={engineer.id.toString()}
                                            >
                                                {engineer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="min-w-[150px] flex-1 space-y-2">
                                <label className="text-sm font-medium">
                                    Date From
                                </label>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) =>
                                        setDateFrom(e.target.value)
                                    }
                                />
                            </div>

                            <div className="min-w-[150px] flex-1 space-y-2">
                                <label className="text-sm font-medium">
                                    Date To
                                </label>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={handleFilter}>
                                    <Filter className="mr-2 size-4" />
                                    Apply
                                </Button>
                                <Button variant="outline" onClick={handleReset}>
                                    <RefreshCcw className="mr-2 size-4" />
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {assignments.data.length > 0 ? (
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {assignments.data.map((assignment) => (
                                        <AssignmentCard
                                            key={assignment.id}
                                            assignment={assignment}
                                        />
                                    ))}
                                </div>

                                {assignments.links.length > 3 && (
                                    <div className="flex items-center justify-center gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(
                                                    assignments.prev_page_url,
                                                )
                                            }
                                            disabled={
                                                !assignments.prev_page_url
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Page {assignments.current_page} of{' '}
                                            {assignments.last_page}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(
                                                    assignments.next_page_url,
                                                )
                                            }
                                            disabled={
                                                !assignments.next_page_url
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                <ClipboardList className="mx-auto mb-4 size-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium">
                                    No assignments found
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    {filters.engineer_id || filters.date_from
                                        ? 'Try adjusting your filters'
                                        : 'Start by assigning tickets to engineers'}
                                </p>
                                <Button asChild variant="outline">
                                    <Link href="/tickets">View Tickets</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
