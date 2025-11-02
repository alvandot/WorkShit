import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Filter, Layers, LineChart, ListChecks, Radar, RefreshCcw } from 'lucide-react';
import { memo, useMemo } from 'react';

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
}

interface FiltersSectionProps {
    tickets: Ticket[];
    status: string;
    onStatusFilter: (value: string) => void;
}

export const FiltersSection = memo(({ tickets, status, onStatusFilter }: FiltersSectionProps) => {
    const upcomingTicket = useMemo(() => {
        const scheduledTickets = tickets
            .filter((ticket) => ticket.schedule)
            .map((ticket) => ({
                ...ticket,
                scheduleDate: new Date(ticket.schedule as string),
            }))
            .sort((a, b) => a.scheduleDate.getTime() - b.scheduleDate.getTime());

        return scheduledTickets[0];
    }, [tickets]);

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

    return (
        <div className="rounded-lg border bg-card p-4">
            <div className="mb-3">
                <h3 className="text-sm font-medium text-foreground">Filter by Status</h3>
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
                            className="gap-2"
                            onClick={() => onStatusFilter(filterOption.value)}
                        >
                            <Icon className="size-4" />
                            {filterOption.label}
                        </Button>
                    );
                })}
            </div>
            {upcomingTicket && (
                <div className="mt-3 flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 p-2.5 text-sm">
                    <LineChart className="size-4 text-primary" />
                    <span className="text-muted-foreground">Next:</span>
                    <span className="font-medium">
                        {format(upcomingTicket.scheduleDate, 'MMM dd, HH:mm')}
                    </span>
                    <span className="text-muted-foreground">• {upcomingTicket.company}</span>
                </div>
            )}
        </div>
    );
});
