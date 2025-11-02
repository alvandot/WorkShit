import { StatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import tickets from '@/routes/tickets';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    CircleCheck,
    MapPin,
    Sparkles,
    Ticket as TicketIcon,
    TimerReset,
    TrendingUp,
    Users,
} from 'lucide-react';

interface DashboardMetrics {
    tickets_total: number;
    tickets_open: number;
    tickets_need_receive: number;
    tickets_in_progress: number;
    tickets_finish: number;
    tickets_closed: number;
    engineers_total: number;
    special_places_total: number;
}

interface RecentTicket {
    id: number;
    ticket_number: string;
    company: string;
    status: string;
    assigned_to?: string | null;
    created_at?: string | null;
}

interface UpcomingSchedule {
    id: number;
    ticket_number: string;
    company: string;
    status: string;
    schedule?: string | null;
}

interface EngineerHighlight {
    id: number;
    name: string;
    specialization?: string | null;
    province?: string | null;
    is_active: boolean;
    special_places_count: number;
}

interface ProvinceDistribution {
    province?: string | null;
    code?: string | null;
    total: number;
}

interface TrendPoint {
    day: string;
    total: number;
}

interface DashboardProps extends SharedData {
    filters: {
        range: string;
    };
    metrics: DashboardMetrics;
    recentTickets: RecentTicket[];
    upcomingSchedules: UpcomingSchedule[];
    engineerHighlights: EngineerHighlight[];
    specialPlaceDistribution: ProvinceDistribution[];
    weeklyTicketTrend: TrendPoint[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

function formatDate(date?: string | null): string {
    if (!date) {
        return '—';
    }

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
        ? '—'
        : dateTimeFormatter.format(parsed);
}

function formatTime(date?: string | null): string {
    if (!date) {
        return '—';
    }

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime()) ? '—' : timeFormatter.format(parsed);
}

function initialsFromName(name: string): string {
    const parts = name.trim().split(/\s+/);
    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function AppDeskDashboard({
    auth,
    metrics,
    recentTickets,
    upcomingSchedules,
    engineerHighlights,
    specialPlaceDistribution,
    weeklyTicketTrend,
}: DashboardProps) {
    const metricCards = [
        {
            key: 'open',
            label: 'Open',
            value: metrics.tickets_open,
            icon: TicketIcon,
        },
        {
            key: 'need_receive',
            label: 'Need to Receive',
            value: metrics.tickets_need_receive,
            icon: TimerReset,
        },
        {
            key: 'in_progress',
            label: 'In Progress',
            value: metrics.tickets_in_progress,
            icon: Sparkles,
        },
        {
            key: 'closed',
            label: 'Closed',
            value: metrics.tickets_closed,
            icon: CircleCheck,
        },
    ];

    const trendMax =
        weeklyTicketTrend.length > 0
            ? Math.max(...weeklyTicketTrend.map((p) => p.total))
            : 1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 pb-10">
                <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 starting:translate-y-4 starting:opacity-0">
                    <div className="bg-[radial-gradient(circle_at_center,_theme(colors.primary/25),_transparent_70%)] absolute inset-y-0 right-0 hidden w-1/3 lg:block" />
                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-4">
                            <Badge
                                variant="outline"
                                className="rounded-full border-white/30 bg-white/20 text-xs font-medium tracking-[0.4em] text-white uppercase dark:text-foreground"
                            >
                                {auth.user.name
                                    ? `Welcome back, ${auth.user.name.split(' ')[0]}`
                                    : 'Welcome back'}
                            </Badge>
                            <div className="space-y-2">
                                <h1 className="text-4xl font-bold text-balance sm:text-5xl">
                                    Field Operations Command Center
                                </h1>
                                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                    Monitor ticket velocity, engineer coverage,
                                    and special place readiness in one
                                    consolidated snapshot.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href={tickets.create().url}>
                                    <Button className="gap-2 rounded-full shadow-sm">
                                        <Sparkles className="size-4" />
                                        Create Ticket
                                    </Button>
                                </Link>
                                <Link href={tickets.index().url}>
                                    <Button
                                        variant="outline"
                                        className="gap-2 rounded-full"
                                    >
                                        <TicketIcon className="size-4" />
                                        View All Tickets
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="grid gap-3 rounded-2xl border border-white/20 bg-white/15 px-6 py-4 text-sm text-white shadow-sm backdrop-blur dark:text-foreground">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs tracking-[0.35em] text-white/70 uppercase dark:text-muted-foreground">
                                    Active Tickets
                                </span>
                                <span className="text-2xl font-semibold">
                                    {metrics.tickets_total}
                                </span>
                            </div>
                            <Separator className="border-white/40" />
                            <div className="flex items-center justify-between gap-4 text-xs">
                                <div className="flex flex-col">
                                    <span className="tracking-[0.35em] text-white/60 uppercase dark:text-muted-foreground">
                                        Engineers
                                    </span>
                                    <span className="text-lg font-semibold">
                                        {metrics.engineers_total}
                                    </span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="tracking-[0.35em] text-white/60 uppercase dark:text-muted-foreground">
                                        Special Places
                                    </span>
                                    <span className="text-lg font-semibold">
                                        {metrics.special_places_total}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {metricCards.map((metric) => {
                        const Icon = metric.icon;

                        return (
                            <Card
                                key={metric.key}
                                className="border border-border/60"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {metric.label}
                                    </CardTitle>
                                    <div className="rounded-full border border-primary/20 bg-primary/10 p-2 text-primary">
                                        <Icon className="size-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-semibold">
                                        {metric.value}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
                    <Card className="border border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Weekly Ticket Momentum</CardTitle>
                                <CardDescription>
                                    Daily volume for the last 7 days
                                </CardDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className="gap-1 rounded-full border-primary/30 bg-primary/10 text-primary"
                            >
                                <TrendingUp className="size-3" />
                                {weeklyTicketTrend.reduce(
                                    (sum, item) => sum + item.total,
                                    0,
                                )}{' '}
                                This Week
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex h-48 items-end gap-3">
                                {weeklyTicketTrend.map((point) => {
                                    const height = Math.max(
                                        (point.total / trendMax) * 100,
                                        6,
                                    );

                                    return (
                                        <div
                                            key={point.day}
                                            className="group flex min-w-[36px] flex-1 flex-col items-center gap-2"
                                        >
                                            <div className="relative flex h-full w-full items-end rounded-lg bg-primary/10">
                                                <div
                                                    className="mx-auto w-full rounded-lg bg-gradient-to-t from-primary/80 via-primary/60 to-primary/30 transition-all group-hover:via-primary/80"
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                />
                                                <span className="absolute -top-6 hidden rounded-full bg-background px-2 py-1 text-xs font-semibold shadow-sm group-hover:block">
                                                    {point.total} tickets
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {point.day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/60">
                        <CardHeader>
                            <CardTitle>Special Place Coverage</CardTitle>
                            <CardDescription>
                                Top provinces by special place assignments
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {specialPlaceDistribution.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No special places recorded yet.
                                </p>
                            )}
                            {specialPlaceDistribution.map((item) => (
                                <div
                                    key={
                                        item.code ?? item.province ?? 'unknown'
                                    }
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4 text-primary" />
                                            <span>
                                                {item.province ??
                                                    'Unknown Province'}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground">
                                            {item.total}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                                            style={{
                                                width: `${Math.min(item.total * 10, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <Card className="border border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Tickets</CardTitle>
                                <CardDescription>
                                    Latest activity across the network
                                </CardDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className="rounded-full border-primary/30 bg-primary/10 text-xs text-primary"
                            >
                                <TicketIcon className="mr-1 size-3" />
                                {metrics.tickets_total} total
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ticket</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead className="text-right">
                                            Created
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTickets.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-10 text-center text-sm text-muted-foreground"
                                            >
                                                No recent tickets yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {recentTickets.map((ticket) => (
                                        <TableRow
                                            key={ticket.id}
                                            className="hover:bg-primary/5"
                                        >
                                            <TableCell className="font-medium">
                                                {ticket.ticket_number}
                                            </TableCell>
                                            <TableCell>
                                                {ticket.company}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={ticket.status}
                                                    size="sm"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {ticket.assigned_to ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">
                                                {formatDate(ticket.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Upcoming Schedules</CardTitle>
                                <CardDescription>
                                    Next visits and commitments
                                </CardDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className="rounded-full border-primary/30 bg-primary/10 text-xs text-primary"
                            >
                                <CalendarDays className="mr-1 size-3" />
                                {upcomingSchedules.length}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcomingSchedules.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No scheduled visits for the upcoming days.
                                </p>
                            )}
                            {upcomingSchedules.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-muted/20 p-4 transition hover:border-primary/40 hover:bg-primary/5"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">
                                            {item.ticket_number}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.company}
                                        </p>
                                        <StatusBadge
                                            status={item.status}
                                            size="sm"
                                        />
                                    </div>
                                    <div className="flex flex-col items-end text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays className="size-3" />
                                            {formatTime(item.schedule)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <Card className="border border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Engineer Highlights</CardTitle>
                                <CardDescription>
                                    Coverage across special places
                                </CardDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className="rounded-full border-primary/30 bg-primary/10 text-xs text-primary"
                            >
                                <Users className="mr-1 size-3" />
                                {metrics.engineers_total} engineers
                            </Badge>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/60">
                            {engineerHighlights.length === 0 && (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    No engineer data available yet.
                                </p>
                            )}
                            {engineerHighlights.map((eng) => (
                                <div
                                    key={eng.id}
                                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-10 border border-border/50">
                                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                {initialsFromName(eng.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-0.5">
                                            <p className="text-sm leading-none font-semibold">
                                                {eng.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {eng.specialization ?? '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                eng.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="text-[10px]"
                                        >
                                            {eng.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="size-3" />
                                            {eng.special_places_count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border border-border/60">
                        <CardHeader>
                            <CardTitle>Special Place Distribution</CardTitle>
                            <CardDescription>
                                Geographic coverage by province
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {specialPlaceDistribution.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No distribution data available.
                                </p>
                            )}
                            {specialPlaceDistribution.map((prov) => (
                                <div
                                    key={prov.code}
                                    className="flex items-center justify-between gap-2"
                                >
                                    <span className="text-sm font-medium">
                                        {prov.province}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{
                                                    width: `${(prov.total / (specialPlaceDistribution.length > 0 ? Math.max(...specialPlaceDistribution.map((p) => p.total)) : 1)) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="w-8 text-right text-xs font-semibold text-muted-foreground">
                                            {prov.total}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}

export default AppDeskDashboard;
