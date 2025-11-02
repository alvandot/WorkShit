import { useCallback, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { type BreadcrumbItem } from '@/types';
import specialPlacesRoutes from '@/routes/special-places';
import engineersRoutes from '@/routes/engineers';
import { dashboard } from '@/routes';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Filter, MapPin, Plus, Search, Users } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProvinceOption {
    id: number;
    name: string;
    code: string;
}

interface SpecialPlace {
    id: number;
    name: string;
    city: string | null;
    address: string | null;
    contact_person: string | null;
    contact_phone: string | null;
    is_active: boolean;
    province?: {
        id: number;
        name: string;
        code: string;
    } | null;
    engineer?: {
        id: number;
        name: string;
    } | null;
}

interface PaginatedSpecialPlaces {
    data: SpecialPlace[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    specialPlaces: PaginatedSpecialPlaces;
    filters: {
        search?: string;
        status?: string;
        province?: string;
    };
    provinces: ProvinceOption[];
    stats: {
        total: number;
        active: number;
        unassigned: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Special Places', href: specialPlacesRoutes.index.url() },
];

const statusStyle: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
    inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200',
};

export default function SpecialPlacesIndex({ specialPlaces, filters, provinces, stats }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [province, setProvince] = useState(filters.province ?? 'all');

    const handleFilter = useCallback(
        (nextSearch: string, nextStatus: string, nextProvince: string) => {
            router.get(
                specialPlacesRoutes.index.url(),
                {
                    search: nextSearch || undefined,
                    status: nextStatus !== 'all' ? nextStatus : undefined,
                    province: nextProvince !== 'all' ? nextProvince : undefined,
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
            handleFilter(value, status, province);
        },
        [handleFilter, province, status],
    );

    const onStatusChange = useCallback(
        (value: string) => {
            setStatus(value);
            handleFilter(search, value, province);
        },
        [handleFilter, province, search],
    );

    const onProvinceChange = useCallback(
        (value: string) => {
            setProvince(value);
            handleFilter(search, status, value);
        },
        [handleFilter, search, status],
    );

    const summaryCards = useMemo(
        () => [
            {
                title: 'Total Locations',
                value: stats.total,
                description: 'Registered Special Places across regions.',
                icon: Building2,
            },
            {
                title: 'Active Coverage',
                value: stats.active,
                description: 'Locations receiving active engineer support.',
                icon: Users,
            },
            {
                title: 'Awaiting Engineer',
                value: stats.unassigned,
                description: 'Special Places with no engineer assigned.',
                icon: MapPin,
            },
        ],
        [stats],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Special Places" />

            <div className="space-y-6 pb-10">
                <section className="flex flex-col gap-4 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 starting:translate-y-3 starting:opacity-0 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <Badge variant="outline" className="rounded-full border-white/30 bg-white/20 text-xs font-semibold uppercase tracking-[0.35em] text-white dark:text-foreground">
                            Special Place Hub
                        </Badge>
                        <h1 className="text-3xl font-bold sm:text-4xl">Manage Strategic Customer Sites</h1>
                        <p className="text-sm text-muted-foreground">
                            Coordinate coverage, track onsite contacts, and ensure each Special Place has an assigned engineer.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={engineersRoutes.index.url()}>
                            <Button variant="outline" className="rounded-full">
                                Visit engineers
                            </Button>
                        </Link>
                        <Link href={specialPlacesRoutes.create.url()}>
                            <Button className="gap-2 rounded-full">
                                <Plus className="size-4" />
                                Add Special Place
                            </Button>
                        </Link>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {summaryCards.map((card) => (
                        <Card key={card.title} className="border border-border/60">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
                                <card.icon className="size-4 text-muted-foreground" />
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
                        <CardDescription>Refine Special Places by status, province, or contact details.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-[2fr,1fr,1fr]">
                        <div className="space-y-2">
                            <Label htmlFor="special-place-search" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                                <Search className="size-3" />
                                Search
                            </Label>
                            <Input
                                id="special-place-search"
                                value={search}
                                onChange={(event) => onSearchChange(event.target.value)}
                                placeholder="Search by name, city, or contact"
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
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                                <MapPin className="size-3" />
                                Province
                            </Label>
                            <Select value={province} onValueChange={onProvinceChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by province" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All provinces</SelectItem>
                                    {provinces.map((provinceOption) => (
                                        <SelectItem key={provinceOption.id} value={String(provinceOption.id)}>
                                            {provinceOption.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-border/60">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Special Place Directory</CardTitle>
                            <CardDescription>Visibility into coverage, contacts, and onsite assignments.</CardDescription>
                        </div>
                        <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-xs text-primary">
                            {stats.total} locations
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Province</TableHead>
                                    <TableHead>Engineer</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {specialPlaces.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                            No Special Places found. Try adjusting your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {specialPlaces.data.map((place) => (
                                    <TableRow key={place.id} className="hover:bg-primary/5">
                                        <TableCell className="min-w-[200px]">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{place.name}</span>
                                                <span className="text-xs text-muted-foreground">{place.city ?? 'City not set'}</span>
                                                {place.address && (
                                                    <span className="text-xs text-muted-foreground">{place.address}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {place.province?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {place.engineer ? (
                                                <Link href={engineersRoutes.edit.url({ engineer: place.engineer.id })} className="text-primary hover:underline">
                                                    {place.engineer.name}
                                                </Link>
                                            ) : (
                                                <span className="italic text-muted-foreground">Unassigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            <div className="flex flex-col">
                                                <span>{place.contact_person ?? '—'}</span>
                                                <span>{place.contact_phone ?? ''}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold', statusStyle[place.is_active ? 'active' : 'inactive'])}>
                                                {place.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-sm font-medium">
                                            <Link href={specialPlacesRoutes.edit.url({ special_place: place.id })} className="text-primary hover:underline">
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
                        <span className="mx-1 font-semibold text-foreground">{specialPlaces.data.length}</span>
                        of
                        <span className="mx-1 font-semibold text-foreground">{specialPlaces.total}</span>
                        locations.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {specialPlaces.links.map((link, index) => (
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
