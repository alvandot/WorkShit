import { Head, Link, useForm } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	ArrowLeft,
	XCircle,
	FileText,
	Download,
	Clock,
	User,
	Building2,
	Hash,
	Calendar,
	PackageCheck,
	Truck,
	MapPin,
	Wrench,
	Check,
	CheckCircle2,
	Lock,
	CalendarClock,
} from 'lucide-react'
import { format } from 'date-fns'

interface User {
	id: number
	name: string
	email: string
}

interface Activity {
	id: number
	ticket_id: number
	visit_number: number
	activity_type: string
	title: string
	description: string | null
	activity_time: string
	user_id: number | null
	attachments: {
		ct_bad_part?: string
		ct_good_part?: string
		bap_file?: string
	} | null
	user?: User
	created_at: string
}

interface VisitSchedule {
	status: 'pending_schedule' | 'scheduled' | 'in_progress' | 'completed'
	schedule: string | null
	scheduled_by: number | null
	scheduled_at: string | null
	reason: string
}

interface Ticket {
	id: number
	ticket_number: string
	case_id: string | null
	company: string
	serial_number: string | null
	problem: string
	schedule: string | null
	deadline: string | null
	status: string
	assigned_to: number | null
	created_by: number | null
	notes: string | null
	ct_bad_part: string | null
	ct_good_part: string | null
	bap_file: string | null
	needs_revisit: boolean
	current_visit: number
	visit_schedules: Record<number, VisitSchedule> | null
	completion_notes: string | null
	completed_at: string | null
	created_at: string
	updated_at: string
	assigned_to_user?: User
	created_by_user?: User
	activities: Activity[]
}

interface Props {
	ticket: Ticket
}

const statusColors: Record<string, string> = {
	Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
	'Need to Receive':
		'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
	'In Progress':
		'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
	Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
}

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
] as const

export default function Timeline({ ticket }: Props) {
	const [currentStageDialog, setCurrentStageDialog] = useState<string | null>(
		null
	)
	const [showScheduleDialog, setShowScheduleDialog] = useState<number | null>(
		null
	)
	const [showRevisitDialog, setShowRevisitDialog] = useState(false)

	// Get visit suffix
	const getVisitSuffix = (visit: number) => {
		if (visit === 1) return 'First Visit'
		if (visit === 2) return 'Second Visit'
		if (visit === 3) return 'Third Visit'
		return `Visit ${visit}`
	}

	// Calculate total visits (including pending ones)
	const totalVisits = useMemo(() => {
		let count = ticket.current_visit
		if (ticket.visit_schedules) {
			count = Math.max(
				count,
				...Object.keys(ticket.visit_schedules).map(Number)
			)
		}
		return count
	}, [ticket.current_visit, ticket.visit_schedules])

	// Get visit schedule status
	const getVisitStatus = (visitNumber: number) => {
		if (!ticket.visit_schedules || !ticket.visit_schedules[visitNumber]) {
			return visitNumber === 1 ? 'in_progress' : null
		}
		return ticket.visit_schedules[visitNumber].status
	}

	// Check if visit is locked
	const isVisitLocked = (visitNumber: number) => {
		const status = getVisitStatus(visitNumber)
		return status === 'pending_schedule'
	}

	// Check if visit is completed (has all stages done or revisit was requested)
	const isVisitCompleted = (visitNumber: number) => {
		// If there's a newer visit, this visit is completed/disabled
		if (visitNumber < ticket.current_visit) return true

		// Check if this visit has completed status in visit_schedules
		const status = getVisitStatus(visitNumber)
		if (status === 'completed') return true

		// Check if all stages are completed for this visit
		const visitActivities = ticket.activities.filter(
			(a) => a.visit_number === visitNumber
		)
		const completedStages = new Set(visitActivities.map((a) => a.activity_type))

		return TIMELINE_STAGES.every(stage => completedStages.has(stage.key))
	}

	// Get current stage index for a specific visit
	const getCurrentStageIndex = (visitNumber: number) => {
		const visitActivities = ticket.activities.filter(
			(a) => a.visit_number === visitNumber
		)

		const completedStages = new Set(visitActivities.map((a) => a.activity_type))

		// Find the first incomplete stage
		for (let i = 0; i < TIMELINE_STAGES.length; i++) {
			if (!completedStages.has(TIMELINE_STAGES[i].key)) {
				return i
			}
		}

		// All stages completed
		return TIMELINE_STAGES.length
	}

	const isStageCompleted = (stageKey: string, visitNumber: number) => {
		return ticket.activities.some(
			(a) => a.activity_type === stageKey && a.visit_number === visitNumber
		)
	}

	const getStageActivity = (stageKey: string, visitNumber: number) => {
		return ticket.activities.find(
			(a) => a.activity_type === stageKey && a.visit_number === visitNumber
		)
	}

	// Form for regular activities
	const activityForm = useForm({
		activity_type: '',
		title: '',
		description: '',
		activity_time: new Date().toISOString().slice(0, 16),
	})

	// Form for completion (End Case)
	const completeForm = useForm({
		ct_bad_part: null as File | null,
		ct_good_part: null as File | null,
		bap_file: null as File | null,
		completion_notes: '',
	})

	// Form for revisit
	const revisitForm = useForm({
		reason: '',
	})

	// Form for schedule visit
	const scheduleForm = useForm({
		schedule: '',
	})

	const handleStageClick = (
		stage: (typeof TIMELINE_STAGES)[number],
		index: number,
		visitNumber: number
	) => {
		// Don't allow clicking if ticket is closed
		if (ticket.status === 'Closed') return

		// Don't allow clicking if visit is locked
		if (isVisitLocked(visitNumber)) return

		// Don't allow clicking if visit is completed
		if (isVisitCompleted(visitNumber)) return

		// Don't allow clicking completed stages
		if (isStageCompleted(stage.key, visitNumber)) return

		// Only allow clicking the current stage
		if (index !== getCurrentStageIndex(visitNumber)) return

		setCurrentStageDialog(stage.key)

		// Set form values
		activityForm.setData({
			activity_type: stage.key,
			title: stage.title,
			description: '',
			activity_time: new Date().toISOString().slice(0, 16),
		})
	}

	const handleActivitySubmit = (e: React.FormEvent) => {
		e.preventDefault()
		activityForm.post(`/tickets/${ticket.id}/activities`, {
			onSuccess: () => {
				setCurrentStageDialog(null)
				activityForm.reset()
			},
		})
	}

	const handleCompleteSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		completeForm.post(`/tickets/${ticket.id}/complete`, {
			onSuccess: () => {
				setCurrentStageDialog(null)
				completeForm.reset()
			},
		})
	}

	const handleRevisit = (e: React.FormEvent) => {
		e.preventDefault()
		revisitForm.post(`/tickets/${ticket.id}/revisit`, {
			onSuccess: () => {
				setShowRevisitDialog(false)
				revisitForm.reset()
			},
		})
	}

	const handleScheduleVisit = (e: React.FormEvent) => {
		e.preventDefault()
		if (showScheduleDialog === null) return

		scheduleForm.post(
			`/tickets/${ticket.id}/schedule-visit/${showScheduleDialog}`,
			{
				onSuccess: () => {
					setShowScheduleDialog(null)
					scheduleForm.reset()
				},
			}
		)
	}

	const currentStage = TIMELINE_STAGES.find((s) => s.key === currentStageDialog)

	return (
		<AppLayout>
			<Head title={`Timeline - ${ticket.ticket_number}`} />

			<div className="space-y-6">
				{/* Ticket Header */}
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-4">
						<Link href="/tickets">
							<Button variant="ghost" size="icon" className="mt-1">
								<ArrowLeft className="size-5" />
							</Button>
						</Link>
						<div>
							<div className="flex items-center gap-3 mb-3">
								<h1 className="text-3xl font-bold">{ticket.company}</h1>
								<Badge className={statusColors[ticket.status]} variant="outline">
									{ticket.status}
								</Badge>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground font-medium">Ticket Number:</span>
								<div className="badge badge-lg badge-primary badge-outline font-mono font-bold text-base px-4 py-3">
									#{ticket.ticket_number}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Ticket Info */}
					<Card className="lg:col-span-1 border-2 shadow-lg">
						<CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b-2">
							<CardTitle className="flex items-center gap-3 text-xl">
								<div className="p-2 bg-primary rounded-lg">
									<FileText className="size-6 text-primary-content" />
								</div>
								<span>Ticket Information</span>
							</CardTitle>
							<CardDescription className="text-base mt-2">
								Details about this support ticket
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-1 p-0">
							{/* Company */}
							<div className="hover:bg-base-200 transition-colors p-4 border-b">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-secondary/10 rounded-lg">
										<Building2 className="size-5 text-secondary" />
									</div>
									<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</p>
								</div>
								<p className="font-bold text-lg ml-11">{ticket.company}</p>
							</div>

							{/* Case ID */}
							<div className="hover:bg-base-200 transition-colors p-4 border-b">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-accent/10 rounded-lg">
										<Hash className="size-5 text-accent" />
									</div>
									<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Case ID</p>
								</div>
								<div className="ml-11">
									{ticket.case_id ? (
										<span className="badge badge-lg badge-outline badge-primary font-mono font-bold">
											{ticket.case_id}
										</span>
									) : (
										<span className="text-muted-foreground italic">No case ID</span>
									)}
								</div>
							</div>

							{/* Serial Number */}
							<div className="hover:bg-base-200 transition-colors p-4 border-b">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-info/10 rounded-lg">
										<Hash className="size-5 text-info" />
									</div>
									<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Serial Number</p>
								</div>
								<div className="ml-11">
									{ticket.serial_number ? (
										<span className="badge badge-lg badge-outline badge-info font-mono font-bold">
											{ticket.serial_number}
										</span>
									) : (
										<span className="text-muted-foreground italic">Not provided</span>
									)}
								</div>
							</div>

							{/* Problem */}
							<div className="hover:bg-base-200 transition-colors p-4 border-b">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-warning/10 rounded-lg">
										<FileText className="size-5 text-warning" />
									</div>
									<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problem</p>
								</div>
								<p className="font-medium text-base ml-11 leading-relaxed">{ticket.problem}</p>
							</div>

							{/* Assigned To */}
							<div className="hover:bg-base-200 transition-colors p-4 border-b">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-success/10 rounded-lg">
										<User className="size-5 text-success" />
									</div>
									<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned To</p>
								</div>
								<div className="ml-11">
									{ticket.assigned_to_user?.name ? (
										<div className="flex items-center gap-2">
											<div className="avatar placeholder">
												<div className="bg-primary text-primary-content rounded-full w-8">
													<span className="text-xs font-bold">
														{ticket.assigned_to_user.name.charAt(0).toUpperCase()}
													</span>
												</div>
											</div>
											<span className="font-bold text-base">{ticket.assigned_to_user.name}</span>
										</div>
									) : (
										<span className="badge badge-lg badge-ghost">Unassigned</span>
									)}
								</div>
							</div>

							{/* Schedule */}
							{ticket.schedule && (
								<div className="hover:bg-base-200 transition-colors p-4 border-b">
									<div className="flex items-center gap-3 mb-2">
										<div className="p-2 bg-secondary/10 rounded-lg">
											<Calendar className="size-5 text-secondary" />
										</div>
										<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Schedule</p>
									</div>
									<div className="ml-11 flex items-center gap-2">
										<span className="badge badge-lg badge-secondary font-semibold">
											{format(new Date(ticket.schedule), 'MMM dd, yyyy')}
										</span>
										<span className="badge badge-lg badge-outline">
											{format(new Date(ticket.schedule), 'HH:mm')}
										</span>
									</div>
								</div>
							)}

							{/* Deadline */}
							{ticket.deadline && (
								<div className="hover:bg-base-200 transition-colors p-4">
									<div className="flex items-center gap-3 mb-2">
										<div className="p-2 bg-error/10 rounded-lg">
											<Clock className="size-5 text-error" />
										</div>
										<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deadline</p>
									</div>
									<div className="ml-11 flex items-center gap-2">
										<span className="badge badge-lg badge-error font-semibold">
											{format(new Date(ticket.deadline), 'MMM dd, yyyy')}
										</span>
										<span className="badge badge-lg badge-outline">
											{format(new Date(ticket.deadline), 'HH:mm')}
										</span>
									</div>
								</div>
							)}



							{/* Completion Documents */}
							{ticket.completed_at &&
								(ticket.ct_bad_part ||
									ticket.ct_good_part ||
									ticket.bap_file) && (
									<div className="border-t-2 border-dashed pt-4">
										<div className="p-4 bg-success/5 rounded-lg">
											<p className="font-bold text-base flex items-center gap-2 mb-4 text-success">
												<Download className="size-5" />
												Completion Documents
											</p>
											<div className="space-y-2">
												{ticket.ct_bad_part && (
													<Link
														href={`/tickets/${ticket.id}/download/ct_bad_part`}
														className="flex items-center gap-3 p-3 rounded-lg bg-base-100 hover:bg-base-200 transition-all hover:shadow-md border border-base-300"
													>
														<div className="p-2 bg-primary/10 rounded-lg">
															<FileText className="size-5 text-primary" />
														</div>
														<span className="text-sm font-semibold flex-1">CT Bad Part</span>
														<Download className="size-5 text-muted-foreground" />
													</Link>
												)}
												{ticket.ct_good_part && (
													<Link
														href={`/tickets/${ticket.id}/download/ct_good_part`}
														className="flex items-center gap-3 p-3 rounded-lg bg-base-100 hover:bg-base-200 transition-all hover:shadow-md border border-base-300"
													>
														<div className="p-2 bg-success/10 rounded-lg">
															<FileText className="size-5 text-success" />
														</div>
														<span className="text-sm font-semibold flex-1">CT Good Part</span>
														<Download className="size-5 text-muted-foreground" />
													</Link>
												)}
												{ticket.bap_file && (
													<Link
														href={`/tickets/${ticket.id}/download/bap_file`}
														className="flex items-center gap-3 p-3 rounded-lg bg-base-100 hover:bg-base-200 transition-all hover:shadow-md border border-base-300"
													>
														<div className="p-2 bg-accent/10 rounded-lg">
															<FileText className="size-5 text-accent" />
														</div>
														<span className="text-sm font-semibold flex-1">BAP File</span>
														<Download className="size-5 text-muted-foreground" />
													</Link>
												)}
											</div>
										</div>
									</div>
								)}
						</CardContent>
					</Card>

					{/* Timeline - Multiple Visit Panels */}
					<div className="lg:col-span-2 space-y-6">
						{Array.from({ length: totalVisits }, (_, i) => i + 1).map(
							(visitNumber) => {
								const visitStatus = getVisitStatus(visitNumber)
								const isLocked = isVisitLocked(visitNumber)
								const isCompleted = isVisitCompleted(visitNumber)
								const currentStageIndex = getCurrentStageIndex(visitNumber)
								const visitSchedule =
									ticket.visit_schedules?.[visitNumber]

								return (
									<Card
										key={visitNumber}
										className={
											isLocked
												? 'opacity-60 border-dashed border-2'
												: isCompleted
													? 'opacity-70 border-green-500 border-2'
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
														{isCompleted && visitNumber < ticket.current_visit && (
															<CheckCircle2 className="size-5 text-green-500" />
														)}
														{getVisitSuffix(visitNumber)}
													</CardTitle>
													<CardDescription>
														{isLocked
															? 'Waiting for admin to schedule this visit'
															: isCompleted && visitNumber < ticket.current_visit
																? 'This visit has been completed and a new visit was requested'
																: 'Follow the sequential steps to complete this visit'}
													</CardDescription>
												</div>
											<div className="flex items-center gap-2">
												{(() => {
													// Determine actual badge based on visit progress
													const visitActivities = ticket.activities.filter(
														(a) => a.visit_number === visitNumber
													)
													const completedStages = new Set(
														visitActivities.map((a) => a.activity_type)
													)

													// Priority: visit_schedules status > actual progress
													if (visitStatus === 'pending_schedule') {
														return (
															<>
																<Badge variant="secondary">
																	Pending Schedule
																</Badge>
																<Badge variant="destructive" className="animate-pulse">
																	Needs Schedule
																</Badge>
															</>
														)
													}

													if (visitStatus === 'scheduled') {
														return <Badge variant="default">Scheduled</Badge>
													}

													// Find the last completed stage based on TIMELINE_STAGES order
													let lastCompletedStageIndex = -1
													for (let i = TIMELINE_STAGES.length - 1; i >= 0; i--) {
														if (completedStages.has(TIMELINE_STAGES[i].key)) {
															lastCompletedStageIndex = i
															break
														}
													}

													// Show status based on the last completed stage
													if (lastCompletedStageIndex >= 0) {
														const lastStage = TIMELINE_STAGES[lastCompletedStageIndex]

														switch (lastStage.key) {
															case 'completed':
																// Check if this visit was revisited
																if (visitNumber < ticket.current_visit) {
																	return (
																		<Badge variant="default" className="bg-orange-500">
																			Revisit
																		</Badge>
																	)
																}
																return (
																	<Badge variant="default" className="bg-green-500">
																		End Case
																	</Badge>
																)
															case 'start_working':
																return (
																	<Badge variant="default" className="bg-purple-500">
																		On Progress
																	</Badge>
																)
															case 'arrived':
																return (
																	<Badge variant="default" className="bg-indigo-500">
																		Ready To Work
																	</Badge>
																)
															case 'on_the_way':
																return (
																	<Badge variant="default" className="bg-orange-500">
																		Go To Site
																	</Badge>
																)
															case 'received':
																return (
																	<Badge variant="default" className="bg-yellow-500">
																		Need To Received
																	</Badge>
																)
														}
													}

													// Not started
													return <Badge variant="outline">Not Started</Badge>
												})()}
											</div>
										</div>
											{visitSchedule?.reason && (
												<p className="text-sm text-muted-foreground mt-2">
													<strong>Reason:</strong>{' '}
													{visitSchedule.reason}
												</p>
											)}
											{visitSchedule?.schedule && (
												<p className="text-sm text-muted-foreground">
													<strong>Scheduled:</strong>{' '}
													{format(
														new Date(visitSchedule.schedule),
														'MMM dd, yyyy HH:mm'
													)}
												</p>
											)}
											{isLocked && (
												<Button
													size="sm"
													className="mt-2"
													onClick={() =>
														setShowScheduleDialog(visitNumber)
													}
												>
													<CalendarClock className="size-4 mr-2" />
													Schedule This Visit
												</Button>
											)}
										</CardHeader>
										<CardContent>
											{isLocked ? (
												<div className="flex items-center justify-center py-12 text-muted-foreground">
													<div className="text-center">
														<Lock className="size-12 mx-auto mb-4" />
														<p className="font-medium">
															Visit Locked
														</p>
														<p className="text-sm">
															Admin needs to schedule this visit before
															you can proceed
														</p>
													</div>
												</div>
											) : (
												<div className="space-y-4">
													{TIMELINE_STAGES.map((stage, index) => {
														const Icon = stage.icon
														const completed = isStageCompleted(
															stage.key,
															visitNumber
														)
														const isCurrent =
															index === currentStageIndex && !isCompleted
														const isTicketClosed = ticket.status === 'Closed'
														const isStageDisabled =
															isCompleted || isTicketClosed || index > currentStageIndex
														const activity = getStageActivity(
															stage.key,
															visitNumber
														)

														return (
															<div key={stage.key}>
																<div
																	className={`relative flex gap-4 p-4 rounded-lg border-2 transition-all ${
																		completed
																			? 'bg-green-50 dark:bg-green-950/20 border-green-500'
																			: isCurrent && !isTicketClosed
																				? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500 cursor-pointer hover:shadow-md'
																				: isStageDisabled
																					? 'bg-muted/30 border-muted opacity-50'
																					: 'bg-card border-border'
																	}`}
																	onClick={() =>
																		!isCompleted && !isTicketClosed && handleStageClick(
																			stage,
																			index,
																			visitNumber
																		)
																	}
																	style={{ cursor: isCompleted || isTicketClosed ? 'not-allowed' : undefined }}
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
																		<div className="flex items-start justify-between">
																			<div>
																				<h3 className="font-bold text-lg flex items-center gap-2">
																					{stage.title}
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
																							className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
																						>
																							Completed
																						</Badge>
																					)}
																				</h3>
																				<p className="text-sm text-muted-foreground mt-1">
																					{stage.description}
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
																		{completed && activity && (
																			<div className="mt-3 p-3 bg-background rounded-md border">
																				<div className="flex items-center justify-between">
																					<div className="flex-1">
																						<p className="text-sm font-medium">
																							{activity.description ||
																								'Completed'}
																						</p>
																						<p className="text-xs text-muted-foreground mt-1">
																							{activity.user
																								?.name ||
																								'Unknown'}{' '}
																							•{' '}
																							{format(
																								new Date(
																									activity.activity_time
																								),
																								'MMM dd, yyyy HH:mm'
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
																	<div className="flex justify-center my-2">
																		<div
																			className={`w-1 h-8 rounded ${
																				completed
																					? 'bg-green-500'
																					: 'bg-border'
																			}`}
																		/>
																	</div>
																)}
															</div>
														)
													})}
												</div>
											)}
										</CardContent>
									</Card>
								)
							}
						)}
					</div>
				</div>
			</div>

			{/* Stage Verification Dialog */}
			<Dialog
				open={currentStageDialog !== null}
				onOpenChange={(open) => !open && setCurrentStageDialog(null)}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>{currentStage?.title}</DialogTitle>
						<DialogDescription>
							{currentStage?.description}
						</DialogDescription>
					</DialogHeader>

					{currentStageDialog === 'completed' ? (
						// End Case - Special form with file uploads
						<form onSubmit={handleCompleteSubmit} className="space-y-4">
							<div>
								<Label>CT Bad Part</Label>
								<Input
									type="file"
									accept=".jpg,.jpeg,.png,.pdf"
									onChange={(e) =>
										completeForm.setData(
											'ct_bad_part',
											e.target.files?.[0] || null
										)
									}
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Upload image or PDF (max 10MB)
								</p>
							</div>
							<div>
								<Label>CT Good Part</Label>
								<Input
									type="file"
									accept=".jpg,.jpeg,.png,.pdf"
									onChange={(e) =>
										completeForm.setData(
											'ct_good_part',
											e.target.files?.[0] || null
										)
									}
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Upload image or PDF (max 10MB)
								</p>
							</div>
							<div>
								<Label>BAP (Berita Acara Pekerjaan)</Label>
								<Input
									type="file"
									accept=".jpg,.jpeg,.png"
									onChange={(e) =>
										completeForm.setData(
											'bap_file',
											e.target.files?.[0] || null
										)
									}
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Upload image JPG/JPEG/PNG (max 20MB)
								</p>
							</div>
							<div>
								<Label>Completion Notes</Label>
								<Textarea
									value={completeForm.data.completion_notes}
									onChange={(e) =>
										completeForm.setData(
											'completion_notes',
											e.target.value
										)
									}
									placeholder="Add completion notes..."
									rows={4}
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
								{ticket.current_visit < 3 && (
									<Button
										type="button"
										variant="destructive"
										onClick={() => {
											setCurrentStageDialog(null)
											setShowRevisitDialog(true)
										}}
									>
										<XCircle className="mr-2 size-4" />
										Need Revisit
									</Button>
								)}
								<Button type="submit" disabled={completeForm.processing}>
									{completeForm.processing
										? 'Uploading...'
										: 'Complete Case'}
								</Button>
							</div>
						</form>
					) : (
						// Regular Stage - Simple verification form
						<form onSubmit={handleActivitySubmit} className="space-y-4">
							<div>
								<Label htmlFor="activity_time">Activity Time</Label>
								<Input
									id="activity_time"
									type="datetime-local"
									value={activityForm.data.activity_time}
									onChange={(e) =>
										activityForm.setData('activity_time', e.target.value)
									}
								/>
							</div>
							<div>
								<Label htmlFor="description">Notes (Optional)</Label>
								<Textarea
									id="description"
									value={activityForm.data.description}
									onChange={(e) =>
										activityForm.setData('description', e.target.value)
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
								<Button type="submit" disabled={activityForm.processing}>
									{activityForm.processing ? 'Verifying...' : 'Verify'}
								</Button>
							</div>
						</form>
					)}
				</DialogContent>
			</Dialog>

			{/* Revisit Dialog */}
			<Dialog open={showRevisitDialog} onOpenChange={setShowRevisitDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Request Revisit</DialogTitle>
						<DialogDescription>
							Provide a reason for why this ticket needs to be revisited
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleRevisit} className="space-y-4">
						<div>
							<Label htmlFor="reason">Reason for Revisit</Label>
							<Textarea
								id="reason"
								value={revisitForm.data.reason}
								onChange={(e) =>
									revisitForm.setData('reason', e.target.value)
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
							<Button type="submit" disabled={revisitForm.processing}>
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
						<DialogTitle>Schedule Visit {showScheduleDialog}</DialogTitle>
						<DialogDescription>
							Set a schedule for this visit to unlock it for the technician
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleScheduleVisit} className="space-y-4">
						<div>
							<Label htmlFor="schedule">Schedule Date & Time</Label>
							<Input
								id="schedule"
								type="datetime-local"
								value={scheduleForm.data.schedule}
								onChange={(e) =>
									scheduleForm.setData('schedule', e.target.value)
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
							<Button type="submit" disabled={scheduleForm.processing}>
								{scheduleForm.processing
									? 'Scheduling...'
									: 'Schedule Visit'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</AppLayout>
	)
}
