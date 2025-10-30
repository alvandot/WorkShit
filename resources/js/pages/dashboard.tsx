// --- Neon Fusion Dashboard Section (from neon-fusion-dashboard.tsx) ---

import { Globe as GlobeNeon, BookOpen as BookOpenNeon, Palette as PaletteNeon } from 'lucide-react';
import { useState as useStateNeon } from 'react';

const neonKpis = [
    {
        label: 'Global Reach',
        value: '72 Countries',
        icon: <GlobeNeon className="size-7 text-cyan-400" />,
        trend: '+3',
        description: 'new countries this month',
    },
    {
        label: 'Knowledge Base',
        value: '1,204',
        icon: <BookOpenNeon className="size-7 text-purple-400" />,
        trend: '+120',
        description: 'articles published',
    },
    {
        label: 'Design Variants',
        value: '18',
        icon: <PaletteNeon className="size-7 text-pink-400" />,
        trend: '+2',
        description: 'new themes',
    },
    {
        label: 'Active Users',
        value: 1287,
        icon: <Users className="size-7 text-cyan-400" />,
        trend: '+4.2%',
        description: 'in the last 24 hours',
    },
];

export function NeonFusionDashboard() {
    const [hovered, setHovered] = useStateNeon<number | null>(null);
    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-cyan-900 py-10 px-2 md:px-8 font-sans">
                <header className="mb-8">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest text-cyan-300 font-orbitron drop-shadow-neon mb-2 uppercase transition-colors duration-500">Neon Fusion Dashboard</h1>
                    <p className="text-base md:text-lg text-purple-200 font-normal max-w-2xl leading-relaxed">A futuristic dashboard blending neon colors, geometric grid layouts, and Orbitron headings for a cyberpunk-inspired experience.</p>
                </header>
                <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {neonKpis.map((kpi, idx) => (
                        <Card
                            key={kpi.label}
                            className={`group relative bg-black/80 border border-cyan-700 shadow-2xl rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-neon focus-within:ring-2 focus-within:ring-pink-400 ${hovered === idx ? 'ring-2 ring-cyan-400' : ''}`}
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            tabIndex={0}
                        >
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="p-3 rounded-full bg-gradient-to-br from-cyan-700 to-purple-800 shadow-md group-hover:scale-110 transition-transform duration-300">
                                    {kpi.icon}
                                </div>
                                <div>
                                    <CardTitle className="text-2xl md:text-3xl font-orbitron text-cyan-200 font-bold tracking-widest mb-1 uppercase">{kpi.value}</CardTitle>
                                    <CardDescription className="text-purple-200 text-xs md:text-sm font-medium uppercase tracking-wide">{kpi.label}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <span className="text-pink-400 font-semibold text-lg">{kpi.trend}</span>
                                <span className="text-cyan-300 text-xs">{kpi.description}</span>
                            </CardContent>
                            <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:bg-cyan-400/10 transition-colors duration-300" />
                        </Card>
                    ))}
                </section>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    <Card className="bg-black/80 border border-cyan-700 shadow-2xl rounded-xl transition-shadow duration-300 hover:shadow-neon">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl font-orbitron text-cyan-200 font-bold uppercase">Live Activity</CardTitle>
                            <CardDescription className="text-purple-200">Real-time updates and micro-interactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="bg-cyan-900/40 text-cyan-200 border-cyan-400 hover:bg-cyan-800/60 hover:text-white transition-all duration-300 shadow-md font-orbitron">Trigger Action</Button>
                            <div className="mt-6 h-24 flex items-center justify-center text-pink-400 animate-pulse font-orbitron text-lg">Live data coming soon...</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-black/80 border border-cyan-700 shadow-2xl rounded-xl transition-shadow duration-300 hover:shadow-neon">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl font-orbitron text-cyan-200 font-bold uppercase">Analytics</CardTitle>
                            <CardDescription className="text-purple-200">Charts, trends, and more</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-24 flex items-center justify-center text-cyan-400 font-orbitron text-lg">Chart coming soon...</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-black/80 border border-cyan-700 shadow-2xl rounded-xl transition-shadow duration-300 hover:shadow-neon">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl font-orbitron text-cyan-200 font-bold uppercase">Design Gallery</CardTitle>
                            <CardDescription className="text-purple-200">Explore fusion themes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-24 flex items-center justify-center text-pink-400 font-orbitron text-lg">Gallery coming soon...</div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
// --- Minimalist Split Dashboard Section (from minimalist-split-dashboard.tsx) ---

import { Globe as GlobeSplit, BookOpen as BookOpenSplit, Palette as PaletteSplit } from 'lucide-react';
import { useState as useStateSplit } from 'react';

const splitKpis = [
    {
        label: 'Collaborators',
        value: 19,
        icon: <Users className="size-7 text-slate-600" />,
        trend: '+2',
        description: 'joined this week',
    },
    {
        label: 'Docs',
        value: '312',
        icon: <BookOpenSplit className="size-7 text-accent-500" />,
        trend: '+8',
        description: 'pages updated',
    },
    {
        label: 'Continents',
        value: '5',
        icon: <GlobeSplit className="size-7 text-slate-400" />,
        trend: 'stable',
        description: 'coverage',
    },
    {
        label: 'Palettes',
        value: '4',
        icon: <PaletteSplit className="size-7 text-accent-400" />,
        trend: '+1',
        description: 'added',
    },
];

export function MinimalistSplitDashboard() {
    const [hovered, setHovered] = useStateSplit<number | null>(null);
    return (
        <AppLayout>
            <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-mono">
                <aside className="md:w-1/3 bg-slate-900 text-white flex flex-col justify-between py-12 px-6 md:px-10 shadow-2xl">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-accent-400">Minimalist Split</h1>
                        <p className="text-base md:text-lg text-slate-200 font-normal max-w-md leading-relaxed mb-8">A dashboard with a strong left-right split, slate and white contrast, and mono body for a clean, modern, and focused look.</p>
                        <div className="space-y-6">
                            {splitKpis.map((kpi, idx) => (
                                <Card
                                    key={kpi.label}
                                    className={`group relative bg-slate-800/80 border-none shadow-lg rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus-within:ring-2 focus-within:ring-accent-400 ${hovered === idx ? 'ring-2 ring-accent-400' : ''}`}
                                    onMouseEnter={() => setHovered(idx)}
                                    onMouseLeave={() => setHovered(null)}
                                    tabIndex={0}
                                >
                                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-accent-400 to-slate-700 shadow-md group-hover:scale-110 transition-transform duration-300">
                                            {kpi.icon}
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-accent-200 mb-1">{kpi.value}</CardTitle>
                                            <CardDescription className="text-slate-200 text-xs font-medium">{kpi.label}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2">
                                        <span className="text-accent-400 font-semibold text-lg">{kpi.trend}</span>
                                        <span className="text-slate-300 text-xs">{kpi.description}</span>
                                    </CardContent>
                                    <div className="absolute inset-0 rounded-lg pointer-events-none group-hover:bg-accent-400/10 transition-colors duration-300" />
                                </Card>
                            ))}
                        </div>
                    </div>
                    <footer className="mt-12 text-slate-400 text-xs">&copy; 2025 Minimalist Split Demo</footer>
                </aside>
                <main className="flex-1 flex flex-col justify-center items-center py-16 px-4 md:px-12">
                    <Card className="w-full max-w-2xl bg-white border-none shadow-xl rounded-2xl transition-shadow duration-300 hover:shadow-2xl mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900">Live Collaboration</CardTitle>
                            <CardDescription className="text-slate-500">Real-time updates and mono micro-interactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="bg-accent-50 text-accent-600 border-accent-400 hover:bg-accent-100 hover:text-accent-900 transition-all duration-300 shadow-md font-mono">Trigger Collaboration</Button>
                            <div className="mt-6 h-24 flex items-center justify-center text-accent-400 animate-pulse font-mono text-lg">Collaboration data coming soon...</div>
                        </CardContent>
                    </Card>
                    <Card className="w-full max-w-2xl bg-white border-none shadow-xl rounded-2xl transition-shadow duration-300 hover:shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900">Docs Analytics</CardTitle>
                            <CardDescription className="text-slate-500">Docs trends and more</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-24 flex items-center justify-center text-accent-400 font-mono text-lg">Chart coming soon...</div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </AppLayout>
    );
}
// --- KPI Demo Dashboard Section (from demo-dashboard.tsx) ---

import { TrendingUp as TrendingUpDemo, Users as UsersDemo, Activity, Zap } from 'lucide-react';
import { useState as useStateDemo } from 'react';

const kpis = [
    {
        label: 'Active Users',
        value: 1287,
        icon: <UsersDemo className="size-7 text-cyan-400" />,
        trend: '+4.2%',
        description: 'in the last 24 hours',
    },
    {
        label: 'Engagement',
        value: '87%',
        icon: <Activity className="size-7 text-blue-400" />,
        trend: '+2.1%',
        description: 'vs last week',
    },
    {
        label: 'Performance',
        value: '99.9%',
        icon: <Zap className="size-7 text-cyan-300" />,
        trend: 'stable',
        description: 'system uptime',
    },
    {
        label: 'Growth',
        value: '+312',
        icon: <TrendingUpDemo className="size-7 text-blue-300" />,
        trend: '+8.7%',
        description: 'new signups',
    },
];

export function DemoKpiDashboard() {
    const [hovered, setHovered] = useStateDemo<number | null>(null);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 py-12 px-4 sm:px-8 font-sans">
                <header className="mb-10">
                    <h1 className="text-5xl font-extrabold tracking-tight text-cyan-300 font-inter drop-shadow-lg mb-2 transition-colors duration-500">Professional Dashboard</h1>
                    <p className="text-lg text-blue-100 font-normal max-w-2xl leading-relaxed">A modern, interactive dashboard built with React, Tailwind CSS, and shadcn/ui. Experience a dark blue and cyan palette, Inter headings, and micro-interactions throughout.</p>
                </header>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {kpis.map((kpi, idx) => (
                        <Card
                            key={kpi.label}
                            className={`group relative bg-blue-950/80 border-none shadow-xl rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus-within:ring-2 focus-within:ring-cyan-400 ${hovered === idx ? 'ring-2 ring-cyan-400' : ''}`}
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            tabIndex={0}
                        >
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="p-3 rounded-full bg-gradient-to-br from-cyan-700 to-blue-800 shadow-md group-hover:scale-110 transition-transform duration-300">
                                    {kpi.icon}
                                </div>
                                <div>
                                    <CardTitle className="text-3xl font-inter text-cyan-200 font-bold tracking-tight mb-1">{kpi.value}</CardTitle>
                                    <CardDescription className="text-blue-200 text-sm font-medium">{kpi.label}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <span className="text-cyan-400 font-semibold text-lg">{kpi.trend}</span>
                                <span className="text-blue-300 text-xs">{kpi.description}</span>
                            </CardContent>
                            <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:bg-cyan-400/5 transition-colors duration-300" />
                        </Card>
                    ))}
                </section>
                <section className="flex flex-col md:flex-row gap-8 items-stretch">
                    <Card className="flex-1 bg-blue-950/80 border-none shadow-xl rounded-2xl transition-shadow duration-300 hover:shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-inter text-cyan-200 font-bold">Live Activity</CardTitle>
                            <CardDescription className="text-blue-200">Real-time updates and micro-interactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="bg-cyan-900/40 text-cyan-200 border-cyan-400 hover:bg-cyan-800/60 hover:text-white transition-all duration-300 shadow-md font-inter">Trigger Action</Button>
                            <div className="mt-6 h-32 flex items-center justify-center text-cyan-400 animate-pulse font-inter text-xl">Live data coming soon...</div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1 bg-blue-950/80 border-none shadow-xl rounded-2xl transition-shadow duration-300 hover:shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-inter text-cyan-200 font-bold">Analytics</CardTitle>
                            <CardDescription className="text-blue-200">Charts, trends, and more</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-40 flex items-center justify-center text-cyan-400 font-inter text-xl">Chart coming soon...</div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
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
import { cn } from '@/lib/utils';
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

const statusColors: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
    'Need to Receive': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
    'In Progress': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200',
    Finish: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
    Closed: 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200',
};

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

    return Number.isNaN(parsed.getTime()) ? '—' : dateTimeFormatter.format(parsed);
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
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export default function Dashboard({
    auth,
    metrics,
    recentTickets,
    upcomingSchedules,
    engineerHighlights,
    specialPlaceDistribution,
    weeklyTicketTrend,
}: DashboardProps) {
    const trendMax = Math.max(...weeklyTicketTrend.map((point) => point.total), 5);

    const metricCards = [
        {
            key: 'tickets_open',
            label: 'Open Tickets',
            value: metrics.tickets_open,
            description: 'Awaiting first response',
            icon: TicketIcon,
        },
        {
            key: 'tickets_in_progress',
            label: 'In Progress',
            value: metrics.tickets_in_progress,
            description: 'Active onsite activity',
            icon: TimerReset,
        },
        {
            key: 'tickets_need_receive',
            label: 'Need to Receive',
            value: metrics.tickets_need_receive,
            description: 'Queued for next action',
            icon: Sparkles,
        },
        {
            key: 'tickets_finish',
            label: 'Recently Finished',
            value: metrics.tickets_finish,
            description: 'Waiting for final QA',
            icon: CircleCheck,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 pb-10">
                <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 starting:translate-y-4 starting:opacity-0">
                    <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,_theme(colors.primary/25),_transparent_70%)] lg:block" />
                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-4">
                            <Badge variant="outline" className="rounded-full border-white/30 bg-white/20 text-xs font-medium uppercase tracking-[0.4em] text-white dark:text-foreground">
                                {auth.user.name ? `Welcome back, ${auth.user.name.split(' ')[0]}` : 'Welcome back'}
                            </Badge>
                            <div className="space-y-2">
                                <h1 className="text-balance text-4xl font-bold sm:text-5xl">
                                    Field Operations Command Center
                                </h1>
                                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                    Monitor ticket velocity, engineer coverage, and special place readiness in one consolidated snapshot.
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
                                    <Button variant="outline" className="gap-2 rounded-full">
                                        <TicketIcon className="size-4" />
                                        View All Tickets
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="grid gap-3 rounded-2xl border border-white/20 bg-white/15 px-6 py-4 text-sm text-white shadow-sm backdrop-blur dark:text-foreground">
                            <div className="flex items-center justify-between gap-3">
                                <span className="uppercase tracking-[0.35em] text-xs text-white/70 dark:text-muted-foreground">
                                    Active Tickets
                                </span>
                                <span className="text-2xl font-semibold">{metrics.tickets_total}</span>
                            </div>
                            <Separator className="border-white/40" />
                            <div className="flex items-center justify-between gap-4 text-xs">
                                <div className="flex flex-col">
                                    <span className="uppercase tracking-[0.35em] text-white/60 dark:text-muted-foreground">
                                        Engineers
                                    </span>
                                    <span className="text-lg font-semibold">{metrics.engineers_total}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="uppercase tracking-[0.35em] text-white/60 dark:text-muted-foreground">
                                        Special Places
                                    </span>
                                    <span className="text-lg font-semibold">{metrics.special_places_total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {metricCards.map((metric) => {
                        const Icon = metric.icon;

                        return (
                            <Card key={metric.key} className="border border-border/60">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {metric.label}
                                    </CardTitle>
                                    <div className="rounded-full border border-primary/20 bg-primary/10 p-2 text-primary">
                                        <Icon className="size-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-semibold">{metric.value}</div>
                                    <p className="text-xs text-muted-foreground">{metric.description}</p>
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
                                <CardDescription>Daily volume for the last 7 days</CardDescription>
                            </div>
                            <Badge variant="outline" className="gap-1 rounded-full border-primary/30 bg-primary/10 text-primary">
                                <TrendingUp className="size-3" />
                                {weeklyTicketTrend.reduce((sum, item) => sum + item.total, 0)} This Week
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex h-48 items-end gap-3">
                                {weeklyTicketTrend.map((point) => {
                                    const height = Math.max((point.total / trendMax) * 100, 6);

                                    return (
                                        <div key={point.day} className="group flex min-w-[36px] flex-1 flex-col items-center gap-2">
                                            <div className="relative flex h-full w-full items-end rounded-lg bg-primary/10">
                                                <div
                                                    className="mx-auto w-full rounded-lg bg-gradient-to-t from-primary/80 via-primary/60 to-primary/30 transition-all group-hover:via-primary/80"
                                                    style={{ height: `${height}%` }}
                                                />
                                                <span className="absolute -top-6 hidden rounded-full bg-background px-2 py-1 text-xs font-semibold shadow-sm group-hover:block">
                                                    {point.total} tickets
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground">{point.day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/60">
                        <CardHeader>
                            <CardTitle>Special Place Coverage</CardTitle>
                            <CardDescription>Top provinces by special place assignments</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {specialPlaceDistribution.length === 0 && (
                                <p className="text-sm text-muted-foreground">No special places recorded yet.</p>
                            )}
                            {specialPlaceDistribution.map((item) => (
                                <div key={item.code ?? item.province ?? 'unknown'} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4 text-primary" />
                                            <span>{item.province ?? 'Unknown Province'}</span>
                                        </div>
                                        <span className="text-muted-foreground">{item.total}</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                                            style={{ width: `${Math.min(item.total * 10, 100)}%` }}
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
                                <CardDescription>Latest activity across the network</CardDescription>
                            </div>
                            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-xs text-primary">
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
                                        <TableHead className="text-right">Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTickets.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                                No recent tickets yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {recentTickets.map((ticket) => (
                                        <TableRow key={ticket.id} className="hover:bg-primary/5">
                                            <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                                            <TableCell>{ticket.company}</TableCell>
                                            <TableCell>
                                                <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold', statusColors[ticket.status] ?? 'bg-muted text-muted-foreground')}>
                                                    {ticket.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>{ticket.assigned_to ?? '—'}</TableCell>
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
                                <CardDescription>Next visits and commitments</CardDescription>
                            </div>
                            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-xs text-primary">
                                <CalendarDays className="mr-1 size-3" />
                                {upcomingSchedules.length}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcomingSchedules.length === 0 && (
                                <p className="text-sm text-muted-foreground">No scheduled visits for the upcoming days.</p>
                            )}
                            {upcomingSchedules.map((item) => (
                                <div key={item.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-muted/20 p-4 transition hover:border-primary/40 hover:bg-primary/5">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">{item.ticket_number}</p>
                                        <p className="text-xs text-muted-foreground">{item.company}</p>
                                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider', statusColors[item.status] ?? 'bg-muted text-muted-foreground')}>
                                            {item.status}
                                        </span>
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
                                <CardDescription>Coverage across special places</CardDescription>
                            </div>
                            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-xs text-primary">
                                <Users className="mr-1 size-3" />
                                {metrics.engineers_total} engineers
                            </Badge>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/60">
                            {engineerHighlights.length === 0 && (
                                <div className="py-6 text-sm text-muted-foreground">No engineers registered yet.</div>
                            )}
                            {engineerHighlights.map((engineer) => (
                                <div key={engineer.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{initialsFromName(engineer.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold">{engineer.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {engineer.specialization ?? 'Generalist'} · {engineer.province ?? 'No base province'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-xs">
                                        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-semibold text-primary">
                                            {engineer.special_places_count} special places
                                        </span>
                                        <Badge variant={engineer.is_active ? 'outline' : 'secondary'} className="rounded-full">
                                            {engineer.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            </div>
            {/* All KPI demo sections removed. Only AppDesk dashboard remains. */}
        </AppLayout>
    );
}
