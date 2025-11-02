import { Button } from '@/components/ui/button';
import { LazyWrapper } from '@/components/error-boundary';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Plus } from 'lucide-react';
import { lazy, useState } from 'react';
import { toast } from 'sonner';

// Lazy load components
const MetricsCards = lazy(() => import('@/components/tickets/metrics-cards').then(module => ({ default: module.MetricsCards })));
const FiltersSection = lazy(() => import('@/components/tickets/filters-section').then(module => ({ default: module.FiltersSection })));
const SearchSidebar = lazy(() => import('@/components/tickets/search-sidebar').then(module => ({ default: module.SearchSidebar })));
const TicketsTable = lazy(() => import('@/components/tickets/tickets-table').then(module => ({ default: module.TicketsTable })));
const TicketsPagination = lazy(() => import('@/components/tickets/tickets-pagination').then(module => ({ default: module.TicketsPagination })));

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

export default function TicketsIndex({ tickets, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

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
            router.delete(`/tickets/${id}`, {
                onSuccess: () => {
                    toast.success('Ticket deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete ticket.');
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Manage Tickets" />

            <div className="space-y-6">
                {/* Simple Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                            Manage Tickets
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            View and manage all support tickets
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <a href="/tickets/export">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="size-4" />
                                Export
                            </Button>
                        </a>
                        <Link href="/tickets/create">
                            <Button size="sm" className="gap-2">
                                <Plus className="size-4" />
                                New Ticket
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Metrics Cards */}
                <LazyWrapper>
                    <MetricsCards tickets={tickets.data} />
                </LazyWrapper>

                {/* Filters and Search */}
                <div className="grid gap-4 lg:grid-cols-[1fr,auto]">
                    <LazyWrapper>
                        <FiltersSection
                            tickets={tickets.data}
                            status={status}
                            onStatusFilter={handleStatusFilter}
                        />
                    </LazyWrapper>
                    <LazyWrapper>
                        <SearchSidebar
                            search={search}
                            onSearch={handleSearch}
                        />
                    </LazyWrapper>
                </div>

                {/* Table Section */}
                <LazyWrapper>
                    <TicketsTable
                        tickets={tickets.data}
                        current_page={tickets.current_page}
                        per_page={tickets.per_page}
                        loading={false}
                        onDelete={handleDelete}
                    />
                </LazyWrapper>

                {/* Pagination Section */}
                <LazyWrapper>
                    <TicketsPagination
                        current_page={tickets.current_page}
                        last_page={tickets.last_page}
                        per_page={tickets.per_page}
                        total={tickets.total}
                        links={tickets.links}
                    />
                </LazyWrapper>
            </div>
        </AppLayout>
    );
}
