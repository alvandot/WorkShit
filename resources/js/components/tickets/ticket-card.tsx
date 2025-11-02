import { StatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Edit,
    Eye,
    Flag,
    MoreVertical,
    Trash2,
} from 'lucide-react';

interface TicketCardProps {
    ticket: {
        id: number;
        ticket_number: string;
        company: string;
        status: string;
        problem: string;
        schedule?: string | null;
        deadline?: string | null;
        assigned_to_user?: {
            name: string;
        };
        created_at: string;
    };
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    onDelete?: (id: number) => void;
    className?: string;
}

const priorityConfig = {
    low: {
        color: 'text-blue-500',
        label: 'Low Priority',
    },
    medium: {
        color: 'text-amber-500',
        label: 'Medium Priority',
    },
    high: {
        color: 'text-orange-500',
        label: 'High Priority',
    },
    urgent: {
        color: 'text-rose-500',
        label: 'Urgent',
    },
};

export function TicketCard({
    ticket,
    priority = 'medium',
    onDelete,
    className,
}: TicketCardProps) {
    const priorityInfo = priorityConfig[priority];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isOverdue = ticket.deadline && new Date(ticket.deadline) < new Date();

    return (
        <Card
            className={cn(
                'group relative overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
                isOverdue && 'border-rose-500/30 bg-rose-500/5',
                className,
            )}
        >
            {/* Priority indicator bar */}
            <div
                className={cn(
                    'absolute top-0 left-0 h-full w-1 transition-all duration-300 group-hover:w-1.5',
                    priority === 'low' && 'bg-blue-500',
                    priority === 'medium' && 'bg-amber-500',
                    priority === 'high' && 'bg-orange-500',
                    priority === 'urgent' &&
                        'animate-pulse bg-rose-500 shadow-lg shadow-rose-500/50',
                )}
            />

            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/tickets/${ticket.id}`}
                            className="font-mono text-lg font-bold hover:text-primary hover:underline"
                        >
                            {ticket.ticket_number}
                        </Link>
                        <StatusBadge status={ticket.status} size="sm" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="size-4" />
                        <span className="font-medium">{ticket.company}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Priority Flag */}
                    <Flag
                        className={cn('size-5', priorityInfo.color)}
                        fill="currentColor"
                    />

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/tickets/${ticket.id}`}
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    <Eye className="size-4" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/tickets/${ticket.id}/edit`}
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    <Edit className="size-4" />
                                    Edit Ticket
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {onDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete(ticket.id)}
                                    className="flex cursor-pointer items-center gap-2 text-rose-600 focus:text-rose-600"
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Problem Description */}
                <p className="line-clamp-2 text-sm text-foreground">
                    {ticket.problem}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {ticket.assigned_to_user && (
                        <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
                            <Avatar className="size-5">
                                <AvatarFallback className="text-[10px] font-semibold">
                                    {getInitials(ticket.assigned_to_user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                                {ticket.assigned_to_user.name}
                            </span>
                        </div>
                    )}

                    {ticket.schedule && (
                        <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-blue-600">
                            <Calendar className="size-3.5" />
                            <span>
                                {format(
                                    new Date(ticket.schedule),
                                    'MMM d, yyyy',
                                )}
                            </span>
                        </div>
                    )}

                    {ticket.deadline && (
                        <div
                            className={cn(
                                'flex items-center gap-1.5 rounded-full px-2.5 py-1',
                                isOverdue
                                    ? 'bg-rose-500/10 text-rose-600'
                                    : 'bg-amber-500/10 text-amber-600',
                            )}
                        >
                            <Clock className="size-3.5" />
                            <span>
                                Due {format(new Date(ticket.deadline), 'MMM d')}
                            </span>
                        </div>
                    )}

                    <div className="ml-auto flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span>
                            {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                        </span>
                    </div>
                </div>

                {/* Footer Actions - shown on hover */}
                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1"
                    >
                        <Link href={`/tickets/${ticket.id}`}>
                            <Eye className="mr-1.5 size-3.5" />
                            View
                        </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                        <Link href={`/tickets/${ticket.id}/timeline`}>
                            <CheckCircle2 className="mr-1.5 size-3.5" />
                            Timeline
                        </Link>
                    </Button>
                </div>
            </CardContent>

            {/* Overdue indicator */}
            {isOverdue && (
                <div className="absolute top-4 right-4">
                    <Badge
                        variant="destructive"
                        className="animate-pulse shadow-lg"
                    >
                        Overdue
                    </Badge>
                </div>
            )}
        </Card>
    );
}

// Grid layout for ticket cards
interface TicketGridProps {
    tickets: TicketCardProps['ticket'][];
    onDelete?: (id: number) => void;
    className?: string;
}

export function TicketGrid({ tickets, onDelete, className }: TicketGridProps) {
    return (
        <div
            className={cn(
                'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
                className,
            )}
        >
            {tickets.map((ticket) => (
                <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
