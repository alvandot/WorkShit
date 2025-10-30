import InputError from '@/components/input-error';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import {
    ArrowLeft,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    Sparkles,
    UserCheck,
    XCircle,
} from 'lucide-react';
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
        address: '',
        phone_number: '',
        serial_number: '',
        product_number: '',
        problem: '',
        schedule: '',
        deadline: '',
        status: 'Open',
        assigned_to: '',
        notes: '',
    });

    const steps = [
        {
            title: 'Ticket Basics',
            description: 'Identify the request and capture unique references.',
            icon: ClipboardList,
        },
        {
            title: 'Schedule & SLA',
            description: 'Plan visit dates and set an internal deadline.',
            icon: CalendarClock,
        },
        {
            title: 'Assign Ownership',
            description: 'Choose who will lead the ticket and add context notes.',
            icon: UserCheck,
        },
    ];

    const assignedToRaw = (form.data.assigned_to as string) ?? '';
    const assignedUser = users.find(
        (user) => user.id.toString() === assignedToRaw,
    );
    const assignedToValue = assignedToRaw.length > 0 ? assignedToRaw : 'unassigned';

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

                <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-lg starting:translate-y-4 starting:opacity-0">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_theme(colors.primary/15),_transparent_65%)]" />
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap items-start justify-between gap-5">
                            <div className="flex items-start gap-4">
                                <Link href="/tickets">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full border border-white/30 bg-white/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/40"
                                    >
                                        <ArrowLeft className="size-4" />
                                    </Button>
                                </Link>
                                <div className="space-y-3">
                                    <Badge variant="outline" className="w-fit rounded-full border-white/30 bg-white/20 text-xs font-medium uppercase tracking-[0.35em] text-white dark:text-foreground">
                                        New Ticket
                                    </Badge>
                                    <h1 className="text-balance text-3xl font-bold sm:text-4xl">
                                        Launch a New Support Ticket
                                    </h1>
                                    <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                        Capture the essentials, schedule the visit, and assign the ticket with confidence—all from a single streamlined form.
                                    </p>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm text-white backdrop-blur dark:text-foreground">
                                <Sparkles className="size-4" />
                                Live validation powered by Precognition
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={step.title}
                                        className="rounded-2xl border border-white/20 bg-background/70 p-4 shadow-sm backdrop-blur"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/15">
                                                <Icon className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                                                    Step {index + 1}
                                                </p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {step.title}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-xs text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ticket Essentials</CardTitle>
                                    <CardDescription>
                                        Provide identifiers and describe the issue to help technicians prepare in advance.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {form.validating && (
                                        <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2 text-sm text-primary">
                                            Validating latest changes...
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

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="product_number"
                                                className="flex items-center gap-2"
                                            >
                                                Product Number
                                                {form.valid('product_number') && (
                                                    <CheckCircle2 className="size-4 text-green-600" />
                                                )}
                                                {form.invalid('product_number') && (
                                                    <XCircle className="size-4 text-red-600" />
                                                )}
                                            </Label>
                                            <Input
                                                id="product_number"
                                                type="text"
                                                value={
                                                    form.data.product_number as string
                                                }
                                                onChange={(e) =>
                                                    form.setData(
                                                        'product_number',
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={() =>
                                                    form.validate('product_number')
                                                }
                                                placeholder="e.g., PN-2210-A"
                                                className={cn(
                                                    form.invalid('product_number') &&
                                                        'border-red-500',
                                                    form.valid('product_number') &&
                                                        'border-green-500',
                                                )}
                                            />
                                            <InputError
                                                message={form.errors.product_number}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="phone_number"
                                                className="flex items-center gap-2"
                                            >
                                                Contact Phone
                                                {form.valid('phone_number') && (
                                                    <CheckCircle2 className="size-4 text-green-600" />
                                                )}
                                                {form.invalid('phone_number') && (
                                                    <XCircle className="size-4 text-red-600" />
                                                )}
                                            </Label>
                                            <Input
                                                id="phone_number"
                                                type="tel"
                                                value={
                                                    form.data.phone_number as string
                                                }
                                                onChange={(e) =>
                                                    form.setData(
                                                        'phone_number',
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={() =>
                                                    form.validate('phone_number')
                                                }
                                                placeholder="e.g., +62 812-3456-7890"
                                                className={cn(
                                                    form.invalid('phone_number') &&
                                                        'border-red-500',
                                                    form.valid('phone_number') &&
                                                        'border-green-500',
                                                )}
                                            />
                                            <InputError
                                                message={form.errors.phone_number}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
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
                                        <Label
                                            htmlFor="address"
                                            className="flex items-center gap-2"
                                        >
                                            Service Address
                                            {form.valid('address') && (
                                                <CheckCircle2 className="size-4 text-green-600" />
                                            )}
                                            {form.invalid('address') && (
                                                <XCircle className="size-4 text-red-600" />
                                            )}
                                        </Label>
                                        <textarea
                                            id="address"
                                            value={form.data.address as string}
                                            onChange={(e) =>
                                                form.setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                            onBlur={() => form.validate('address')}
                                            placeholder="Provide on-site address or meeting location..."
                                            className={cn(
                                                'flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                                                form.invalid('address') &&
                                                    'border-red-500',
                                                form.valid('address') &&
                                                    'border-green-500',
                                            )}
                                        />
                                        <InputError message={form.errors.address} />
                                    </div>

                                    <div className="space-y-2">
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
                                            placeholder="Add internal context or reminders for the field team..."
                                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                        />
                                        <InputError message={form.errors.notes} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Scheduling & Assignment</CardTitle>
                                    <CardDescription>
                                        Decide when the ticket should be handled and who will own the next action.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                            onBlur={() =>
                                                form.validate('schedule')
                                            }
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
                                            onBlur={() =>
                                                form.validate('deadline')
                                            }
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
                                                <SelectItem value="Finish">
                                                    Finish
                                                </SelectItem>
                                                <SelectItem value="Closed">
                                                    Closed
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={form.errors.status}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="assigned_to">
                                            Assign To
                                        </Label>
                                        <Select
                                            value={assignedToValue}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'assigned_to',
                                                    value === 'unassigned'
                                                        ? ''
                                                        : value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unassigned">
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
                                </CardContent>
                            </Card>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="h-11 min-w-36 gap-2 rounded-full"
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
                                        className="h-11 min-w-32 rounded-full"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <Card className="sticky top-28">
                                <CardHeader>
                                    <CardTitle>Live Preview</CardTitle>
                                    <CardDescription>
                                        Quick glance at how key details will appear in the timeline.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                            Ticket Number
                                        </p>
                                        <p className="mt-1 text-lg font-semibold">
                                            {(form.data.ticket_number as string) || '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                            Company
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {(form.data.company as string) || 'Awaiting input'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                            Product Number
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {(form.data.product_number as string) || 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                            Problem Snapshot
                                        </p>
                                        <p className="mt-1 text-muted-foreground">
                                            {(form.data.problem as string) || 'Describe the issue to help the field team prepare.'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                            Contact Phone
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {(form.data.phone_number as string) || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                            Service Address
                                        </p>
                                        <p className="mt-1 text-muted-foreground text-pretty">
                                            {(form.data.address as string) || 'Capture the exact service location for the onsite team.'}
                                        </p>
                                    </div>
                                    <div className="grid gap-2 text-xs">
                                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                                            <span>Status</span>
                                            <span className="font-semibold">
                                                {form.data.status as string}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                                            <span>Assigned To</span>
                                            <span className="font-semibold">
                                                {assignedUser?.name || 'Unassigned'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                                            <span>Schedule</span>
                                            <span className="font-semibold">
                                                {(form.data.schedule as string) || 'TBD'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                                            <span>Deadline</span>
                                            <span className="font-semibold">
                                                {(form.data.deadline as string) || '—'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="sticky top-[380px]">
                                <CardHeader>
                                    <CardTitle>Submission Checklist</CardTitle>
                                    <CardDescription>
                                        Make sure everything is ready before you hit save.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            className={cn(
                                                'size-4',
                                                form.data.ticket_number
                                                    ? 'text-green-500'
                                                    : 'text-muted-foreground',
                                            )}
                                        />
                                        <span>Provide a unique ticket number.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            className={cn(
                                                'size-4',
                                                form.data.company && form.data.problem
                                                    ? 'text-green-500'
                                                    : 'text-muted-foreground',
                                            )}
                                        />
                                        <span>Company and issue description filled in.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            className={cn(
                                                'size-4',
                                                form.data.status
                                                    ? 'text-green-500'
                                                    : 'text-muted-foreground',
                                            )}
                                        />
                                        <span>Status selected to match workflow.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            className={cn(
                                                'size-4',
                                                form.data.address && form.data.phone_number
                                                    ? 'text-green-500'
                                                    : 'text-muted-foreground',
                                            )}
                                        />
                                        <span>Contact and address details confirmed.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            className={cn(
                                                'size-4',
                                                Object.keys(form.errors).length === 0
                                                    ? 'text-green-500'
                                                    : 'text-muted-foreground',
                                            )}
                                        />
                                        <span>
                                            {Object.keys(form.errors).length === 0
                                                ? 'No validation issues detected.'
                                                : 'Resolve outstanding validation messages.'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
