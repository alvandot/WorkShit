import InputError from '@/components/input-error';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

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
    notes: string | null;
}

interface Props {
    ticket: Ticket;
    users?: User[];
}

export default function EditTicket({ ticket, users = [] }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        ticket_number: ticket.ticket_number || '',
        case_id: ticket.case_id || '',
        company: ticket.company || '',
        serial_number: ticket.serial_number || '',
        problem: ticket.problem || '',
        schedule: ticket.schedule ? ticket.schedule.substring(0, 16) : '',
        deadline: ticket.deadline ? ticket.deadline.substring(0, 16) : '',
        status: ticket.status || 'Open',
        assigned_to: ticket.assigned_to?.toString() || '',
        notes: ticket.notes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/tickets/${ticket.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Ticket" />

            <div className="space-y-6">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/tickets">
                                    Manage Ticket
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Edit #{ticket.ticket_number}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/tickets">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">
                            Edit Ticket #{ticket.ticket_number}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Update ticket information
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="ticket_number">
                                        Ticket Number *
                                    </Label>
                                    <Input
                                        id="ticket_number"
                                        type="text"
                                        value={data.ticket_number}
                                        onChange={(e) =>
                                            setData(
                                                'ticket_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., 251022005"
                                        required
                                    />
                                    <InputError
                                        message={errors.ticket_number}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="case_id">Case ID</Label>
                                    <Input
                                        id="case_id"
                                        type="text"
                                        value={data.case_id}
                                        onChange={(e) =>
                                            setData('case_id', e.target.value)
                                        }
                                        placeholder="e.g., 5150546916"
                                    />
                                    <InputError message={errors.case_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company">Company *</Label>
                                    <Input
                                        id="company"
                                        type="text"
                                        value={data.company}
                                        onChange={(e) =>
                                            setData('company', e.target.value)
                                        }
                                        placeholder="e.g., PT Example Company"
                                        required
                                    />
                                    <InputError message={errors.company} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="serial_number">
                                        Serial Number
                                    </Label>
                                    <Input
                                        id="serial_number"
                                        type="text"
                                        value={data.serial_number}
                                        onChange={(e) =>
                                            setData(
                                                'serial_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g., 5CG24815SF"
                                    />
                                    <InputError
                                        message={errors.serial_number}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="problem">Problem *</Label>
                                    <textarea
                                        id="problem"
                                        value={data.problem}
                                        onChange={(e) =>
                                            setData('problem', e.target.value)
                                        }
                                        placeholder="Describe the problem..."
                                        required
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    />
                                    <InputError message={errors.problem} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="schedule">Schedule</Label>
                                    <Input
                                        id="schedule"
                                        type="datetime-local"
                                        value={data.schedule}
                                        onChange={(e) =>
                                            setData('schedule', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.schedule} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deadline">Deadline</Label>
                                    <Input
                                        id="deadline"
                                        type="datetime-local"
                                        value={data.deadline}
                                        onChange={(e) =>
                                            setData('deadline', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.deadline} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData('status', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">
                                                Open
                                            </SelectItem>
                                            <SelectItem value="Need to Receive">
                                                Need to Receive
                                            </SelectItem>
                                            <SelectItem value="In Progress">
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value="Finish">
                                                Finish
                                            </SelectItem>
                                            <SelectItem value="Closed">
                                                Closed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="assigned_to">
                                        Assign To
                                    </Label>
                                    <Select
                                        value={data.assigned_to}
                                        onValueChange={(value) =>
                                            setData('assigned_to', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">
                                                Unassigned
                                            </SelectItem>
                                            {users.map((user) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id.toString()}
                                                >
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.assigned_to} />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        placeholder="Additional notes..."
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-32"
                                >
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Ticket'}
                                </Button>
                                <Link href="/tickets">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
