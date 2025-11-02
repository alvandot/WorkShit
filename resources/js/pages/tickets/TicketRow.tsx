import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Eye, FileText, MoreVertical, Pencil, Trash } from 'lucide-react';

interface TicketRowProps {
    ticket: any;
    index: number;
    tickets: any;
    statusColors: Record<string, string>;
    onDelete: (id: number) => void;
}

export default function TicketRow({
    ticket,
    index,
    tickets,
    statusColors,
    onDelete,
}: TicketRowProps) {
    return (
        <TableRow
            className={cn(
                'cursor-pointer border-b transition-colors last:border-0 hover:bg-primary/10 focus:ring-2 focus:ring-primary/60 focus:outline-none',
                index % 2 === 0 ? 'bg-background' : 'bg-muted/30',
                ticket.status === 'Open'
                    ? 'border-l-4 border-blue-400'
                    : ticket.status === 'Need to Receive'
                      ? 'border-l-4 border-yellow-400'
                      : ticket.status === 'In Progress'
                        ? 'border-l-4 border-purple-400'
                        : ticket.status === 'Finish'
                          ? 'border-l-4 border-green-400'
                          : ticket.status === 'Closed'
                            ? 'border-l-4 border-gray-400'
                            : '',
            )}
            onClick={() => router.visit(`/tickets/${ticket.id}/timeline`)}
            tabIndex={0}
            aria-label={`View timeline for ticket ${ticket.ticket_number}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    router.visit(`/tickets/${ticket.id}/timeline`);
                }
            }}
        >
            <TableCell className="font-medium text-muted-foreground">
                {(tickets.current_page - 1) * tickets.per_page + index + 1}
            </TableCell>
            <TableCell className="font-semibold text-primary">
                {ticket.ticket_number}
            </TableCell>
            <TableCell className="font-medium">
                {ticket.case_id ? (
                    <span
                        className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                        title={ticket.case_id}
                    >
                        {ticket.case_id.length > 12
                            ? ticket.case_id.slice(0, 12) + '…'
                            : ticket.case_id}
                    </span>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </TableCell>
            <TableCell className="font-medium" title={ticket.company}>
                {ticket.company.length > 18
                    ? ticket.company.slice(0, 18) + '…'
                    : ticket.company}
            </TableCell>
            <TableCell className="max-w-sm">
                <div className="truncate text-sm" title={ticket.problem}>
                    {ticket.problem.length > 32
                        ? ticket.problem.slice(0, 32) + '…'
                        : ticket.problem}
                </div>
            </TableCell>
            <TableCell>
                {ticket.schedule ? (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                            {format(new Date(ticket.schedule), 'dd MMM yyyy')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {format(new Date(ticket.schedule), 'HH:mm')}
                        </span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </TableCell>
            <TableCell>
                <Badge
                    className={cn(
                        statusColors[ticket.status],
                        'px-3 py-1 font-semibold shadow-sm',
                    )}
                    variant="outline"
                    aria-label={`Status: ${ticket.status}`}
                >
                    {ticket.status}
                </Badge>
            </TableCell>
            <TableCell
                className="sticky right-0 z-10 border-l border-muted bg-card/95 backdrop-blur"
                style={{ boxShadow: '0 0 8px 0 rgba(0,0,0,0.03)' }}
            >
                <div
                    className="flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="transition-colors hover:bg-primary/10 hover:text-primary"
                                aria-label="More actions"
                                title="More actions"
                            >
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/tickets/${ticket.id}/detail`}
                                    className="cursor-pointer"
                                    aria-label="View detailed information"
                                    title="View detailed information"
                                >
                                    <FileText className="mr-2 size-4" />
                                    Detail Lengkap
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/tickets/${ticket.id}`}
                                    className="cursor-pointer"
                                    aria-label="View ticket"
                                    title="View ticket"
                                >
                                    <Eye className="mr-2 size-4" />
                                    View Ticket
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/tickets/${ticket.id}/edit`}
                                    className="cursor-pointer"
                                    aria-label="Edit ticket"
                                    title="Edit ticket"
                                >
                                    <Pencil className="mr-2 size-4" />
                                    Edit Ticket
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(ticket.id)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                                aria-label="Delete ticket"
                                title="Delete ticket"
                            >
                                <Trash className="mr-2 size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
}
