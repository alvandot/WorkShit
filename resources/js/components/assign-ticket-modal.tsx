import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { User, Ticket } from '@/types';
import { useForm } from '@inertiajs/react';
import { UserCircle } from 'lucide-react';

interface AssignTicketModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ticket: Ticket;
    engineers: User[];
    mode?: 'assign' | 'reassign';
}

export default function AssignTicketModal({
    open,
    onOpenChange,
    ticket,
    engineers,
    mode = 'assign',
}: AssignTicketModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        ticket_id: ticket.id,
        assigned_to: ticket.assigned_to?.toString() || '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = mode === 'reassign' && ticket.assigned_to
            ? `/tickets/${ticket.id}/assign`
            : '/assignments';

        post(url, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    const handleClose = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === 'reassign' ? 'Reassign' : 'Assign'} Ticket
                        </DialogTitle>
                        <DialogDescription>
                            {mode === 'reassign'
                                ? `Reassign ticket ${ticket.ticket_number} to a different engineer.`
                                : `Assign ticket ${ticket.ticket_number} to an engineer.`}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="assigned_to">Engineer</Label>
                            <Select
                                value={data.assigned_to}
                                onValueChange={(value) =>
                                    setData('assigned_to', value)
                                }
                            >
                                <SelectTrigger id="assigned_to">
                                    <SelectValue placeholder="Select an engineer">
                                        {data.assigned_to && (
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="size-4" />
                                                {
                                                    engineers.find(
                                                        (e) =>
                                                            e.id.toString() ===
                                                            data.assigned_to,
                                                    )?.name
                                                }
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {engineers.map((engineer) => (
                                        <SelectItem
                                            key={engineer.id}
                                            value={engineer.id.toString()}
                                        >
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="size-4" />
                                                <div>
                                                    <div className="font-medium">
                                                        {engineer.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {engineer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.assigned_to && (
                                <InputError message={errors.assigned_to} />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any notes about this assignment..."
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                rows={3}
                            />
                            {errors.notes && (
                                <InputError message={errors.notes} />
                            )}
                        </div>

                        {ticket.assigned_to && mode === 'reassign' && (
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p className="text-muted-foreground">
                                    Currently assigned to:{' '}
                                    <span className="font-medium text-foreground">
                                        {ticket.assigned_to_user?.name}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Assigning...'
                                : mode === 'reassign'
                                  ? 'Reassign'
                                  : 'Assign'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
