import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar';
import { LazyWrapper } from '@/components/error-boundary';
import { AdvancedFilters } from '@/components/tickets/advanced-filters';
import { KanbanBoard } from '@/components/tickets/kanban-board';
import {
    generateTicketStats,
    QuickStats,
} from '@/components/tickets/quick-stats';
import { TicketGrid } from '@/components/tickets/ticket-card';
import {
    type ViewMode,
    ViewSwitcher,
} from '@/components/tickets/view-switcher';
import { Button } from '@/components/ui/button';
import { useBulkSelection } from '@/hooks/use-bulk-selection';
import { useSortableTable } from '@/hooks/use-sortable-table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Plus } from 'lucide-react';
import { lazy, useState } from 'react';
import { toast } from 'sonner';

// Lazy load components
const FiltersSection = lazy(() =>
    import('@/components/tickets/filters-section').then((module) => ({
        default: module.FiltersSection,
    })),
);
const SearchSidebar = lazy(() =>
    import('@/components/tickets/search-sidebar').then((module) => ({
        default: module.SearchSidebar,
    })),
);
const TicketsTable = lazy(() =>
    import('@/components/tickets/tickets-table').then((module) => ({
        default: module.TicketsTable,
    })),
);
const TicketsPagination = lazy(() =>
    import('@/components/tickets/tickets-pagination').then((module) => ({
        default: module.TicketsPagination,
    })),
);

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
    const [viewMode, setViewMode] = useState<ViewMode>('table');

    // Add sorting functionality
    const { sortedData, requestSort, getSortDirection } = useSortableTable(
        tickets.data,
        { key: 'created_at', direction: 'desc' }, // Default sort by newest first
    );

    // Add bulk selection functionality
    const {
        selectedItems,
        isSelected,
        toggleItem,
        toggleAll,
        clearSelection,
        selectedCount,
        isAllSelected,
        isSomeSelected,
    } = useBulkSelection(sortedData);

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

    // Bulk action handlers
    const handleBulkDelete = () => {
        const count = selectedCount;
        if (
            confirm(
                `Are you sure you want to delete ${count} ticket${count > 1 ? 's' : ''}?`,
            )
        ) {
            router.delete('/tickets/bulk', {
                data: { ids: Array.from(selectedItems) },
                onSuccess: () => {
                    clearSelection();
                    toast.success(
                        `${count} ticket${count > 1 ? 's' : ''} deleted successfully!`,
                    );
                },
                onError: () => {
                    toast.error('Failed to delete tickets.');
                },
            });
        }
    };

    const handleBulkExport = () => {
        const ids = Array.from(selectedItems).join(',');
        window.location.href = `/tickets/export?ids=${ids}`;
        toast.success(
            `Exporting ${selectedCount} ticket${selectedCount > 1 ? 's' : ''}...`,
        );
    };

    return (
        <AppLayout>
            <Head title="Manage Tickets" />

            <div className="space-y-6">
                {/* Header with View Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                            Manage Tickets
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            View and manage all support tickets
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <ViewSwitcher
                            currentView={viewMode}
                            onViewChange={setViewMode}
                        />
                        <a href="/tickets/export">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
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

                {/* Quick Stats */}
                <QuickStats
                    stats={generateTicketStats(
                        sortedData as unknown as Parameters<
                            typeof generateTicketStats
                        >[0],
                    )}
                />

                {/* Filters Layout - Advanced Filters + Search */}
                <div className="grid gap-4 lg:grid-cols-[300px,1fr]">
                    {/* Advanced Filters Sidebar */}
                    <div className="space-y-4">
                        <AdvancedFilters
                            engineers={[]}
                            onFilterChange={(filters) => {
                                console.log('Filters changed:', filters);
                                // TODO: Implement filter logic
                            }}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="space-y-4">
                        {/* Old Filters and Search - Keep for now */}
                        <div className="grid gap-4 lg:grid-cols-[1fr,auto]">
                            <LazyWrapper>
                                <FiltersSection
                                    tickets={sortedData}
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

                        {/* Table, Grid, or Kanban View */}
                        {viewMode === 'table' && (
                            <LazyWrapper>
                                <TicketsTable
                                    tickets={sortedData}
                                    current_page={tickets.current_page}
                                    per_page={tickets.per_page}
                                    loading={false}
                                    onDelete={handleDelete}
                                    requestSort={requestSort}
                                    getSortDirection={getSortDirection}
                                    selectedItems={selectedItems}
                                    isSelected={isSelected}
                                    toggleItem={toggleItem}
                                    toggleAll={toggleAll}
                                    isAllSelected={isAllSelected}
                                    isSomeSelected={isSomeSelected}
                                />
                            </LazyWrapper>
                        )}

                        {viewMode === 'grid' && (
                            <TicketGrid
                                tickets={sortedData}
                                onDelete={handleDelete}
                            />
                        )}

                        {viewMode === 'kanban' && (
                            <KanbanBoard
                                tickets={sortedData}
                                onStatusChange={(ticketId, newStatus) => {
                                    router.put(
                                        `/tickets/${ticketId}`,
                                        { status: newStatus },
                                        {
                                            onSuccess: () => {
                                                toast.success(
                                                    'Ticket status updated!',
                                                );
                                            },
                                            onError: () => {
                                                toast.error(
                                                    'Failed to update status.',
                                                );
                                            },
                                        },
                                    );
                                }}
                            />
                        )}

                        {/* Pagination - Show for table and grid views */}
                        {(viewMode === 'table' || viewMode === 'grid') && (
                            <LazyWrapper>
                                <TicketsPagination
                                    current_page={tickets.current_page}
                                    last_page={tickets.last_page}
                                    per_page={tickets.per_page}
                                    total={tickets.total}
                                    links={tickets.links}
                                />
                            </LazyWrapper>
                        )}
                    </div>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            <BulkActionsToolbar
                selectedCount={selectedCount}
                onClear={clearSelection}
                onExport={handleBulkExport}
                onDelete={handleBulkDelete}
            />
        </AppLayout>
    );
}
