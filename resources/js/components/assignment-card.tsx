import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { TicketAssignment } from '@/types';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    ExternalLink,
    FileText,
    User,
    UserCircle,
} from 'lucide-react';

interface AssignmentCardProps {
    assignment: TicketAssignment;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
    const { ticket, assigned_to_user, assigned_by_user } = assignment;

    const statusColors = {
        Open: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'Need to Receive':
            'bg-orange-500/10 text-orange-600 border-orange-500/20',
        'In Progress': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
        Finish: 'bg-green-500/10 text-green-600 border-green-500/20',
        Closed: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    };

    return (
        <Card className="transition-colors hover:border-primary/50">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="size-4 shrink-0" />
                            <span className="truncate">
                                {ticket?.ticket_number}
                            </span>
                        </CardTitle>
                        <CardDescription className="mt-1 truncate">
                            {ticket?.company}
                        </CardDescription>
                    </div>
                    {ticket?.status && (
                        <Badge
                            variant="outline"
                            className={
                                statusColors[
                                    ticket.status as keyof typeof statusColors
                                ]
                            }
                        >
                            {ticket.status}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <UserCircle className="size-4 shrink-0" />
                        <span className="font-medium text-foreground">
                            {assigned_to_user?.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="size-4 shrink-0" />
                        <span>
                            Assigned{' '}
                            {format(
                                new Date(assignment.assigned_at),
                                'MMM d, yyyy',
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="size-4 shrink-0" />
                        <span>
                            by{' '}
                            <span className="text-foreground">
                                {assigned_by_user?.name}
                            </span>
                        </span>
                    </div>

                    {ticket?.schedule && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-4 shrink-0" />
                            <span>
                                Scheduled{' '}
                                {format(
                                    new Date(ticket.schedule),
                                    'MMM d, yyyy',
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {assignment.notes && (
                    <div className="rounded-md bg-muted p-2 text-sm">
                        <p className="line-clamp-2 text-muted-foreground">
                            {assignment.notes}
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                    <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1"
                    >
                        <Link href={`/tickets/${ticket?.id}`}>
                            <ExternalLink className="mr-1.5 size-3.5" />
                            View Ticket
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
