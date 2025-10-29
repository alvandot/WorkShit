import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { format, isToday, isWithinInterval, parseISO } from 'date-fns';
import {
    Download,
    Eye,
    FileText,
    Filter,
    Layers,
    LineChart,
    ListChecks,
    MoreVertical,
    Pencil,
    Plus,
    Radar,
    RefreshCcw,
    Trash,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Ticket {
    id: number;
    ticket_number: string;
    case_id: string | null;
    company: string;
    serial_number: string | null;
    problem: string;
    schedule: string | null;
    deadline: string | null;
    status: string;
    assigned_to: number | null;
    created_by: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    assigned_to_user?: User;
    created_by_user?: User;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTickets {
    data: Ticket[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    tickets: PaginatedTickets;
    filters: {
        search?: string;
        status?: string;
    };
}

const statusColors: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Need to Receive':
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'In Progress':
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Finish:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function TicketsIndex({ tickets, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const now = useMemo(() => new Date(), []);

    const metrics = useMemo(() => {
        const activeStatuses = ['Open', 'Need to Receive', 'In Progress', 'Finish'];

        const base = {
            total: tickets.data.length,
            active: 0,
            scheduledToday: 0,
            dueSoon: 0,
        };

        tickets.data.forEach((ticket) => {
            if (activeStatuses.includes(ticket.status)) {
                base.active += 1;
            }

            if (ticket.schedule) {
                const scheduleDate = parseISO(ticket.schedule);
                if (isToday(scheduleDate)) {
                    base.scheduledToday += 1;
                }

                if (
                    isWithinInterval(scheduleDate, {
                        start: now,
                        end: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2),
                    })
                ) {
                    base.dueSoon += 1;
                }
            } else if (ticket.deadline) {
                const deadlineDate = parseISO(ticket.deadline);
                if (
                    isWithinInterval(deadlineDate, {
                        start: now,
                        end: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2),
                    })
                ) {
                    base.dueSoon += 1;
                }
            }
        });

        return base;
    }, [now, tickets.data]);

    const upcomingTicket = useMemo(() => {
        const scheduledTickets = tickets.data
            .filter((ticket) => ticket.schedule)
            .map((ticket) => ({
                ...ticket,
                scheduleDate: parseISO(ticket.schedule as string),
            }))
            .sort((a, b) => a.scheduleDate.getTime() - b.scheduleDate.getTime());

        return scheduledTickets[0];
    }, [tickets.data]);

    const quickStatusFilters = useMemo(
        () => [
            {
                label: 'All Tickets',
                value: 'all',
                description: 'Every ticket in the system',
                icon: Layers,
            },
            {
                label: 'Active',
                value: 'open',
                description: 'Anything not marked closed',
                icon: RefreshCcw,
            },
            {
                label: 'Need to Receive',
                value: 'Need to Receive',
                description: 'Awaiting onsite acknowledgement',
                icon: Radar,
            },
            {
                label: 'In Progress',
                value: 'In Progress',
                description: 'Technicians currently working',
                icon: LineChart,
            },
            {
                label: 'Finish',
                value: 'Finish',
                description: 'Visits completed, awaiting closure',
                icon: ListChecks,
            },
        ],
        [],
    );

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/tickets',
            { search: value, status },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusFilter = (value: string) => {
        setStatus(value);
        router.get(
            '/tickets',
            { search, status: value === 'all' ? undefined : value },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this ticket?')) {
            router.delete(`/tickets/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Manage Tickets" />

            <div className="space-y-8">
                <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-lg transition-[transform,shadow] duration-300 hover:-translate-y-1 hover:shadow-2xl starting:translate-y-4 starting:opacity-0">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_theme(colors.primary/20),_transparent_65%)]" />
                    <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="space-y-3">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                        Ticket Operations
                                    </span>
                                    <h1 className="text-balance bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                                        Ticket Command Center
                                    </h1>
                                    <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                                        Monitor real-time progress, move quickly between statuses, and keep every customer request on track.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <a href="/tickets/export">
                                        <Button variant="outline" className="h-11 min-w-36 gap-2 rounded-full border-primary/40 bg-background/80 backdrop-blur">
                                            <Download className="size-4" />
                                            Export Excel
                                        </Button>
                                    </a>
                                    <Link href="/tickets/create">
                                        <Button className="h-11 min-w-36 gap-2 rounded-full bg-primary shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl">
                                            <Plus className="size-4" />
                                            Create Ticket
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <Card className="border-none bg-background/80 shadow-sm backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Tickets on this page
                                        </CardTitle>
                                        <Layers className="size-4 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">
                                            {metrics.total}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Paginated view of latest activity
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-none bg-background/80 shadow-sm backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Active right now
                                        </CardTitle>
                                        <RefreshCcw className="size-4 text-blue-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                                            {metrics.active}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Open, in progress, or awaiting visit
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-none bg-background/80 shadow-sm backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Scheduled today
                                        </CardTitle>
                                        <LineChart className="size-4 text-emerald-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">
                                            {metrics.scheduledToday}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Visits happening during today
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-none bg-background/80 shadow-sm backdrop-blur">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Due in 48h
                                        </CardTitle>
                                        <ListChecks className="size-4 text-amber-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-300">
                                            {metrics.dueSoon}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Either scheduled or deadlines approaching
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-background/70 p-4 shadow-sm backdrop-blur">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                            Quick Filters
                                        </p>
                                        <h2 className="text-base font-semibold text-foreground sm:text-lg">
                                            Snap to the queue segment you need
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Filter className="size-4" />
                                        <span>Server-side filters preserved on navigation</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {quickStatusFilters.map((filterOption) => {
                                        const Icon = filterOption.icon;
                                        const isActive = status === filterOption.value;
                                        return (
                                            <Button
                                                key={filterOption.value}
                                                type="button"
                                                variant={isActive ? 'default' : 'outline'}
                                                size="sm"
                                                className={cn(
                                                    'h-9 gap-2 rounded-full border-muted-foreground/10 px-4 transition-all',
                                                    isActive
                                                        ? 'shadow-lg shadow-primary/20'
                                                        : 'bg-background/80 hover:-translate-y-0.5 hover:shadow-md',
                                                )}
                                                onClick={() => handleStatusFilter(filterOption.value)}
                                            >
                                                <Icon className="size-4" />
                                                <div className="flex flex-col items-start">
                                                    <span className="text-xs font-semibold leading-none">
                                                        {filterOption.label}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-muted-foreground">
                                                        {filterOption.description}
                                                    </span>
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </div>
                                {upcomingTicket && (
                                    <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
                                        <LineChart className="size-4" />
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-semibold">
                                                Next scheduled visit:
                                            </span>
                                            <span>
                                                {format(upcomingTicket.scheduleDate, 'MMM dd, yyyy HH:mm')}
                                            </span>
                                            <span className="hidden text-muted-foreground sm:inline">
                                                • {upcomingTicket.company}
                                            </span>
                                            <Badge variant="outline" className="rounded-full border-primary/40 bg-white/60 text-xs text-primary">
                                                #{upcomingTicket.ticket_number}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Card className="border-none bg-background/70 shadow-sm backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">
                                    Smart Search
                                </CardTitle>
                                <CardDescription>
                                    Type to instantly filter results, switch status, and navigate with keyboard.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    type="search"
                                    placeholder="Search by ticket, company, or problem..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="h-11 rounded-xl border-muted-foreground/20 bg-background/90 px-4 text-sm shadow-inner shadow-primary/5 focus-visible:ring-2 focus-visible:ring-primary/50"
                                />
                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <p className="font-semibold uppercase tracking-[0.2em] text-foreground/60">
                                        Tips
                                    </p>
                                    <ul className="space-y-2">
                                        <li>
                                            • Use keywords like <span className="font-semibold text-foreground">"BAP"</span> or <span className="font-semibold text-foreground">"Printer"</span>
                                        </li>
                                        <li>
                                            • Hit <kbd className="rounded border bg-muted px-2 py-0.5 text-[10px] uppercase">Enter</kbd> to commit filters
                                        </li>
                                    </ul>
                                </div>
                                <div className="rounded-xl border border-dashed border-muted-foreground/30 p-3 text-xs text-muted-foreground">
                                    <p className="font-semibold text-foreground">
                                        Show entries
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Select defaultValue="10">
                                            <SelectTrigger className="h-9 w-24 rounded-lg border-muted-foreground/20 bg-background/80 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="25">25</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                                <SelectItem value="100">100</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span>per page</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-20 font-bold text-foreground">
                                    NO
                                </TableHead>
                                <TableHead className="font-bold text-foreground">
                                    NO TICKET
                                </TableHead>
                                <TableHead className="font-bold text-foreground">
                                    CASE ID
                                </TableHead>
                                <TableHead className="font-bold text-foreground">
                                    COMPANY
                                </TableHead>
                                <TableHead className="font-bold text-foreground">
                                    PROBLEM
                                </TableHead>
                                <TableHead className="font-bold text-foreground">
                                    SCHEDULE
                                </TableHead>
                                <TableHead className="font-bold text-foreground">
                                    STATUS
                                </TableHead>
                                <TableHead className="w-20 text-center font-bold text-foreground">
                                    OPTION
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="rounded-full bg-muted p-4">
                                                <Filter className="size-8 text-muted-foreground" />
                                            </div>
                                            <p className="text-lg font-medium">
                                                No tickets found
                                            </p>
                                            <p className="text-sm">
                                                Try adjusting your search or
                                                filter to find what you're
                                                looking for.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.data.map((ticket, index) => (
                                    <TableRow
                                        key={ticket.id}
                                        className="cursor-pointer border-b transition-colors last:border-0 hover:bg-primary/5"
                                        onClick={() =>
                                            router.visit(
                                                `/tickets/${ticket.id}/timeline`,
                                            )
                                        }
                                    >
                                        <TableCell className="font-medium text-muted-foreground">
                                            {(tickets.current_page - 1) *
                                                tickets.per_page +
                                                index +
                                                1}
                                        </TableCell>
                                        <TableCell className="font-semibold text-primary">
                                            {ticket.ticket_number}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {ticket.case_id ? (
                                                <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                                    {ticket.case_id}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {ticket.company}
                                        </TableCell>
                                        <TableCell className="max-w-sm">
                                            <div
                                                className="truncate text-sm"
                                                title={ticket.problem}
                                            >
                                                {ticket.problem}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {ticket.schedule ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium">
                                                        {format(
                                                            new Date(
                                                                ticket.schedule,
                                                            ),
                                                            'dd MMM yyyy',
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(
                                                            new Date(
                                                                ticket.schedule,
                                                            ),
                                                            'HH:mm',
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`${statusColors[ticket.status]} px-3 py-1 font-semibold shadow-sm`}
                                                variant="outline"
                                            >
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className="flex items-center justify-center"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="transition-colors hover:bg-primary/10 hover:text-primary"
                                                        >
                                                            <MoreVertical className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-48"
                                                    >
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/tickets/${ticket.id}/detail`}
                                                                className="cursor-pointer"
                                                            >
                                                                <FileText className="mr-2 size-4" />
                                                                Detail Lengkap
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/tickets/${ticket.id}`}
                                                                className="cursor-pointer"
                                                            >
                                                                <Eye className="mr-2 size-4" />
                                                                View Ticket
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/tickets/${ticket.id}/edit`}
                                                                className="cursor-pointer"
                                                            >
                                                                <Pencil className="mr-2 size-4" />
                                                                Edit Ticket
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    ticket.id,
                                                                )
                                                            }
                                                            className="cursor-pointer text-destructive focus:text-destructive"
                                                        >
                                                            <Trash className="mr-2 size-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Section */}
                {tickets.last_page > 1 && (
                    <div className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">
                            Showing{' '}
                            <span className="font-bold text-foreground">
                                {(tickets.current_page - 1) * tickets.per_page +
                                    1}
                            </span>{' '}
                            to{' '}
                            <span className="font-bold text-foreground">
                                {Math.min(
                                    tickets.current_page * tickets.per_page,
                                    tickets.total,
                                )}
                            </span>{' '}
                            of{' '}
                            <span className="font-bold text-foreground">
                                {tickets.total}
                            </span>{' '}
                            entries
                        </p>

                        <div className="flex items-center gap-2">
                            {tickets.links.map((link, index) => {
                                if (link.label === '&laquo; Previous') {
                                    return (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                            className="shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            Previous
                                        </Button>
                                    );
                                }

                                if (link.label === 'Next &raquo;') {
                                    return (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                            className="shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            Next
                                        </Button>
                                    );
                                }

                                return (
                                    <Button
                                        key={index}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url && router.get(link.url)
                                        }
                                        className={
                                            link.active
                                                ? 'shadow-lg'
                                                : 'shadow-sm transition-shadow hover:shadow-md'
                                        }
                                    >
                                        {link.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
