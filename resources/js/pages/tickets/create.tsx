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
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from 'laravel-precognition-react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    users?: User[];
}

export default function CreateTicket({ users = [] }: Props) {
    const form = useForm('post', '/tickets', {
        ticket_number: '',
        case_id: '',
        company: '',
        serial_number: '',
        problem: '',
        schedule: '',
        deadline: '',
        status: 'Open',
        assigned_to: '',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.submit({
            onSuccess: () => {
                router.visit('/tickets');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Ticket" />

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
                                <BreadcrumbPage>Create</BreadcrumbPage>
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
                            Create New Ticket
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Fill in the details to create a new support ticket
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {form.validating && (
                                <div className="text-sm text-muted-foreground">
                                    Validating...
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="ticket_number"
                                        className="flex items-center gap-2"
                                    >
                                        Ticket Number *
                                        {form.valid('ticket_number') && (
                                            <CheckCircle2 className="size-4 text-green-600" />
                                        )}
                                        {form.invalid('ticket_number') && (
                                            <XCircle className="size-4 text-red-600" />
                                        )}
                                    </Label>
                                    <Input
                                        id="ticket_number"
                                        type="text"
                                        value={
                                            form.data.ticket_number as string
                                        }
                                        onChange={(e) =>
                                            form.setData(
                                                'ticket_number',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            form.validate('ticket_number')
                                        }
                                        placeholder="e.g., 251022005"
                                        required
                                        className={cn(
                                            form.invalid('ticket_number') &&
                                                'border-red-500',
                                            form.valid('ticket_number') &&
                                                'border-green-500',
                                        )}
                                    />
                                    <InputError
                                        message={form.errors.ticket_number}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="case_id"
                                        className="flex items-center gap-2"
                                    >
                                        Case ID
                                        {form.valid('case_id') && (
                                            <CheckCircle2 className="size-4 text-green-600" />
                                        )}
                                        {form.invalid('case_id') && (
                                            <XCircle className="size-4 text-red-600" />
                                        )}
                                    </Label>
                                    <Input
                                        id="case_id"
                                        type="text"
                                        value={form.data.case_id as string}
                                        onChange={(e) =>
                                            form.setData(
                                                'case_id',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() => form.validate('case_id')}
                                        placeholder="e.g., 5150546916"
                                        className={cn(
                                            form.invalid('case_id') &&
                                                'border-red-500',
                                            form.valid('case_id') &&
                                                'border-green-500',
                                        )}
                                    />
                                    <InputError message={form.errors.case_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="company"
                                        className="flex items-center gap-2"
                                    >
                                        Company *
                                        {form.valid('company') && (
                                            <CheckCircle2 className="size-4 text-green-600" />
                                        )}
                                        {form.invalid('company') && (
                                            <XCircle className="size-4 text-red-600" />
                                        )}
                                    </Label>
                                    <Input
                                        id="company"
                                        type="text"
                                        value={form.data.company as string}
                                        onChange={(e) =>
                                            form.setData(
                                                'company',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() => form.validate('company')}
                                        placeholder="e.g., PT Example Company"
                                        required
                                        className={cn(
                                            form.invalid('company') &&
                                                'border-red-500',
                                            form.valid('company') &&
                                                'border-green-500',
                                        )}
                                    />
                                    <InputError message={form.errors.company} />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="serial_number"
                                        className="flex items-center gap-2"
                                    >
                                        Serial Number
                                        {form.valid('serial_number') && (
                                            <CheckCircle2 className="size-4 text-green-600" />
                                        )}
                                        {form.invalid('serial_number') && (
                                            <XCircle className="size-4 text-red-600" />
                                        )}
                                    </Label>
                                    <Input
                                        id="serial_number"
                                        type="text"
                                        value={
                                            form.data.serial_number as string
                                        }
                                        onChange={(e) =>
                                            form.setData(
                                                'serial_number',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            form.validate('serial_number')
                                        }
                                        placeholder="e.g., 5CG24815SF"
                                        className={cn(
                                            form.invalid('serial_number') &&
                                                'border-red-500',
                                            form.valid('serial_number') &&
                                                'border-green-500',
                                        )}
                                    />
                                    <InputError
                                        message={form.errors.serial_number}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label
                                        htmlFor="problem"
                                        className="flex items-center gap-2"
                                    >
                                        Problem *
                                        {form.valid('problem') && (
                                            <CheckCircle2 className="size-4 text-green-600" />
                                        )}
                                        {form.invalid('problem') && (
                                            <XCircle className="size-4 text-red-600" />
                                        )}
                                    </Label>
                                    <textarea
                                        id="problem"
                                        value={form.data.problem as string}
                                        onChange={(e) =>
                                            form.setData(
                                                'problem',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() => form.validate('problem')}
                                        placeholder="Describe the problem..."
                                        required
                                        className={cn(
                                            'flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                                            form.invalid('problem') &&
                                                'border-red-500',
                                            form.valid('problem') &&
                                                'border-green-500',
                                        )}
                                    />
                                    <InputError message={form.errors.problem} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="schedule">Schedule</Label>
                                    <Input
                                        id="schedule"
                                        type="datetime-local"
                                        value={form.data.schedule as string}
                                        onChange={(e) =>
                                            form.setData(
                                                'schedule',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() => form.validate('schedule')}
                                    />
                                    <InputError
                                        message={form.errors.schedule}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deadline">Deadline</Label>
                                    <Input
                                        id="deadline"
                                        type="datetime-local"
                                        value={form.data.deadline as string}
                                        onChange={(e) =>
                                            form.setData(
                                                'deadline',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() => form.validate('deadline')}
                                    />
                                    <InputError
                                        message={form.errors.deadline}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={form.data.status as string}
                                        onValueChange={(value) =>
                                            form.setData('status', value)
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
                                            <SelectItem value="Resolved">
                                                Resolved
                                            </SelectItem>
                                            <SelectItem value="Closed">
                                                Closed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.status} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="assigned_to">
                                        Assign To
                                    </Label>
                                    <Select
                                        value={form.data.assigned_to as string}
                                        onValueChange={(value) =>
                                            form.setData('assigned_to', value)
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
                                    <InputError
                                        message={form.errors.assigned_to}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <textarea
                                        id="notes"
                                        value={form.data.notes as string}
                                        onChange={(e) =>
                                            form.setData(
                                                'notes',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() => form.validate('notes')}
                                        placeholder="Additional notes..."
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    />
                                    <InputError message={form.errors.notes} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="min-w-32"
                                >
                                    {form.processing
                                        ? 'Creating...'
                                        : 'Create Ticket'}
                                </Button>
                                <Link href="/tickets">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={form.processing}
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
