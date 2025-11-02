import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { presets } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Calendar, Clock, MoreVertical, User } from 'lucide-react';
import { useState } from 'react';

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

interface KanbanBoardProps {
    tickets: Ticket[];
    onStatusChange?: (ticketId: number, newStatus: string) => void;
}

const columns = [
    { id: 'Open', title: 'Open', color: 'border-blue-500' },
    {
        id: 'Need to Receive',
        title: 'Need to Receive',
        color: 'border-amber-500',
    },
    { id: 'In Progress', title: 'In Progress', color: 'border-purple-500' },
    { id: 'Finish', title: 'Finished', color: 'border-emerald-500' },
    { id: 'Closed', title: 'Closed', color: 'border-slate-500' },
];

export function KanbanBoard({ tickets, onStatusChange }: KanbanBoardProps) {
    const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null);

    const getTicketsByStatus = (status: string) => {
        return tickets.filter((ticket) => ticket.status === status);
    };

    const handleDragStart = (ticket: Ticket) => {
        setDraggedTicket(ticket);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (status: string) => {
        if (draggedTicket && draggedTicket.status !== status) {
            onStatusChange?.(draggedTicket.id, status);
            setDraggedTicket(null);
        }
    };

    return (
        <div className="scrollable-x flex gap-4 pb-4">
            {columns.map((column) => {
                const columnTickets = getTicketsByStatus(column.id);
                return (
                    <div
                        key={column.id}
                        className="min-w-[320px] flex-1"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(column.id)}
                    >
                        {/* Column Header */}
                        <div
                            className={cn(
                                'mb-3 rounded-lg border-l-4 bg-muted/50 p-3',
                                column.color,
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">
                                        {column.title}
                                    </h3>
                                    <Badge variant="secondary">
                                        {columnTickets.length}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Column Cards */}
                        <div className="space-y-3">
                            {columnTickets.length === 0 ? (
                                <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-8 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No tickets in this column
                                    </p>
                                </div>
                            ) : (
                                columnTickets.map((ticket) => (
                                    <Card
                                        key={ticket.id}
                                        draggable
                                        onDragStart={() =>
                                            handleDragStart(ticket)
                                        }
                                        className={cn(
                                            'cursor-move transition-all hover:shadow-lg',
                                            presets.card,
                                            draggedTicket?.id === ticket.id &&
                                                'opacity-50',
                                        )}
                                    >
                                        <CardHeader className="p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-sm font-semibold text-primary">
                                                            {
                                                                ticket.ticket_number
                                                            }
                                                        </span>
                                                        {ticket.case_id && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {ticket.case_id}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h4 className="line-clamp-1 text-sm font-medium">
                                                        {ticket.company}
                                                    </h4>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.visit(
                                                            `/tickets/${ticket.id}`,
                                                        );
                                                    }}
                                                >
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                                                {ticket.problem}
                                            </p>

                                            {/* Meta Information */}
                                            <div className="space-y-2">
                                                {ticket.schedule && (
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="size-3" />
                                                        <span>
                                                            {new Date(
                                                                ticket.schedule,
                                                            ).toLocaleDateString(
                                                                'id-ID',
                                                                {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                {ticket.deadline && (
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Clock className="size-3" />
                                                        <span>
                                                            Deadline:{' '}
                                                            {new Date(
                                                                ticket.deadline,
                                                            ).toLocaleDateString(
                                                                'id-ID',
                                                                {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                {ticket.assigned_to_user && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <User className="size-3 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {
                                                                ticket
                                                                    .assigned_to_user
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
