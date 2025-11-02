import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { Download, Eye, FileText, ListChecks, MoreVertical, Pencil, Trash } from 'lucide-react';
import { memo } from 'react';

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

interface TicketsTableProps {
    tickets: Ticket[];
    current_page: number;
    per_page: number;
    loading: boolean;
    onDelete: (id: number) => void;
}

const statusColors: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Need to Receive':
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'In Progress':
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Finish:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export const TicketsTable = memo(({ tickets, current_page, per_page, loading, onDelete }: TicketsTableProps) => {
    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            {/* Mobile Card View */}
            <div className="block md:hidden">
                <div className="divide-y divide-border">
                    {tickets.length === 0 ? (
                        loading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                                        <div className="h-6 bg-muted rounded w-16 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-muted rounded w-full animate-pulse" />
                                        <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="h-3 bg-muted rounded w-16 animate-pulse" />
                                        <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="rounded-full bg-muted p-6">
                                        <ListChecks className="size-12 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            No tickets found
                                        </h3>
                                        <p className="text-sm text-muted-foreground max-w-sm">
                                            There are no tickets matching your current filters. Try adjusting your search criteria or create a new ticket.
                                        </p>
                                    </div>
                                    <Button asChild className="mt-2">
                                        <a href="/tickets/create">
                                            <svg className="mr-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create New Ticket
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )
                    ) : (
                        tickets.map((ticket, index) => (
                            <div
                                key={ticket.id}
                                className="p-4 cursor-pointer hover:bg-primary/5 active:bg-primary/10 transition-colors"
                                onClick={() =>
                                    router.visit(`/tickets/${ticket.id}/timeline`)
                                }
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            #{(current_page - 1) * per_page + index + 1}
                                        </span>
                                        <span className="font-semibold text-primary">
                                            {ticket.ticket_number}
                                        </span>
                                        {ticket.case_id && (
                                            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                                {ticket.case_id}
                                            </span>
                                        )}
                                    </div>
                                    <Badge
                                        className={`${statusColors[ticket.status]} px-2 py-1 font-semibold shadow-sm text-xs`}
                                        variant="outline"
                                    >
                                        {ticket.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <div className="font-medium text-foreground">
                                        {ticket.company}
                                    </div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                        {ticket.problem}
                                    </div>
                                </div>

                                {ticket.schedule && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                        <span>📅</span>
                                        <span>
                                            {new Date(ticket.schedule).toLocaleDateString()} at{' '}
                                            {new Date(ticket.schedule).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem asChild>
                                                <a href={`/tickets/${ticket.id}/detail`} className="cursor-pointer">
                                                    <FileText className="mr-2 size-4" />
                                                    Detail Lengkap
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a href={`/tickets/${ticket.id}/bap/download`} className="cursor-pointer" target="_blank" rel="noopener noreferrer">
                                                    <Download className="mr-2 size-4" />
                                                    Download BAP
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a href={`/tickets/${ticket.id}`} className="cursor-pointer">
                                                    <Eye className="mr-2 size-4" />
                                                    View Ticket
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a href={`/tickets/${ticket.id}/edit`} className="cursor-pointer">
                                                    <Pencil className="mr-2 size-4" />
                                                    Edit Ticket
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDelete(ticket.id)}
                                                className="cursor-pointer text-destructive focus:text-destructive"
                                            >
                                                <Trash className="mr-2 size-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-[720px]">
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="w-16 font-medium">No</TableHead>
                                <TableHead className="font-medium">Ticket</TableHead>
                                <TableHead className="font-medium">Case ID</TableHead>
                                <TableHead className="font-medium">Company</TableHead>
                                <TableHead className="font-medium">Problem</TableHead>
                                <TableHead className="font-medium">Schedule</TableHead>
                                <TableHead className="font-medium">Status</TableHead>
                                <TableHead className="w-16 text-center font-medium">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.length === 0 ? (
                                loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-12 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="rounded-full bg-muted p-6">
                                                    <ListChecks className="size-12 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold text-foreground">
                                                        No tickets found
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground max-w-sm">
                                                        There are no tickets matching your current filters. Try adjusting your search criteria or create a new ticket.
                                                    </p>
                                                </div>
                                                <Button asChild className="mt-2">
                                                    <a href="/tickets/create">
                                                        <svg className="mr-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        Create New Ticket
                                                    </a>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            ) : (
                                tickets.map((ticket, index) => (
                                    <TableRow
                                        key={ticket.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() =>
                                            router.visit(`/tickets/${ticket.id}/timeline`)
                                        }
                                    >
                                        <TableCell className="text-muted-foreground">
                                            {(current_page - 1) * per_page + index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {ticket.ticket_number}
                                        </TableCell>
                                        <TableCell>
                                            {ticket.case_id ? (
                                                <span className="text-sm">
                                                    {ticket.case_id}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {ticket.company}
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <div className="truncate text-sm text-muted-foreground" title={ticket.problem}>
                                                {ticket.problem}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {ticket.schedule ? (
                                                <span>
                                                    {new Date(ticket.schedule).toLocaleDateString('en-US', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                    })} {new Date(ticket.schedule).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`${statusColors[ticket.status]}`}
                                                variant="outline"
                                            >
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className="flex items-center justify-center"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <MoreVertical className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem asChild>
                                                            <a href={`/tickets/${ticket.id}/detail`} className="cursor-pointer">
                                                                <FileText className="mr-2 size-4" />
                                                                Detail Lengkap
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={`/tickets/${ticket.id}/bap/download`} className="cursor-pointer" target="_blank" rel="noopener noreferrer">
                                                                <Download className="mr-2 size-4" />
                                                                Download BAP
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={`/tickets/${ticket.id}`} className="cursor-pointer">
                                                                <Eye className="mr-2 size-4" />
                                                                View Ticket
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={`/tickets/${ticket.id}/edit`} className="cursor-pointer">
                                                                <Pencil className="mr-2 size-4" />
                                                                Edit Ticket
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => onDelete(ticket.id)}
                                                            className="cursor-pointer text-destructive focus:text-destructive"
                                                        >
                                                            <Trash className="mr-2 size-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
});
