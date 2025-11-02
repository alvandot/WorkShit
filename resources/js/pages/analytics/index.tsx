import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Activity,
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    Download,
    Minus,
    RefreshCw,
    TicketIcon,
    Timer,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface PageProps {
    filters: {
        start_date: string;
        end_date: string;
        period: string;
        tab?: string;
    };
}

interface OverviewData {
    total_tickets: number;
    active_tickets: number;
    closed_tickets: number;
    status_distribution: Record<string, number>;
    priority_distribution: Record<string, number>;
    avg_resolution_time_hours: number;
    technician_stats: Array<{
        id: number;
        name: string;
        assigned_tickets: number;
        completed_tickets: number;
        completion_rate: number;
    }>;
}

interface TrendsData {
    creation_trends: Record<string, number>;
    closure_trends: Record<string, number>;
    activity_trends: Record<string, number>;
    period: string;
}

interface PerformanceData {
    sla_compliance_rate: number;
    avg_first_response_time_hours: number;
    revisit_rate: number;
    activity_breakdown: Record<string, number>;
}

interface TicketsData {
    ticket_trends: Record<string, Record<string, number>>;
    response_time_distribution: Record<string, number>;
    status_funnel: Array<{ status: string; count: number }>;
    top_companies: Array<{ company: string; count: number }>;
}

interface EngineersData {
    engineer_workload: Array<{
        id: number;
        name: string;
        email: string;
        total_assigned: number;
        open_tickets: number;
        completed_tickets: number;
        completion_rate: number;
        avg_completion_hours: number;
    }>;
    engineer_utilization: Record<string, Record<string, number>>;
}

interface PartsData {
    top_parts: Array<{
        part_name: string;
        part_number: string;
        usage_count: number;
    }>;
    parts_trend: Record<string, number>;
    parts_per_ticket_distribution: Record<string, number>;
}

interface ComparisonsData {
    current_period: {
        start: string;
        end: string;
        metrics: {
            total_tickets: number;
            closed_tickets: number;
            avg_resolution_hours: number;
            revisit_rate: number;
        };
    };
    previous_period: {
        start: string;
        end: string;
        metrics: {
            total_tickets: number;
            closed_tickets: number;
            avg_resolution_hours: number;
            revisit_rate: number;
        };
    };
    changes: {
        total_tickets: number;
        closed_tickets: number;
        avg_resolution_hours: number;
        revisit_rate: number;
    };
}

const COLORS = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899',
    cyan: '#06b6d4',
    emerald: '#10b981',
};

const STATUS_COLORS = [
    COLORS.primary,
    COLORS.warning,
    COLORS.purple,
    COLORS.success,
    COLORS.danger,
];

export default function AnalyticsIndex({ filters }: PageProps) {
    const [dateRange, setDateRange] = useState({
        start: filters.start_date,
        end: filters.end_date,
    });
    const [period, setPeriod] = useState(filters.period);
    const [loading, setLoading] = useState(true);
    const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
    const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
    const [performanceData, setPerformanceData] =
        useState<PerformanceData | null>(null);
    const [ticketsData, setTicketsData] = useState<TicketsData | null>(null);
    const [engineersData, setEngineersData] = useState<EngineersData | null>(
        null,
    );
    const [partsData, setPartsData] = useState<PartsData | null>(null);
    const [comparisonsData, setComparisonsData] =
        useState<ComparisonsData | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [activeTab, setActiveTab] = useState(filters.tab || 'overview');

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                start_date: dateRange.start,
                end_date: dateRange.end,
                period,
            });

            const [
                overview,
                trends,
                performance,
                tickets,
                engineers,
                parts,
                comparisons,
            ] = await Promise.all([
                fetch(`/api/analytics/overview?${params}`).then((r) => r.json()),
                fetch(`/api/analytics/trends?${params}`).then((r) => r.json()),
                fetch(`/api/analytics/performance?${params}`).then((r) => r.json()),
                fetch(
                    `/api/analytics/tickets?${new URLSearchParams({ start_date: dateRange.start, end_date: dateRange.end, group_by: period })}`,
                ).then((r) => r.json()),
                fetch(
                    `/api/analytics/engineers?${new URLSearchParams({ start_date: dateRange.start, end_date: dateRange.end })}`,
                ).then((r) => r.json()),
                fetch(
                    `/api/analytics/parts?${new URLSearchParams({ start_date: dateRange.start, end_date: dateRange.end })}`,
                ).then((r) => r.json()),
                fetch(
                    `/api/analytics/comparisons?${new URLSearchParams({ current_start: dateRange.start, current_end: dateRange.end })}`,
                ).then((r) => r.json()),
            ]);

            setOverviewData(overview);
            setTrendsData(trends);
            setPerformanceData(performance);
            setTicketsData(tickets);
            setEngineersData(engineers);
            setPartsData(parts);
            setComparisonsData(comparisons);
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange, period]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(fetchData, 60000); // Refresh every minute
            return () => clearInterval(interval);
        }
    }, [autoRefresh, dateRange, period]);

    const handleExport = (type: string) => {
        const params = new URLSearchParams({
            type,
            start_date: dateRange.start,
            end_date: dateRange.end,
        });
        window.location.href = `/analytics/export?${params}`;
    };

    const handleDatePreset = (preset: string) => {
        const now = new Date();
        let start: Date;
        let end = now;

        switch (preset) {
            case 'today':
                start = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                start = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                start = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'quarter':
                start = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case 'year':
                start = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                start = new Date(now.setDate(now.getDate() - 30));
        }

        setDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0],
        });
    };

    const TrendIndicator = ({ value }: { value: number }) => {
        if (value > 0) {
            return (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <ArrowUp className="size-4" />
                    <span className="text-sm font-medium">{value}%</span>
                </div>
            );
        } else if (value < 0) {
            return (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <ArrowDown className="size-4" />
                    <span className="text-sm font-medium">
                        {Math.abs(value)}%
                    </span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Minus className="size-4" />
                <span className="text-sm font-medium">0%</span>
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Analytics Dashboard" />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
                <div className="space-y-2">
                    <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold text-transparent">
                        Analytics Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Comprehensive insights and performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={autoRefresh ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                        <RefreshCw
                            className={`mr-2 size-4 ${autoRefresh ? 'animate-spin' : ''}`}
                        />
                        Auto Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchData()}
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                        <div className="space-y-2">
                            <Label>Date Preset</Label>
                            <Select
                                onValueChange={handleDatePreset}
                                defaultValue="month"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select preset" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">
                                        Last 7 Days
                                    </SelectItem>
                                    <SelectItem value="month">
                                        Last 30 Days
                                    </SelectItem>
                                    <SelectItem value="quarter">
                                        Last 3 Months
                                    </SelectItem>
                                    <SelectItem value="year">
                                        Last Year
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) =>
                                    setDateRange({
                                        ...dateRange,
                                        start: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) =>
                                    setDateRange({
                                        ...dateRange,
                                        end: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Period</Label>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hour">Hourly</SelectItem>
                                    <SelectItem value="day">Daily</SelectItem>
                                    <SelectItem value="week">Weekly</SelectItem>
                                    <SelectItem value="month">
                                        Monthly
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end space-y-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleExport('overview')}
                            >
                                <Download className="mr-2 size-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i}>
                                <CardHeader className="pb-3">
                                    <Skeleton className="h-4 w-24" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="mb-2 h-8 w-16" />
                                    <Skeleton className="h-3 w-32" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="tickets">Tickets</TabsTrigger>
                        <TabsTrigger value="engineers">Engineers</TabsTrigger>
                        <TabsTrigger value="performance">
                            Performance
                        </TabsTrigger>
                        <TabsTrigger value="parts">Parts</TabsTrigger>
                        <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* KPI Cards */}
                        <div className="grid gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Tickets
                                    </CardTitle>
                                    <TicketIcon className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {overviewData?.total_tickets}
                                    </div>
                                    {comparisonsData && (
                                        <TrendIndicator
                                            value={
                                                comparisonsData.changes
                                                    .total_tickets
                                            }
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Active Tickets
                                    </CardTitle>
                                    <Activity className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {overviewData?.active_tickets}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Open, In Progress, Need to Receive
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Closed Tickets
                                    </CardTitle>
                                    <CheckCircle2 className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {overviewData?.closed_tickets}
                                    </div>
                                    {comparisonsData && (
                                        <TrendIndicator
                                            value={
                                                comparisonsData.changes
                                                    .closed_tickets
                                            }
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Avg Resolution Time
                                    </CardTitle>
                                    <Timer className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {overviewData?.avg_resolution_time_hours.toFixed(
                                            1,
                                        )}
                                        h
                                    </div>
                                    {comparisonsData && (
                                        <TrendIndicator
                                            value={
                                                -comparisonsData.changes
                                                    .avg_resolution_hours
                                            }
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Status Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status Distribution</CardTitle>
                                    <CardDescription>
                                        Current ticket status breakdown
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={Object.entries(
                                                    overviewData?.status_distribution ||
                                                        {},
                                                ).map(([key, value]) => ({
                                                    name: key,
                                                    value,
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({
                                                    name,
                                                    percent,
                                                }: {
                                                    name: string;
                                                    percent: number;
                                                }) =>
                                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {Object.keys(
                                                    overviewData?.status_distribution ||
                                                        {},
                                                ).map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            STATUS_COLORS[
                                                                index %
                                                                    STATUS_COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Ticket Trends */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ticket Trends</CardTitle>
                                    <CardDescription>
                                        Created vs closed tickets over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <LineChart
                                            data={Object.keys(
                                                trendsData?.creation_trends ||
                                                    {},
                                            ).map((key) => ({
                                                period: key,
                                                created:
                                                    trendsData?.creation_trends[
                                                        key
                                                    ] || 0,
                                                closed:
                                                    trendsData?.closure_trends[
                                                        key
                                                    ] || 0,
                                            }))}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="period" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="created"
                                                stroke={COLORS.primary}
                                                strokeWidth={2}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="closed"
                                                stroke={COLORS.success}
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Technician Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Technician Performance</CardTitle>
                                <CardDescription>
                                    Top performing engineers by completion rate
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={overviewData?.technician_stats
                                            .slice(0, 10)
                                            .map((tech) => ({
                                                name: tech.name,
                                                assigned: tech.assigned_tickets,
                                                completed:
                                                    tech.completed_tickets,
                                                rate: tech.completion_rate,
                                            }))}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="assigned"
                                            fill={COLORS.primary}
                                        />
                                        <Bar
                                            dataKey="completed"
                                            fill={COLORS.success}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tickets Tab */}
                    <TabsContent value="tickets" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Response Time Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Response Time Distribution
                                    </CardTitle>
                                    <CardDescription>
                                        Time taken to respond to tickets
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <BarChart
                                            data={Object.entries(
                                                ticketsData?.response_time_distribution ||
                                                    {},
                                            ).map(([key, value]) => ({
                                                bucket: key,
                                                count: value,
                                            }))}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="bucket" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar
                                                dataKey="count"
                                                fill={COLORS.primary}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Status Funnel */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status Funnel</CardTitle>
                                    <CardDescription>
                                        Ticket progression through statuses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <BarChart
                                            data={
                                                ticketsData?.status_funnel || []
                                            }
                                            layout="horizontal"
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis
                                                dataKey="status"
                                                type="category"
                                                width={120}
                                            />
                                            <Tooltip />
                                            <Bar
                                                dataKey="count"
                                                fill={COLORS.purple}
                                            >
                                                {(
                                                    ticketsData?.status_funnel ||
                                                    []
                                                ).map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            STATUS_COLORS[
                                                                index %
                                                                    STATUS_COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Companies */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Top Companies by Ticket Volume
                                </CardTitle>
                                <CardDescription>
                                    Companies with the most tickets
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={ticketsData?.top_companies || []}
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis
                                            dataKey="company"
                                            type="category"
                                            width={150}
                                        />
                                        <Tooltip />
                                        <Bar
                                            dataKey="count"
                                            fill={COLORS.cyan}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Ticket Trends by Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ticket Trends by Status</CardTitle>
                                <CardDescription>
                                    Stacked view of ticket creation by status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart
                                        data={Object.entries(
                                            ticketsData?.ticket_trends || {},
                                        ).map(([period, statuses]) => ({
                                            period,
                                            ...statuses,
                                        }))}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {Object.keys(
                                            overviewData?.status_distribution ||
                                                {},
                                        ).map((status, index) => (
                                            <Area
                                                key={status}
                                                type="monotone"
                                                dataKey={status}
                                                stackId="1"
                                                stroke={
                                                    STATUS_COLORS[
                                                        index %
                                                            STATUS_COLORS.length
                                                    ]
                                                }
                                                fill={
                                                    STATUS_COLORS[
                                                        index %
                                                            STATUS_COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Engineers Tab */}
                    <TabsContent value="engineers" className="space-y-6">
                        {/* Engineer Workload Cards */}
                        <div className="grid gap-4 md:grid-cols-3">
                            {engineersData?.engineer_workload
                                .slice(0, 3)
                                .map((engineer) => (
                                    <Card key={engineer.id}>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                {engineer.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {engineer.email}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Total Assigned
                                                </span>
                                                <Badge variant="outline">
                                                    {engineer.total_assigned}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Open Tickets
                                                </span>
                                                <Badge variant="outline">
                                                    {engineer.open_tickets}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Completed
                                                </span>
                                                <Badge variant="outline">
                                                    {engineer.completed_tickets}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Completion Rate
                                                </span>
                                                <Badge
                                                    variant={
                                                        engineer.completion_rate >=
                                                        80
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {engineer.completion_rate}%
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Avg Completion Time
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {engineer.avg_completion_hours.toFixed(
                                                        1,
                                                    )}
                                                    h
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>

                        {/* Engineer Workload Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Engineer Workload Comparison
                                </CardTitle>
                                <CardDescription>
                                    Assigned vs completed tickets per engineer
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={
                                            engineersData?.engineer_workload ||
                                            []
                                        }
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={120}
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="total_assigned"
                                            fill={COLORS.primary}
                                            name="Assigned"
                                        />
                                        <Bar
                                            dataKey="completed_tickets"
                                            fill={COLORS.success}
                                            name="Completed"
                                        />
                                        <Bar
                                            dataKey="open_tickets"
                                            fill={COLORS.warning}
                                            name="Open"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Engineer Performance Radar */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Engineer Performance Radar
                                </CardTitle>
                                <CardDescription>
                                    Multi-dimensional performance view (top 5
                                    engineers)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart
                                        data={engineersData?.engineer_workload
                                            .slice(0, 5)
                                            .map((engineer) => ({
                                                engineer: engineer.name,
                                                volume: engineer.total_assigned,
                                                completion:
                                                    engineer.completion_rate,
                                                speed: Math.max(
                                                    0,
                                                    100 -
                                                        engineer.avg_completion_hours,
                                                ),
                                            }))}
                                    >
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="engineer" />
                                        <PolarRadiusAxis />
                                        <Radar
                                            name="Volume"
                                            dataKey="volume"
                                            stroke={COLORS.primary}
                                            fill={COLORS.primary}
                                            fillOpacity={0.6}
                                        />
                                        <Radar
                                            name="Completion %"
                                            dataKey="completion"
                                            stroke={COLORS.success}
                                            fill={COLORS.success}
                                            fillOpacity={0.6}
                                        />
                                        <Legend />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="space-y-6">
                        {/* Performance KPIs */}
                        <div className="grid gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        SLA Compliance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {performanceData?.sla_compliance_rate}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Tickets resolved within 24h
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        First Response Time
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {performanceData?.avg_first_response_time_hours.toFixed(
                                            1,
                                        )}
                                        h
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Average time to first response
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Revisit Rate
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {performanceData?.revisit_rate}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Tickets requiring multiple visits
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Activity Volume
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {Object.values(
                                            performanceData?.activity_breakdown ||
                                                {},
                                        ).reduce((a, b) => a + b, 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Total activities logged
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Activity Breakdown */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity Breakdown</CardTitle>
                                    <CardDescription>
                                        Distribution of activity types
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={Object.entries(
                                                    performanceData?.activity_breakdown ||
                                                        {},
                                                ).map(([key, value]) => ({
                                                    name: key,
                                                    value,
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({
                                                    name,
                                                    percent,
                                                }: {
                                                    name: string;
                                                    percent: number;
                                                }) =>
                                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {Object.keys(
                                                    performanceData?.activity_breakdown ||
                                                        {},
                                                ).map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            STATUS_COLORS[
                                                                index %
                                                                    STATUS_COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Activity Trends */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity Trends</CardTitle>
                                    <CardDescription>
                                        Activity volume over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <AreaChart
                                            data={Object.entries(
                                                trendsData?.activity_trends ||
                                                    {},
                                            ).map(([key, value]) => ({
                                                period: key,
                                                activities: value,
                                            }))}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="period" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area
                                                type="monotone"
                                                dataKey="activities"
                                                stroke={COLORS.purple}
                                                fill={COLORS.purple}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Parts Tab */}
                    <TabsContent value="parts" className="space-y-6">
                        {/* Top Parts */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Most Used Parts</CardTitle>
                                <CardDescription>
                                    Top 20 parts by usage count
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={partsData?.top_parts || []}
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis
                                            dataKey="part_name"
                                            type="category"
                                            width={150}
                                        />
                                        <Tooltip />
                                        <Bar
                                            dataKey="usage_count"
                                            fill={COLORS.emerald}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Parts Trend */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Parts Usage Trend</CardTitle>
                                    <CardDescription>
                                        Parts used over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <LineChart
                                            data={Object.entries(
                                                partsData?.parts_trend || {},
                                            ).map(([key, value]) => ({
                                                date: key,
                                                count: value,
                                            }))}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke={COLORS.emerald}
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Parts per Ticket Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Parts per Ticket</CardTitle>
                                    <CardDescription>
                                        Distribution of parts used per ticket
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <BarChart
                                            data={Object.entries(
                                                partsData?.parts_per_ticket_distribution ||
                                                    {},
                                            ).map(([key, value]) => ({
                                                parts: `${key} parts`,
                                                tickets: value,
                                            }))}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="parts" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar
                                                dataKey="tickets"
                                                fill={COLORS.pink}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Comparison Tab */}
                    <TabsContent value="comparison" className="space-y-6">
                        {comparisonsData && (
                            <>
                                {/* Comparison Cards */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Current Period
                                            </CardTitle>
                                            <CardDescription>
                                                {new Date(
                                                    comparisonsData.current_period.start,
                                                ).toLocaleDateString()}{' '}
                                                -{' '}
                                                {new Date(
                                                    comparisonsData.current_period.end,
                                                ).toLocaleDateString()}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Total Tickets
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {
                                                        comparisonsData
                                                            .current_period
                                                            .metrics
                                                            .total_tickets
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Closed Tickets
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {
                                                        comparisonsData
                                                            .current_period
                                                            .metrics
                                                            .closed_tickets
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Avg Resolution Time
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {comparisonsData.current_period.metrics.avg_resolution_hours.toFixed(
                                                        1,
                                                    )}
                                                    h
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Revisit Rate
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {
                                                        comparisonsData
                                                            .current_period
                                                            .metrics
                                                            .revisit_rate
                                                    }
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Previous Period
                                            </CardTitle>
                                            <CardDescription>
                                                {new Date(
                                                    comparisonsData.previous_period.start,
                                                ).toLocaleDateString()}{' '}
                                                -{' '}
                                                {new Date(
                                                    comparisonsData.previous_period.end,
                                                ).toLocaleDateString()}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Total Tickets
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {
                                                        comparisonsData
                                                            .previous_period
                                                            .metrics
                                                            .total_tickets
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Closed Tickets
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {
                                                        comparisonsData
                                                            .previous_period
                                                            .metrics
                                                            .closed_tickets
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Avg Resolution Time
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {comparisonsData.previous_period.metrics.avg_resolution_hours.toFixed(
                                                        1,
                                                    )}
                                                    h
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Revisit Rate
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {
                                                        comparisonsData
                                                            .previous_period
                                                            .metrics
                                                            .revisit_rate
                                                    }
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Changes Grid */}
                                <div className="grid gap-4 md:grid-cols-4">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">
                                                Total Tickets Change
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <TrendIndicator
                                                value={
                                                    comparisonsData.changes
                                                        .total_tickets
                                                }
                                            />
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">
                                                Closed Tickets Change
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <TrendIndicator
                                                value={
                                                    comparisonsData.changes
                                                        .closed_tickets
                                                }
                                            />
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">
                                                Resolution Time Change
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <TrendIndicator
                                                value={
                                                    -comparisonsData.changes
                                                        .avg_resolution_hours
                                                }
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Lower is better
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">
                                                Revisit Rate Change
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <TrendIndicator
                                                value={
                                                    -comparisonsData.changes
                                                        .revisit_rate
                                                }
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Lower is better
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </AppLayout>
    );
}
