import { Layers, LineChart, ListChecks, RefreshCcw } from 'lucide-react';
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

interface MetricsCardsProps {
    tickets: Ticket[];
}

export const MetricsCards = memo(({ tickets }: MetricsCardsProps) => {
    const now = useMemo(() => new Date(), []);

    const metrics = useMemo(() => {
        const activeStatuses = [
            'Open',
            'Need to Receive',
            'In Progress',
            'Finish',
        ];

        const base = {
            total: tickets.length,
            active: 0,
            scheduledToday: 0,
            dueSoon: 0,
        };

        tickets.forEach((ticket) => {
            if (activeStatuses.includes(ticket.status)) {
                base.active += 1;
            }

            if (ticket.schedule) {
                const scheduleDate = new Date(ticket.schedule);
                if (scheduleDate.toDateString() === now.toDateString()) {
                    base.scheduledToday += 1;
                }

                if (
                    scheduleDate >= now &&
                    scheduleDate <=
                        new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2)
                ) {
                    base.dueSoon += 1;
                }
            } else if (ticket.deadline) {
                const deadlineDate = new Date(ticket.deadline);
                if (
                    deadlineDate >= now &&
                    deadlineDate <=
                        new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2)
                ) {
                    base.dueSoon += 1;
                }
            }
        });

        return base;
    }, [now, tickets]);

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">
                        Total
                    </div>
                    <Layers className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-2 text-2xl font-bold">{metrics.total}</div>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">
                        Active
                    </div>
                    <RefreshCcw className="size-4 text-blue-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {metrics.active}
                </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">
                        Today
                    </div>
                    <LineChart className="size-4 text-emerald-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {metrics.scheduledToday}
                </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">
                        Due Soon
                    </div>
                    <ListChecks className="size-4 text-amber-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {metrics.dueSoon}
                </div>
            </div>
        </div>
    );
});
