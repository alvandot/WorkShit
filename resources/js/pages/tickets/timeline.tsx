import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FileUploadWithPreview from '@/components/file-upload-with-preview';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowLeft,
    Building2,
    Calendar,
    CalendarClock,
    Check,
    CheckCircle2,
    Clock,
    Download,
    FileText,
    Hash,
    Lock,
    MapPin,
    PackageCheck,
    Phone,
    Truck,
    User,
    Wrench,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';


interface User {
    id: number;
    name: string;
    email: string;
}

interface Activity {
    id: number;
    ticket_id: number;
    visit_number: number;
    activity_type: string;
    title: string;
    description: string | null;
    activity_time: string;
    user_id: number | null;
    attachments: {
        ct_bad_part?: string;
        ct_good_part?: string;
        bap_file?: string;
    } | null;
    user?: User;
    created_at: string;
}

interface VisitSchedule {
    status: 'pending_schedule' | 'scheduled' | 'in_progress' | 'completed';
    schedule: string | null;
    scheduled_by: number | null;
    scheduled_at: string | null;
    reason: string;
}

interface Ticket {
    id: number;
    ticket_number: string;
    case_id: string | null;
    company: string;
    address: string | null;
    phone_number: string | null;
    serial_number: string | null;
    problem: string;
    schedule: string | null;
    deadline: string | null;
    status: string;
    assigned_to: number | null;
    created_by: number | null;
    notes: string | null;
    ct_bad_part: string[] | null;
    ct_good_part: string[] | null;
    bap_file: string[] | null;
    needs_revisit: boolean;
    current_visit: number;
    visit_schedules: Record<number, VisitSchedule> | null;
    completion_notes: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    assigned_to_user?: User;
    created_by_user?: User;
    activities: Activity[];
}

interface Props {
    ticket: Ticket;
}

const statusColors: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Need to Receive':
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'In Progress':
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Finish:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

// Timeline stages configuration (ordered sequence)
const TIMELINE_STAGES = [
    {
        key: 'received',
        title: 'Received Ticket',
        description: 'Ticket has been received and assigned',
        icon: PackageCheck,
        color: 'bg-blue-500',
    },
    {
        key: 'on_the_way',
        title: 'On The Road',
        description: 'Technician is on the way to location',
        icon: Truck,
        color: 'bg-orange-500',
    },
    {
        key: 'arrived',
        title: "It's Arrived",
        description: 'Technician has arrived at location',
        icon: MapPin,
        color: 'bg-purple-500',
    },
    {
        key: 'start_working',
        title: 'Start Working',
        description: 'Work has begun on the ticket',
        icon: Wrench,
        color: 'bg-indigo-500',
    },
    {
        key: 'completed',
        title: 'End Case',
        description: 'Complete the ticket with required documents',
        icon: Check,
        color: 'bg-green-500',
    },
] as const;

export default function Timeline({ ticket }: Props) {
    // State for zoom preview
    const [zoomPreview, setZoomPreview] = useState<{
        url: string;
        label: string;
    } | null>(null);
    const [currentStageDialog, setCurrentStageDialog] = useState<string | null>(
        null,
    );
    const [showScheduleDialog, setShowScheduleDialog] = useState<number | null>(
        null,
    );
    const [showRevisitDialog, setShowRevisitDialog] = useState(false);

    // Get visit suffix
    const getVisitSuffix = (visit: number) => {
        if (visit === 1) return 'First Visit';
        if (visit === 2) return 'Second Visit';
        if (visit === 3) return 'Third Visit';
        return `Visit ${visit}`;
    };

    // Calculate total visits (including pending ones)
    const totalVisits = useMemo(() => {
        let count = ticket.current_visit;
        if (ticket.visit_schedules) {
            count = Math.max(
                count,
                ...Object.keys(ticket.visit_schedules).map(Number),
            );
        }
        return count;
    }, [ticket.current_visit, ticket.visit_schedules]);

    // Get visit schedule status
    const getVisitStatus = (visitNumber: number) => {
        if (!ticket.visit_schedules || !ticket.visit_schedules[visitNumber]) {
            return visitNumber === 1 ? 'in_progress' : null;
        }
        return ticket.visit_schedules[visitNumber].status;
    };

    // Check if visit is locked
    const isVisitLocked = (visitNumber: number) => {
        const status = getVisitStatus(visitNumber);
        return status === 'pending_schedule';
    };

    // Check if visit is completed (has all stages done or revisit was requested)
    const isVisitCompleted = (visitNumber: number) => {
        // If there's a newer visit, this visit is completed/disabled
        if (visitNumber < ticket.current_visit) return true;

        // Check if this visit has completed status in visit_schedules
        const status = getVisitStatus(visitNumber);
        if (status === 'completed') return true;

        // Check if all stages are completed for this visit
        const visitActivities = ticket.activities.filter(
            (a) => a.visit_number === visitNumber,
        );
        const completedStages = new Set(
            visitActivities.map((a) => a.activity_type),
        );

        return TIMELINE_STAGES.every((stage) => completedStages.has(stage.key));
    };

    // Get current stage index for a specific visit
    const getCurrentStageIndex = (visitNumber: number) => {
        const visitActivities = ticket.activities.filter(
            (a) => a.visit_number === visitNumber,
        );

        const completedStages = new Set(
            visitActivities.map((a) => a.activity_type),
        );

        // Find the first incomplete stage
        for (let i = 0; i < TIMELINE_STAGES.length; i++) {
            if (!completedStages.has(TIMELINE_STAGES[i].key)) {
                return i;
            }
        }

        // All stages completed
        return TIMELINE_STAGES.length;
    };

    const isStageCompleted = (stageKey: string, visitNumber: number) => {
        return ticket.activities.some(
            (a) =>
                a.activity_type === stageKey && a.visit_number === visitNumber,
        );
    };

    const getStageActivity = (stageKey: string, visitNumber: number) => {
        return ticket.activities.find(
            (a) =>
                a.activity_type === stageKey && a.visit_number === visitNumber,
        );
    };

    const totalStageSlots = useMemo(
        () => TIMELINE_STAGES.length * totalVisits,
        [totalVisits],
    );

    const completedStageCount = useMemo(
        () =>
            ticket.activities.filter((activity) =>
                TIMELINE_STAGES.some(
                    (stage) => stage.key === activity.activity_type,
                ),
            ).length,
        [ticket.activities],
    );

    const overallProgress = totalStageSlots
        ? Math.min(
              100,
              Math.round((completedStageCount / totalStageSlots) * 100),
          )
        : 0;

    const currentVisitStageIndex = getCurrentStageIndex(ticket.current_visit);

    const upcomingStage =
        currentVisitStageIndex >= TIMELINE_STAGES.length
            ? null
            : TIMELINE_STAGES[currentVisitStageIndex];

    const UpcomingStageIcon = upcomingStage?.icon;

    // Form for regular activities
    const activityForm = useForm({
        activity_type: '',
        title: '',
        description: '',
        activity_time: new Date().toISOString().slice(0, 16),
    });

    // Form for completion (End Case)
    const completeForm = useForm({
        ct_bad_part: [] as File[],
        ct_good_part: [] as File[],
        bap_file: [] as File[],
        completion_notes: '',
    });

    // Form for revisit
    const revisitForm = useForm({
        reason: '',
    });

    // Form for schedule visit
    const scheduleForm = useForm({
        schedule: '',
    });

    const handleStageClick = (
        stage: (typeof TIMELINE_STAGES)[number],
        index: number,
        visitNumber: number,
    ) => {
        // Don't allow clicking if ticket is closed
        if (ticket.status === 'Closed') return;

        // Don't allow clicking if visit is locked
        if (isVisitLocked(visitNumber)) return;

        // Don't allow clicking if visit is completed
        if (isVisitCompleted(visitNumber)) return;

        // Don't allow clicking completed stages
        if (isStageCompleted(stage.key, visitNumber)) return;

        // Only allow clicking the current stage
        if (index !== getCurrentStageIndex(visitNumber)) return;

        setCurrentStageDialog(stage.key);

        // Set form values
        activityForm.setData({
            activity_type: stage.key,
            title: stage.title,
            description: '',
            activity_time: new Date().toISOString().slice(0, 16),
        });
    };

    const handleActivitySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        activityForm.post(`/tickets/${ticket.id}/activities`, {
            onSuccess: () => {
                setCurrentStageDialog(null);
                activityForm.reset();
            },
        });
    };

    const handleCompleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        completeForm.post(`/tickets/${ticket.id}/complete`, {
            forceFormData: true,
            onSuccess: () => {
                setCurrentStageDialog(null);
                completeForm.reset();
            },
        });
    };

    const handleRevisit = (e: React.FormEvent) => {
        e.preventDefault();
        revisitForm.post(`/tickets/${ticket.id}/revisit`, {
            onSuccess: () => {
                setShowRevisitDialog(false);
                revisitForm.reset();
            },
        });
    };

    const handleScheduleVisit = (e: React.FormEvent) => {
        e.preventDefault();
        if (showScheduleDialog === null) return;

        scheduleForm.post(
            `/tickets/${ticket.id}/schedule-visit/${showScheduleDialog}`,
            {
                onSuccess: () => {
                    setShowScheduleDialog(null);
                    scheduleForm.reset();
                },
            },
        );
    };

    const currentStage = TIMELINE_STAGES.find(
        (s) => s.key === currentStageDialog,
    );

    return (
        <AppLayout>
            <Head title={`Timeline - ${ticket.ticket_number}`} />

            <div className="space-y-6">
                <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-lg starting:translate-y-4 starting:opacity-0">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_theme(colors.primary/15),_transparent_60%)]" />
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap items-start justify-between gap-5">
                            <div className="flex items-start gap-4">
                                <Link href="/tickets">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full border border-white/30 bg-white/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/40"
                                    >
                                        <ArrowLeft className="size-5" />
                                    </Button>
                                </Link>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge
                                            className={statusColors[ticket.status]}
                                            variant="outline"
                                        >
                                            {ticket.status}
                                        </Badge>
                                        {ticket.needs_revisit && (
                                            <Badge variant="destructive" className="rounded-full">
                                                Needs Revisit
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h1 className="text-balance text-3xl font-bold sm:text-4xl">
                                            {ticket.company}
                                        </h1>
                                        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                            Track every visit milestone, capture supporting documents, and ensure the ticket closes with confidence.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-sm">
                                        <span className="flex items-center gap-2 rounded-full border border-white/30 bg-white/30 px-3 py-1 font-mono text-xs uppercase tracking-[0.3em]">
                                            #{ticket.ticket_number}
                                        </span>
                                        {ticket.case_id && (
                                            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                                                Case ID: {ticket.case_id}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                                            Current Visit: {ticket.current_visit}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Link href={`/tickets/${ticket.id}/detail`}>
                                    <Button
                                        variant="outline"
                                        className="h-11 min-w-36 gap-2 rounded-full border-white/40 bg-white/20 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/40 dark:text-foreground"
                                    >
                                        <FileText className="size-4" />
                                        Detail Lengkap
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <div className="rounded-2xl border border-white/20 bg-background/70 p-4 shadow-sm backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                    Overall Progress
                                </p>
                                <div className="mt-3 flex items-end justify-between">
                                    <span className="text-3xl font-bold">
                                        {overallProgress}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {completedStageCount} of {totalStageSlots} stages
                                    </span>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                        style={{ width: `${overallProgress}%` }}
                                    />
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground">
                                    Updated with every activity submission
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/20 bg-background/70 p-4 shadow-sm backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                    Upcoming Milestone
                                </p>
                                {upcomingStage ? (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`rounded-full p-2 ${upcomingStage.color}`}>
                                                {UpcomingStageIcon && (
                                                    <UpcomingStageIcon className="size-5 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-base font-semibold">
                                                    {upcomingStage.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {upcomingStage.description}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Complete current step to unlock the next action.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-600 dark:text-green-400">
                                        <p className="text-base font-semibold">
                                            All visits completed
                                        </p>
                                        <p className="text-xs">
                                            Finalize documents or request revisit if additional work is needed.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-white/20 bg-background/70 p-4 shadow-sm backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                    Scheduling
                                </p>
                                <div className="mt-3 space-y-3 text-sm">
                                    {ticket.schedule ? (
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">
                                                Scheduled Visit
                                            </span>
                                            <span className="font-semibold">
                                                {format(new Date(ticket.schedule), 'MMM dd, yyyy HH:mm')}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-muted-foreground/40 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                                            No schedule registered for the current visit yet.
                                        </div>
                                    )}
                                    {ticket.deadline && (
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">
                                                Deadline
                                            </span>
                                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                                                {format(new Date(ticket.deadline), 'MMM dd, yyyy HH:mm')}
                                            </span>
                                        </div>
                                    )}
                                    {ticket.assigned_to_user?.name ? (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <User className="size-4" />
                                            <span>
                                                Assigned to {ticket.assigned_to_user.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <User className="size-4" />
                                            <span>Unassigned technician</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Ticket Info */}
                    <Card className="border-2 shadow-lg lg:col-span-1">
                        <CardHeader className="border-b-2 bg-gradient-to-br from-primary/5 to-primary/10">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="rounded-lg bg-primary p-2">
                                    <FileText className="text-primary-content size-6" />
                                </div>
                                <span>Ticket Information</span>
                            </CardTitle>
                            <CardDescription className="mt-2 text-base">
                                Details about this support ticket
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1 p-0">
                            {/* Company */}
                            <div className="hover:bg-base-200 border-b p-4 transition-colors">
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="rounded-lg bg-secondary/10 p-2">
                                        <Building2 className="size-5 text-secondary" />
                                    </div>
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Company
                                    </p>
                                </div>
                                <p className="ml-11 text-lg font-bold">
                                    {ticket.company}
                                </p>
                            </div>

                            {/* Address */}
                            {ticket.address && (
                                <div className="hover:bg-base-200 border-b p-4 transition-colors">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-500/10 p-2">
                                            <MapPin className="size-5 text-blue-500" />
                                        </div>
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Address
                                        </p>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-11 flex items-start gap-2 text-base leading-relaxed font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        <span className="flex-1">
                                            {ticket.address}
                                        </span>
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs whitespace-nowrap text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                            Google Maps
                                        </span>
                                    </a>
                                </div>
                            )}

                            {/* Phone Number */}
                            {ticket.phone_number && (
                                <div className="hover:bg-base-200 border-b p-4 transition-colors">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="rounded-lg bg-green-500/10 p-2">
                                            <Phone className="size-5 text-green-500" />
                                        </div>
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Phone Number
                                        </p>
                                    </div>
                                    <a
                                        href={`https://wa.me/62${ticket.phone_number.replace(/[^0-9]/g, '').replace(/^0+/, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-11 flex w-fit items-center gap-2 text-lg font-bold text-green-600 transition-colors hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300"
                                    >
                                        +62
                                        {ticket.phone_number
                                            .replace(/[^0-9]/g, '')
                                            .replace(/^0+/, '')}
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                                            WhatsApp
                                        </span>
                                    </a>
                                </div>
                            )}

                            {/* Serial Number */}
                            <div className="hover:bg-base-200 border-b p-4 transition-colors">
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="bg-info/10 rounded-lg p-2">
                                        <Hash className="text-info size-5" />
                                    </div>
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Serial Number
                                    </p>
                                </div>
                                <div className="ml-11">
                                    {ticket.serial_number ? (
                                        <a
                                            href={`https://partsurfer.hp.com/?searchtext=${ticket.serial_number}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-500 bg-blue-50 px-4 py-2 font-mono font-bold text-blue-700 transition-all hover:bg-blue-500 hover:text-white hover:shadow-lg dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-600"
                                        >
                                            {ticket.serial_number}
                                            <span className="text-xs opacity-75">
                                                → HP PartSurfer
                                            </span>
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground italic">
                                            Not provided
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Problem */}
                            <div className="hover:bg-base-200 border-b p-4 transition-colors">
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="bg-warning/10 rounded-lg p-2">
                                        <FileText className="text-warning size-5" />
                                    </div>
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Problem
                                    </p>
                                </div>
                                <p className="ml-11 text-base leading-relaxed font-medium">
                                    {ticket.problem}
                                </p>
                            </div>

                            {/* Assigned To */}
                            <div className="hover:bg-base-200 border-b p-4 transition-colors">
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="bg-success/10 rounded-lg p-2">
                                        <User className="text-success size-5" />
                                    </div>
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Assigned To
                                    </p>
                                </div>
                                <div className="ml-11">
                                    {ticket.assigned_to_user?.name ? (
                                        <div className="flex items-center gap-2">
                                            <div className="avatar placeholder">
                                                <div className="text-primary-content w-8 rounded-full bg-primary">
                                                    <span className="text-xs font-bold">
                                                        {ticket.assigned_to_user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-base font-bold">
                                                {ticket.assigned_to_user.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="badge badge-lg badge-ghost">
                                            Unassigned
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Schedule */}
                            {ticket.schedule && (
                                <div className="hover:bg-base-200 border-b p-4 transition-colors">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="rounded-lg bg-secondary/10 p-2">
                                            <Calendar className="size-5 text-secondary" />
                                        </div>
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Schedule
                                        </p>
                                    </div>
                                    <div className="ml-11 flex items-center gap-2">
                                        <span className="badge badge-lg badge-secondary font-semibold">
                                            {format(
                                                new Date(ticket.schedule),
                                                'MMM dd, yyyy',
                                            )}
                                        </span>
                                        <span className="badge badge-lg badge-outline">
                                            {format(
                                                new Date(ticket.schedule),
                                                'HH:mm',
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Deadline */}
                            {ticket.deadline && (
                                <div className="hover:bg-base-200 p-4 transition-colors">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="bg-error/10 rounded-lg p-2">
                                            <Clock className="text-error size-5" />
                                        </div>
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Deadline
                                        </p>
                                    </div>
                                    <div className="ml-11 flex items-center gap-2">
                                        <span className="badge badge-lg badge-error font-semibold">
                                            {format(
                                                new Date(ticket.deadline),
                                                'MMM dd, yyyy',
                                            )}
                                        </span>
                                        <span className="badge badge-lg badge-outline">
                                            {format(
                                                new Date(ticket.deadline),
                                                'HH:mm',
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Completion Documents */}
                            {ticket.completed_at &&
                                ((ticket.ct_bad_part && ticket.ct_bad_part.length > 0) ||
                                    (ticket.ct_good_part && ticket.ct_good_part.length > 0) ||
                                    (ticket.bap_file && ticket.bap_file.length > 0)) && (
                                    <div className="border-t-2 border-dashed pt-4">
                                        <div className="bg-success/5 rounded-lg p-4">
                                            <p className="text-success mb-4 flex items-center gap-2 text-base font-bold">
                                                <Download className="size-5" />
                                                Completion Documents
                                            </p>
                                            <div className="space-y-4">
                                                {ticket.ct_bad_part && ticket.ct_bad_part.length > 0 && (
                                                    <div>
                                                        <p className="mb-2 text-sm font-semibold text-muted-foreground">
                                                            CT Bad Part ({ticket.ct_bad_part.length})
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                            {ticket.ct_bad_part.map((file, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={`/tickets/${ticket.id}/download/ct_bad_part/${index}`}
                                                                    download
                                                                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted/50 transition-all hover:border-primary hover:shadow-md"
                                                                >
                                                                    <img
                                                                        src={`/storage/${file}`}
                                                                        alt={`CT Bad Part ${index + 1}`}
                                                                        className="size-full object-cover transition-transform group-hover:scale-110"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.style.display = 'none';
                                                                            const parent = target.parentElement;
                                                                            if (parent) {
                                                                                parent.innerHTML = '<div class="flex h-full items-center justify-center"><p class="text-xs text-muted-foreground">Image not found</p></div>';
                                                                            }
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                                        <Download className="size-6 text-white" />
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {ticket.ct_good_part && ticket.ct_good_part.length > 0 && (
                                                    <div>
                                                        <p className="mb-2 text-sm font-semibold text-muted-foreground">
                                                            CT Good Part ({ticket.ct_good_part.length})
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                            {ticket.ct_good_part.map((file, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={`/tickets/${ticket.id}/download/ct_good_part/${index}`}
                                                                    download
                                                                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted/50 transition-all hover:border-primary hover:shadow-md"
                                                                >
                                                                    <img
                                                                        src={`/storage/${file}`}
                                                                        alt={`CT Good Part ${index + 1}`}
                                                                        className="size-full object-cover transition-transform group-hover:scale-110"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.style.display = 'none';
                                                                            const parent = target.parentElement;
                                                                            if (parent) {
                                                                                parent.innerHTML = '<div class="flex h-full items-center justify-center"><p class="text-xs text-muted-foreground">Image not found</p></div>';
                                                                            }
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                                        <Download className="size-6 text-white" />
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {ticket.bap_file && ticket.bap_file.length > 0 && (
                                                    <div>
                                                        <p className="mb-2 text-sm font-semibold text-muted-foreground">
                                                            BAP Files ({ticket.bap_file.length})
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                            {ticket.bap_file.map((file, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={`/tickets/${ticket.id}/download/bap_file/${index}`}
                                                                    download
                                                                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted/50 transition-all hover:border-primary hover:shadow-md"
                                                                >
                                                                    <img
                                                                        src={`/storage/${file}`}
                                                                        alt={`BAP ${index + 1}`}
                                                                        className="size-full object-cover transition-transform group-hover:scale-110"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.style.display = 'none';
                                                                            const parent = target.parentElement;
                                                                            if (parent) {
                                                                                parent.innerHTML = '<div class="flex h-full items-center justify-center"><p class="text-xs text-muted-foreground">Image not found</p></div>';
                                                                            }
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                                        <Download className="size-6 text-white" />
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Timeline - Multiple Visit Panels */}
                    <div className="space-y-6 lg:col-span-2">
                        {Array.from(
                            { length: totalVisits },
                            (_, i) => i + 1,
                        ).map((visitNumber) => {
                            const visitStatus = getVisitStatus(visitNumber);
                            const isLocked = isVisitLocked(visitNumber);
                            const isCompleted = isVisitCompleted(visitNumber);
                            const currentStageIndex =
                                getCurrentStageIndex(visitNumber);
                            const visitSchedule =
                                ticket.visit_schedules?.[visitNumber];

                            return (
                                <Card
                                    key={visitNumber}
                                    className={
                                        isLocked
                                            ? 'border-2 border-dashed opacity-60'
                                            : isCompleted
                                              ? 'border-2 border-green-500 opacity-70'
                                              : ''
                                    }
                                >
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    {isLocked && (
                                                        <Lock className="size-5 text-muted-foreground" />
                                                    )}
                                                    {isCompleted &&
                                                        visitNumber <
                                                            ticket.current_visit && (
                                                            <CheckCircle2 className="size-5 text-green-500" />
                                                        )}
                                                    {getVisitSuffix(
                                                        visitNumber,
                                                    )}
                                                </CardTitle>
                                                <CardDescription>
                                                    {isLocked
                                                        ? 'Waiting for admin to schedule this visit'
                                                        : isCompleted &&
                                                            visitNumber <
                                                                ticket.current_visit
                                                          ? 'This visit has been completed and a new visit was requested'
                                                          : 'Follow the sequential steps to complete this visit'}
                                                </CardDescription>
                                            </div>
                                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                                                {(() => {
                                                    // Determine actual badge based on visit progress
                                                    const visitActivities =
                                                        ticket.activities.filter(
                                                            (a) =>
                                                                a.visit_number ===
                                                                visitNumber,
                                                        );
                                                    const completedStages =
                                                        new Set(
                                                            visitActivities.map(
                                                                (a) =>
                                                                    a.activity_type,
                                                            ),
                                                        );
                                                    const progressPercentage =
                                                        (completedStages.size /
                                                            TIMELINE_STAGES.length) *
                                                        100;

                                                    // Priority: visit_schedules status > actual progress
                                                    if (
                                                        visitStatus ===
                                                        'pending_schedule'
                                                    ) {
                                                        return (
                                                            <>
                                                                <Badge variant="secondary">
                                                                    Pending
                                                                    Schedule
                                                                </Badge>
                                                                <Badge
                                                                    variant="destructive"
                                                                    className="animate-pulse"
                                                                >
                                                                    Needs
                                                                    Schedule
                                                                </Badge>
                                                            </>
                                                        );
                                                    }

                                                    if (
                                                        visitStatus ===
                                                        'scheduled'
                                                    ) {
                                                        return (
                                                            <Badge variant="default">
                                                                Scheduled
                                                            </Badge>
                                                        );
                                                    }

                                                    // Show progress bar instead of badge
                                                    return (
                                                        <div className="flex w-full items-center gap-3 sm:min-w-[200px]">
                                                            <div className="flex-1">
                                                                <div className="mb-1 flex items-center justify-between">
                                                                    <span className="text-xs font-medium text-muted-foreground">
                                                                        Progress
                                                                    </span>
                                                                    <span className="text-xs font-bold">
                                                                        {
                                                                            completedStages.size
                                                                        }
                                                                        /
                                                                        {
                                                                            TIMELINE_STAGES.length
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                                    <div
                                                                        className={`h-full transition-all duration-500 ${
                                                                            progressPercentage ===
                                                                            100
                                                                                ? 'bg-green-500'
                                                                                : progressPercentage >=
                                                                                    80
                                                                                  ? 'bg-purple-500'
                                                                                  : progressPercentage >=
                                                                                      60
                                                                                    ? 'bg-indigo-500'
                                                                                    : progressPercentage >=
                                                                                        40
                                                                                      ? 'bg-orange-500'
                                                                                      : 'bg-yellow-500'
                                                                        }`}
                                                                        style={{
                                                                            width: `${progressPercentage}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        {visitSchedule?.reason && (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                <strong>Reason:</strong>{' '}
                                                {visitSchedule.reason}
                                            </p>
                                        )}
                                        {visitSchedule?.schedule && (
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Scheduled:</strong>{' '}
                                                {format(
                                                    new Date(
                                                        visitSchedule.schedule,
                                                    ),
                                                    'MMM dd, yyyy HH:mm',
                                                )}
                                            </p>
                                        )}
                                        {isLocked && (
                                            <Button
                                                size="sm"
                                                className="mt-2"
                                                onClick={() =>
                                                    setShowScheduleDialog(
                                                        visitNumber,
                                                    )
                                                }
                                            >
                                                <CalendarClock className="mr-2 size-4" />
                                                Schedule This Visit
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        {isLocked ? (
                                            <div className="flex items-center justify-center py-12 text-muted-foreground">
                                                <div className="text-center">
                                                    <Lock className="mx-auto mb-4 size-12" />
                                                    <p className="font-medium">
                                                        Visit Locked
                                                    </p>
                                                    <p className="text-sm">
                                                        Admin needs to schedule
                                                        this visit before you
                                                        can proceed
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {TIMELINE_STAGES.map(
                                                    (stage, index) => {
                                                        const Icon = stage.icon;
                                                        const completed =
                                                            isStageCompleted(
                                                                stage.key,
                                                                visitNumber,
                                                            );
                                                        const isCurrent =
                                                            index ===
                                                                currentStageIndex &&
                                                            !isCompleted;
                                                        const isTicketClosed =
                                                            ticket.status ===
                                                            'Closed';
                                                        const isStageDisabled =
                                                            isCompleted ||
                                                            isTicketClosed ||
                                                            index >
                                                                currentStageIndex;
                                                        const activity =
                                                            getStageActivity(
                                                                stage.key,
                                                                visitNumber,
                                                            );

                                                        return (
                                                            <div
                                                                key={stage.key}
                                                            >
                                                                <div
                                                                    className={`relative flex flex-col gap-4 rounded-lg border-2 p-4 transition-all sm:flex-row ${
                                                                        completed
                                                                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                                                            : isCurrent &&
                                                                                !isTicketClosed
                                                                              ? 'cursor-pointer border-blue-500 bg-blue-50 hover:shadow-md dark:bg-blue-950/20'
                                                                              : isStageDisabled
                                                                                ? 'border-muted bg-muted/30 opacity-50'
                                                                                : 'border-border bg-card'
                                                                    }`}
                                                                    onClick={() =>
                                                                        !isCompleted &&
                                                                        !isTicketClosed &&
                                                                        handleStageClick(
                                                                            stage,
                                                                            index,
                                                                            visitNumber,
                                                                        )
                                                                    }
                                                                    style={{
                                                                        cursor:
                                                                            isCompleted ||
                                                                            isTicketClosed
                                                                                ? 'not-allowed'
                                                                                : undefined,
                                                                    }}
                                                                >
                                                                    {/* Stage Icon */}
                                                                    <div
                                                                        className={`flex size-16 shrink-0 items-center justify-center rounded-full ${stage.color} ${
                                                                            completed
                                                                                ? 'ring-4 ring-green-500/30'
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        {completed ? (
                                                                            <CheckCircle2 className="size-8 text-white" />
                                                                        ) : (
                                                                            <Icon className="size-8 text-white" />
                                                                        )}
                                                                    </div>

                                                                    {/* Stage Content */}
                                                                    <div className="flex-1">
                                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                                            <div>
                                                                                <h3 className="flex items-center gap-2 text-lg font-bold">
                                                                                    {
                                                                                        stage.title
                                                                                    }
                                                                                    {isCurrent &&
                                                                                        !completed && (
                                                                                            <Badge
                                                                                                variant="default"
                                                                                                className="text-xs"
                                                                                            >
                                                                                                Current
                                                                                                Step
                                                                                            </Badge>
                                                                                        )}
                                                                                    {completed && (
                                                                                        <Badge
                                                                                            variant="outline"
                                                                                            className="bg-green-100 text-xs text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                                        >
                                                                                            Completed
                                                                                        </Badge>
                                                                                    )}
                                                                                </h3>
                                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                                    {
                                                                                        stage.description
                                                                                    }
                                                                                </p>
                                                                            </div>

                                                                            {isCurrent &&
                                                                                !completed &&
                                                                                !isStageDisabled && (
                                                                                    <Button size="sm">
                                                                                        Verify
                                                                                    </Button>
                                                                                )}
                                                                        </div>

                                                                        {/* Activity Details if Completed */}
                                                                        {completed &&
                                                                            activity && (
                                                                                <div className="mt-3 rounded-md border bg-background p-3">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="flex-1">
                                                                                            <p className="text-sm font-medium">
                                                                                                {activity.description ||
                                                                                                    'Completed'}
                                                                                            </p>
                                                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                                                {activity
                                                                                                    .user
                                                                                                    ?.name ||
                                                                                                    'Unknown'}{' '}
                                                                                                •{' '}
                                                                                                {format(
                                                                                                    new Date(
                                                                                                        activity.activity_time,
                                                                                                    ),
                                                                                                    'MMM dd, yyyy HH:mm',
                                                                                                )}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                </div>

                                                                {/* Connector Line */}
                                                                {index <
                                                                    TIMELINE_STAGES.length -
                                                                        1 && (
                                                                    <div className="my-2 flex justify-center">
                                                                        <div
                                                                            className={`h-8 w-1 rounded ${
                                                                                completed
                                                                                    ? 'bg-green-500'
                                                                                    : 'bg-border'
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Stage Verification Dialog */}
            <Dialog
                open={currentStageDialog !== null}
                onOpenChange={(open) => !open && setCurrentStageDialog(null)}
            >
                <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{currentStage?.title}</DialogTitle>
                        <DialogDescription>
                            {currentStage?.description}
                        </DialogDescription>
                    </DialogHeader>

                    {currentStageDialog === 'completed' ? (
                        // End Case - Special form with file uploads
                        <form
                            onSubmit={handleCompleteSubmit}
                            className="flex flex-col flex-1 min-h-0"
                        >
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                <FileUploadWithPreview
                                    label="CT Bad Part"
                                    name="ct_bad_part"
                                    accept="image/*"
                                    maxSize={10}
                                    multiple={true}
                                    value={completeForm.data.ct_bad_part}
                                    onChange={(files) =>
                                        completeForm.setData('ct_bad_part', files)
                                    }
                                    error={completeForm.errors.ct_bad_part}
                                    description="Upload images of faulty components (will be converted to WebP)"
                                    existingFiles={ticket.ct_bad_part || []}
                                />

                                <FileUploadWithPreview
                                    label="CT Good Part"
                                    name="ct_good_part"
                                    accept="image/*"
                                    maxSize={10}
                                    multiple={true}
                                    value={completeForm.data.ct_good_part}
                                    onChange={(files) =>
                                        completeForm.setData('ct_good_part', files)
                                    }
                                    error={completeForm.errors.ct_good_part}
                                    description="Upload images of replacement components (will be converted to WebP)"
                                    existingFiles={ticket.ct_good_part || []}
                                />

                                <FileUploadWithPreview
                                    label="BAP (Berita Acara Pekerjaan)"
                                    name="bap_file"
                                    accept="image/*"
                                    maxSize={20}
                                    multiple={true}
                                    value={completeForm.data.bap_file}
                                    onChange={(files) =>
                                        completeForm.setData('bap_file', files)
                                    }
                                    error={completeForm.errors.bap_file}
                                    description="Upload BAP images (will be converted to WebP)"
                                    existingFiles={ticket.bap_file || []}
                                />

                                {/* Consolidated Preview Section */}
                                {(completeForm.data.ct_bad_part.length > 0 || completeForm.data.ct_good_part.length > 0 || completeForm.data.bap_file.length > 0) && (
                                    <div className="mt-6">
                                        <h3 className="text-base font-semibold mb-2">Preview Semua File Sebelum Submit</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {completeForm.data.ct_bad_part.map((file: File, idx: number) => {
                                                const url = URL.createObjectURL(file);
                                                return (
                                                    <div key={file.name + idx} className="relative group border rounded-lg overflow-hidden">
                                                        <img
                                                            src={url}
                                                            alt={file.name}
                                                            className="object-cover w-full h-32 cursor-zoom-in"
                                                            onClick={() => setZoomPreview({ url, label: 'CT Bad Part' })}
                                                        />
                                                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">CT Bad Part</span>
                                                        <button type="button" onClick={() => {
                                                            const files = [...completeForm.data.ct_bad_part];
                                                            files.splice(idx, 1);
                                                            completeForm.setData('ct_bad_part', files);
                                                        }} className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-80 hover:opacity-100">
                                                            <XCircle className="size-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            {completeForm.data.ct_good_part.map((file: File, idx: number) => {
                                                const url = URL.createObjectURL(file);
                                                return (
                                                    <div key={file.name + idx} className="relative group border rounded-lg overflow-hidden">
                                                        <img
                                                            src={url}
                                                            alt={file.name}
                                                            className="object-cover w-full h-32 cursor-zoom-in"
                                                            onClick={() => setZoomPreview({ url, label: 'CT Good Part' })}
                                                        />
                                                        <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">CT Good Part</span>
                                                        <button type="button" onClick={() => {
                                                            const files = [...completeForm.data.ct_good_part];
                                                            files.splice(idx, 1);
                                                            completeForm.setData('ct_good_part', files);
                                                        }} className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-80 hover:opacity-100">
                                                            <XCircle className="size-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            {completeForm.data.bap_file.map((file: File, idx: number) => {
                                                const url = URL.createObjectURL(file);
                                                return (
                                                    <div key={file.name + idx} className="relative group border rounded-lg overflow-hidden">
                                                        <img
                                                            src={url}
                                                            alt={file.name}
                                                            className="object-cover w-full h-32 cursor-zoom-in"
                                                            onClick={() => setZoomPreview({ url, label: 'BAP' })}
                                                        />
                                                        <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">BAP</span>
                                                        <button type="button" onClick={() => {
                                                            const files = [...completeForm.data.bap_file];
                                                            files.splice(idx, 1);
                                                            completeForm.setData('bap_file', files);
                                                        }} className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-80 hover:opacity-100">
                                                            <XCircle className="size-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">Pastikan semua file sudah benar sebelum submit. Klik gambar untuk zoom.</p>
                                    </div>
                                )}

                                {/* Zoom Preview Modal */}
                                <Dialog open={!!zoomPreview} onOpenChange={(open) => !open && setZoomPreview(null)}>
                                    <DialogContent className="max-w-2xl flex flex-col items-center">
                                        {zoomPreview && (
                                            <>
                                                <img src={zoomPreview.url} alt="Preview" className="max-h-[70vh] w-auto rounded-lg mb-4" />
                                                <div className="text-center font-semibold text-base mb-2">{zoomPreview.label}</div>
                                            </>
                                        )}
                                    </DialogContent>
                                </Dialog>

                                <div>
                                    <Label>Completion Notes</Label>
                                    <Textarea
                                        value={completeForm.data.completion_notes}
                                        onChange={(e) =>
                                            completeForm.setData(
                                                'completion_notes',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Add completion notes..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t mt-4 bg-background">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStageDialog(null)}
                                >
                                    Cancel
                                </Button>
                                {ticket.current_visit < 3 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => {
                                            setCurrentStageDialog(null);
                                            setShowRevisitDialog(true);
                                        }}
                                    >
                                        <XCircle className="mr-2 size-4" />
                                        Need Revisit
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={completeForm.processing}
                                >
                                    {completeForm.processing
                                        ? 'Uploading...'
                                        : 'Complete Case'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        // Regular Stage - Simple verification form
                        <form
                            onSubmit={handleActivitySubmit}
                            className="space-y-4"
                        >
                            <div>
                                <Label htmlFor="activity_time">
                                    Activity Time
                                </Label>
                                <Input
                                    id="activity_time"
                                    type="datetime-local"
                                    value={activityForm.data.activity_time}
                                    onChange={(e) =>
                                        activityForm.setData(
                                            'activity_time',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">
                                    Notes (Optional)
                                </Label>
                                <Textarea
                                    id="description"
                                    value={activityForm.data.description}
                                    onChange={(e) =>
                                        activityForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Add any additional notes..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStageDialog(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={activityForm.processing}
                                >
                                    {activityForm.processing
                                        ? 'Verifying...'
                                        : 'Verify'}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Revisit Dialog */}
            <Dialog
                open={showRevisitDialog}
                onOpenChange={setShowRevisitDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Revisit</DialogTitle>
                        <DialogDescription>
                            Provide a reason for why this ticket needs to be
                            revisited
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRevisit} className="space-y-4">
                        <div>
                            <Label htmlFor="reason">Reason for Revisit</Label>
                            <Textarea
                                id="reason"
                                value={revisitForm.data.reason}
                                onChange={(e) =>
                                    revisitForm.setData(
                                        'reason',
                                        e.target.value,
                                    )
                                }
                                placeholder="Explain why this ticket needs another visit..."
                                rows={4}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowRevisitDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={revisitForm.processing}
                            >
                                {revisitForm.processing
                                    ? 'Submitting...'
                                    : 'Request Revisit'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Schedule Visit Dialog */}
            <Dialog
                open={showScheduleDialog !== null}
                onOpenChange={(open) => !open && setShowScheduleDialog(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Schedule Visit {showScheduleDialog}
                        </DialogTitle>
                        <DialogDescription>
                            Set a schedule for this visit to unlock it for the
                            technician
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleScheduleVisit} className="space-y-4">
                        <div>
                            <Label htmlFor="schedule">
                                Schedule Date & Time
                            </Label>
                            <Input
                                id="schedule"
                                type="datetime-local"
                                value={scheduleForm.data.schedule}
                                onChange={(e) =>
                                    scheduleForm.setData(
                                        'schedule',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowScheduleDialog(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={scheduleForm.processing}
                            >
                                {scheduleForm.processing
                                    ? 'Scheduling...'
                                    : 'Schedule Visit'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
