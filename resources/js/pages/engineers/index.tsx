import { useCallback, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import engineersRoutes from '@/routes/engineers';
import { dashboard } from '@/routes';
import { Head, Link, router } from '@inertiajs/react';
import { Filter, Plus, Search, Users } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Engineer {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    specialization: string | null;
    employee_code: string | null;
    is_active: boolean;
    primary_province?: {
        id: number;
        name: string;
        code: string;
    } | null;
    special_places_count: number;
    created_at: string;
}

interface PaginatedEngineers {
    data: Engineer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    engineers: PaginatedEngineers;
    filters: {
        search?: string;
        status?: string;
    };
    stats: {
        total: number;
        active: number;
        with_special_places: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Engineers',
        href: engineersRoutes.index.url(),
    },
];

const statusStyle: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
    inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200',
};

export default function EngineersIndex({ engineers, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');

    const handleFilter = useCallback(
        (nextSearch: string, nextStatus: string) => {
            router.get(
                engineersRoutes.index.url(),
                {
                    search: nextSearch || undefined,
                    status: nextStatus !== 'all' ? nextStatus : undefined,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                },
            );
        },
        [],
    );

    const onSearchChange = useCallback(
        (value: string) => {
            setSearch(value);
            handleFilter(value, status);
        },
        [handleFilter, status],
    );

    const onStatusChange = useCallback(
        (value: string) => {
            setStatus(value);
            handleFilter(search, value);
        },
        [handleFilter, search],
    );

    const summaryCards = useMemo(
        () => [
            {
                title: 'Total Engineers',
                value: stats.total,
                description: 'Registered contacts in the network',
            },
            {
                title: 'Active Now',
                value: stats.active,
                description: 'Available and ready for dispatch',
            },
            {
                title: 'Assigned to Special Places',
                value: stats.with_special_places,
                description: 'Handling dedicated locations',
            },
        ],
        [stats],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Engineers" />

            <div className="space-y-6 pb-10">
                <section className="flex flex-col gap-4 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 starting:translate-y-3 starting:opacity-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Badge variant="outline" className="rounded-full border-white/30 bg-white/20 text-xs font-semibold uppercase tracking-[0.35em] text-white dark:text-foreground">
                            Engineer SP Hub
                        </Badge>
                        <h1 className="text-3xl font-bold sm:text-4xl">Engineer Special Place Directory</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage engineer coverage, availability, and their assignments across special places.
                        </p>
                    </div>
                    <Link href={engineersRoutes.create.url()}>
                        <Button className="gap-2 rounded-full">
                            <Plus className="size-4" />
                            Add Engineer
                        </Button>
                    </Link>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {summaryCards.map((card) => (
                        <Card key={card.title} className="border border-border/60">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">
                                    {card.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-semibold">{card.value}</div>
                                <p className="text-xs text-muted-foreground">{card.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <Card className="border border-border/60">
                    <CardHeader className="space-y-1">
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Quickly narrow down the engineer roster.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-[2fr,1fr]">
                        <div className="space-y-2">
                            <Label htmlFor="engineer-search" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                                <Search className="size-3" />
                                Search
                            </Label>
                            <Input
                                id="engineer-search"
                                value={search}
                                onChange={(event) => onSearchChange(event.target.value)}
                                placeholder="Search by name, email, or employee code"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                                <Filter className="size-3" />
                                Status
                            </Label>
                            <Select value={status} onValueChange={onStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-border/60">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Engineer Roster</CardTitle>
                            <CardDescription>Comprehensive list of engineers and their special place assignments.</CardDescription>
                        </div>
                        <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-xs text-primary">
                            <Users className="mr-1 size-3" />
                            {stats.total} total
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Specialization</TableHead>
                                    <TableHead>Province</TableHead>
                                    <TableHead>Special Places</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {engineers.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                            No engineers found with the current filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {engineers.data.map((engineer) => (
                                    <TableRow key={engineer.id} className="hover:bg-primary/5">
                                        <TableCell className="min-w-[180px]">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{engineer.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {engineer.email ?? 'No email'} · {engineer.phone ?? 'No phone'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {engineer.specialization ?? 'Generalist'}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {engineer.primary_province?.name ?? '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-xs text-primary">
                                                {engineer.special_places_count}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={cn(
                                                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
                                                    statusStyle[engineer.is_active ? 'active' : 'inactive'],
                                                )}
                                            >
                                                {engineer.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={engineersRoutes.edit.url({ engineer: engineer.id })} className="text-sm font-medium text-primary hover:underline">
                                                Edit
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                    <p>
                        Showing
                        <span className="mx-1 font-semibold text-foreground">{engineers.data.length}</span>
                        of
                        <span className="mx-1 font-semibold text-foreground">{engineers.total}</span>
                        engineers.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {engineers.links.map((link, index) => (
                            <Button
                                key={`${link.label}-${index}`}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                            >
                                {link.label.replace('&laquo; Previous', 'Prev').replace('Next &raquo;', 'Next')}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
