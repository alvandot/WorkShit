import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
	ArrowLeft,
	FileText,
	Download,
	Clock,
	User,
	Building2,
	Hash,
	Calendar,
	History,
	Activity,
	CheckCircle2,
	AlertCircle,
	Info,
	Phone,
	CalendarClock,
	PackageCheck,
	ClipboardList,
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

interface StatusHistory {
	id: number
	ticket_id: number
	old_status: string | null
	new_status: string
	changed_by: number | null
	notes: string | null
	created_at: string
	changed_by_user?: User
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
	phone_number: string | null
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
	deleted_at: string | null
	assigned_to_user?: User
	created_by_user?: User
	activities: Activity[]
	status_histories: StatusHistory[]
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
	Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

const activityTypeColors: Record<string, string> = {
	received: 'bg-blue-500',
	on_the_way: 'bg-orange-500',
	arrived: 'bg-purple-500',
	start_working: 'bg-indigo-500',
	completed: 'bg-green-500',
}

export default function Detail({ ticket }: Props) {
	return (
		<AppLayout>
			<Head title={`Detail - ${ticket.ticket_number}`} />

			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-start gap-4">
						<Link href="/tickets">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="size-5" />
							</Button>
						</Link>
						<div>
							<div className="flex items-center gap-3 mb-2">
								<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
									Ticket Detail
								</h1>
								<Badge className={statusColors[ticket.status]}>
									{ticket.status}
								</Badge>
							</div>
							<p className="text-muted-foreground">
								Complete information and history for ticket #
								{ticket.ticket_number}
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Link href={`/tickets/${ticket.id}/timeline`}>
							<Button variant="outline">
								<Activity className="mr-2 size-4" />
								View Timeline
							</Button>
						</Link>
						<Link href={`/tickets/${ticket.id}/edit`}>
							<Button>Edit Ticket</Button>
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - Main Info */}
					<div className="lg:col-span-2 space-y-6">
						{/* Basic Information */}
						<Card className="border-2 shadow-lg">
							<CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b">
								<CardTitle className="flex items-center gap-2">
									<FileText className="size-5" />
									Basic Information
								</CardTitle>
								<CardDescription>
									Primary ticket details and metadata
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="grid grid-cols-2 gap-6">
									<div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											Ticket Number
										</p>
										<div className="flex items-center gap-2">
											<Hash className="size-4 text-muted-foreground" />
											<span className="font-mono font-bold text-lg">
												{ticket.ticket_number}
											</span>
										</div>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											Case ID
										</p>
										<div className="flex items-center gap-2">
											<Hash className="size-4 text-muted-foreground" />
											<span className="font-mono">
												{ticket.case_id || (
													<span className="text-muted-foreground italic">
														Not assigned
													</span>
												)}
											</span>
										</div>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											Company
										</p>
										<div className="flex items-center gap-2">
											<Building2 className="size-4 text-muted-foreground" />
											<span className="font-semibold">{ticket.company}</span>
										</div>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											Phone Number
										</p>
										<div className="flex items-center gap-2">
											<Phone className="size-4 text-muted-foreground" />
											<span>
												{ticket.phone_number || (
													<span className="text-muted-foreground italic">
														Not provided
													</span>
												)}
											</span>
										</div>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											Serial Number
										</p>
										<div className="flex items-center gap-2">
											<PackageCheck className="size-4 text-muted-foreground" />
											<span className="font-mono">
												{ticket.serial_number || (
													<span className="text-muted-foreground italic">
														Not provided
													</span>
												)}
											</span>
										</div>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											Current Visit
										</p>
										<div className="flex items-center gap-2">
											<ClipboardList className="size-4 text-muted-foreground" />
											<Badge variant="outline">
												Visit {ticket.current_visit}
											</Badge>
										</div>
									</div>
									<div className="col-span-2">
										<p className="text-sm font-medium text-muted-foreground mb-1">
											Problem Description
										</p>
										<div className="flex gap-2">
											<AlertCircle className="size-4 text-muted-foreground mt-1 shrink-0" />
											<p className="text-base leading-relaxed">
												{ticket.problem}
											</p>
										</div>
									</div>
									{ticket.notes && (
										<div className="col-span-2">
											<p className="text-sm font-medium text-muted-foreground mb-1">
												Notes
											</p>
											<div className="flex gap-2">
												<Info className="size-4 text-muted-foreground mt-1 shrink-0" />
												<p className="text-base leading-relaxed text-muted-foreground">
													{ticket.notes}
												</p>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Schedule & Dates */}
						<Card className="border-2 shadow-lg">
							<CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent border-b">
								<CardTitle className="flex items-center gap-2">
									<Calendar className="size-5" />
									Schedule & Dates
								</CardTitle>
								<CardDescription>
									Important dates and schedules
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="grid grid-cols-2 gap-6">
									<div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											Created At
										</p>
										<div className="flex items-center gap-2">
											<CalendarClock className="size-4 text-muted-foreground" />
											<span>
												{format(
													new Date(ticket.created_at),
													'MMM dd, yyyy HH:mm'
												)}
											</span>
										</div>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											Last Updated
										</p>
										<div className="flex items-center gap-2">
											<CalendarClock className="size-4 text-muted-foreground" />
											<span>
												{format(
													new Date(ticket.updated_at),
													'MMM dd, yyyy HH:mm'
												)}
											</span>
										</div>
									</div>
									{ticket.schedule && (
										<div>
											<p className="text-sm font-medium text-muted-foreground mb-1">
												Scheduled Visit
											</p>
											<div className="flex items-center gap-2">
												<Calendar className="size-4 text-blue-500" />
												<span className="font-semibold">
													{format(
														new Date(ticket.schedule),
														'MMM dd, yyyy HH:mm'
													)}
												</span>
											</div>
										</div>
									)}
									{ticket.deadline && (
										<div>
											<p className="text-sm font-medium text-muted-foreground mb-1">
												Deadline
											</p>
											<div className="flex items-center gap-2">
												<Clock className="size-4 text-red-500" />
												<span className="font-semibold text-red-600 dark:text-red-400">
													{format(
														new Date(ticket.deadline),
														'MMM dd, yyyy HH:mm'
													)}
												</span>
											</div>
										</div>
									)}
									{ticket.completed_at && (
										<div>
											<p className="text-sm font-medium text-muted-foreground mb-1">
												Completed At
											</p>
											<div className="flex items-center gap-2">
												<CheckCircle2 className="size-4 text-green-500" />
												<span className="font-semibold text-green-600 dark:text-green-400">
													{format(
														new Date(ticket.completed_at),
														'MMM dd, yyyy HH:mm'
													)}
												</span>
											</div>
										</div>
									)}
									{ticket.deleted_at && (
										<div>
											<p className="text-sm font-medium text-muted-foreground mb-1">
												Deleted At
											</p>
											<div className="flex items-center gap-2">
												<AlertCircle className="size-4 text-red-500" />
												<span className="font-semibold text-red-600 dark:text-red-400">
													{format(
														new Date(ticket.deleted_at),
														'MMM dd, yyyy HH:mm'
													)}
												</span>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Activities Timeline */}
						<Card className="border-2 shadow-lg">
							<CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent border-b">
								<CardTitle className="flex items-center gap-2">
									<Activity className="size-5" />
									Activity History
								</CardTitle>
								<CardDescription>
									All activities performed on this ticket (
									{ticket.activities.length} total)
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								{ticket.activities.length > 0 ? (
									<div className="space-y-4">
										{ticket.activities
											.sort(
												(a, b) =>
													new Date(b.activity_time).getTime() -
													new Date(a.activity_time).getTime()
											)
											.map((activity) => (
												<div
													key={activity.id}
													className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
												>
													<div
														className={`flex size-12 shrink-0 items-center justify-center rounded-full ${activityTypeColors[activity.activity_type] || 'bg-gray-500'}`}
													>
														<Activity className="size-6 text-white" />
													</div>
													<div className="flex-1">
														<div className="flex items-start justify-between mb-2">
															<div>
																<h4 className="font-bold text-base">
																	{activity.title}
																</h4>
																<p className="text-sm text-muted-foreground">
																	Visit {activity.visit_number} •{' '}
																	{activity.activity_type}
																</p>
															</div>
															<Badge variant="outline" className="shrink-0">
																{format(
																	new Date(activity.activity_time),
																	'MMM dd, HH:mm'
																)}
															</Badge>
														</div>
														{activity.description && (
															<p className="text-sm text-muted-foreground mb-2">
																{activity.description}
															</p>
														)}
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<User className="size-3" />
															<span>
																{activity.user?.name || 'System'}
															</span>
														</div>
													</div>
												</div>
											))}
									</div>
								) : (
									<div className="text-center py-12 text-muted-foreground">
										<Activity className="size-12 mx-auto mb-4 opacity-50" />
										<p className="font-medium">No activities recorded</p>
										<p className="text-sm">
											Activities will appear here as they are added
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Status History */}
						<Card className="border-2 shadow-lg">
							<CardHeader className="bg-gradient-to-r from-green-500/10 to-transparent border-b">
								<CardTitle className="flex items-center gap-2">
									<History className="size-5" />
									Status Change History
								</CardTitle>
								<CardDescription>
									Complete audit trail of status changes (
									{ticket.status_histories.length} changes)
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								{ticket.status_histories.length > 0 ? (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Date & Time</TableHead>
												<TableHead>From</TableHead>
												<TableHead>To</TableHead>
												<TableHead>Changed By</TableHead>
												<TableHead>Notes</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{ticket.status_histories
												.sort(
													(a, b) =>
														new Date(b.created_at).getTime() -
														new Date(a.created_at).getTime()
												)
												.map((history) => (
													<TableRow key={history.id}>
														<TableCell className="font-mono text-sm">
															{format(
																new Date(history.created_at),
																'MMM dd, yyyy HH:mm'
															)}
														</TableCell>
														<TableCell>
															{history.old_status ? (
																<Badge
																	variant="outline"
																	className={
																		statusColors[history.old_status]
																	}
																>
																	{history.old_status}
																</Badge>
															) : (
																<span className="text-muted-foreground italic text-sm">
																	Initial
																</span>
															)}
														</TableCell>
														<TableCell>
															<Badge
																className={
																	statusColors[history.new_status]
																}
															>
																{history.new_status}
															</Badge>
														</TableCell>
														<TableCell>
															{history.changed_by_user?.name || (
																<span className="text-muted-foreground italic text-sm">
																	System
																</span>
															)}
														</TableCell>
														<TableCell className="text-sm text-muted-foreground">
															{history.notes || '-'}
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								) : (
									<div className="text-center py-12 text-muted-foreground">
										<History className="size-12 mx-auto mb-4 opacity-50" />
										<p className="font-medium">No status changes recorded</p>
										<p className="text-sm">
											Status history will appear here
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Completion Documents */}
						{ticket.completed_at &&
							(ticket.ct_bad_part ||
								ticket.ct_good_part ||
								ticket.bap_file) && (
								<Card className="border-2 shadow-lg border-green-500/20">
									<CardHeader className="bg-gradient-to-r from-green-500/10 to-transparent border-b">
										<CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
											<Download className="size-5" />
											Completion Documents
										</CardTitle>
										<CardDescription>
											Files uploaded when completing this ticket
										</CardDescription>
									</CardHeader>
									<CardContent className="pt-6">
										<div className="grid gap-3">
											{ticket.ct_bad_part && (
												<Link
													href={`/tickets/${ticket.id}/download/ct_bad_part`}
													className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/10 transition-all hover:shadow-md"
												>
													<div className="flex items-center gap-3">
														<div className="p-2 bg-red-500/10 rounded-lg">
															<FileText className="size-5 text-red-500" />
														</div>
														<div>
															<p className="font-semibold">CT Bad Part</p>
															<p className="text-xs text-muted-foreground">
																Click to download
															</p>
														</div>
													</div>
													<Download className="size-5 text-muted-foreground" />
												</Link>
											)}
											{ticket.ct_good_part && (
												<Link
													href={`/tickets/${ticket.id}/download/ct_good_part`}
													className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/10 transition-all hover:shadow-md"
												>
													<div className="flex items-center gap-3">
														<div className="p-2 bg-green-500/10 rounded-lg">
															<FileText className="size-5 text-green-500" />
														</div>
														<div>
															<p className="font-semibold">CT Good Part</p>
															<p className="text-xs text-muted-foreground">
																Click to download
															</p>
														</div>
													</div>
													<Download className="size-5 text-muted-foreground" />
												</Link>
											)}
											{ticket.bap_file && (
												<Link
													href={`/tickets/${ticket.id}/download/bap_file`}
													className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/10 transition-all hover:shadow-md"
												>
													<div className="flex items-center gap-3">
														<div className="p-2 bg-blue-500/10 rounded-lg">
															<FileText className="size-5 text-blue-500" />
														</div>
														<div>
															<p className="font-semibold">
																BAP (Berita Acara Pekerjaan)
															</p>
															<p className="text-xs text-muted-foreground">
																Click to download
															</p>
														</div>
													</div>
													<Download className="size-5 text-muted-foreground" />
												</Link>
											)}
										</div>
										{ticket.completion_notes && (
											<div className="mt-4 p-4 bg-muted/50 rounded-lg">
												<p className="text-sm font-medium mb-1">
													Completion Notes:
												</p>
												<p className="text-sm text-muted-foreground">
													{ticket.completion_notes}
												</p>
											</div>
										)}
									</CardContent>
								</Card>
							)}
					</div>

					{/* Right Column - Users & Metadata */}
					<div className="space-y-6">
						{/* Assigned Personnel */}
						<Card className="border-2 shadow-lg">
							<CardHeader className="bg-gradient-to-r from-orange-500/10 to-transparent border-b">
								<CardTitle className="flex items-center gap-2">
									<User className="size-5" />
									Assigned Personnel
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6 space-y-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground mb-2">
										Assigned To
									</p>
									{ticket.assigned_to_user ? (
										<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
											<div className="avatar placeholder">
												<div className="bg-primary text-primary-content rounded-full w-10">
													<span className="text-sm font-bold">
														{ticket.assigned_to_user.name
															.charAt(0)
															.toUpperCase()}
													</span>
												</div>
											</div>
											<div>
												<p className="font-bold">
													{ticket.assigned_to_user.name}
												</p>
												<p className="text-xs text-muted-foreground">
													{ticket.assigned_to_user.email}
												</p>
											</div>
										</div>
									) : (
										<div className="p-3 bg-muted/50 rounded-lg text-center text-muted-foreground italic">
											Not assigned yet
										</div>
									)}
								</div>
								<Separator />
								<div>
									<p className="text-sm font-medium text-muted-foreground mb-2">
										Created By
									</p>
									{ticket.created_by_user ? (
										<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
											<div className="avatar placeholder">
												<div className="bg-secondary text-secondary-content rounded-full w-10">
													<span className="text-sm font-bold">
														{ticket.created_by_user.name
															.charAt(0)
															.toUpperCase()}
													</span>
												</div>
											</div>
											<div>
												<p className="font-bold">
													{ticket.created_by_user.name}
												</p>
												<p className="text-xs text-muted-foreground">
													{ticket.created_by_user.email}
												</p>
											</div>
										</div>
									) : (
										<div className="p-3 bg-muted/50 rounded-lg text-center text-muted-foreground italic">
											Unknown
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Visit Schedules */}
						{ticket.visit_schedules &&
							Object.keys(ticket.visit_schedules).length > 0 && (
								<Card className="border-2 shadow-lg">
									<CardHeader className="bg-gradient-to-r from-indigo-500/10 to-transparent border-b">
										<CardTitle className="flex items-center gap-2">
											<CalendarClock className="size-5" />
											Visit Schedules
										</CardTitle>
										<CardDescription>
											Scheduled visits for this ticket
										</CardDescription>
									</CardHeader>
									<CardContent className="pt-6">
										<div className="space-y-3">
											{Object.entries(ticket.visit_schedules).map(
												([visitNum, schedule]) => (
													<div
														key={visitNum}
														className="p-3 rounded-lg border bg-card"
													>
														<div className="flex items-center justify-between mb-2">
															<span className="font-bold">
																Visit {visitNum}
															</span>
															<Badge
																variant={
																	schedule.status === 'completed'
																		? 'default'
																		: 'outline'
																}
																className={
																	schedule.status === 'completed'
																		? 'bg-green-500'
																		: ''
																}
															>
																{schedule.status}
															</Badge>
														</div>
														{schedule.schedule && (
															<p className="text-sm text-muted-foreground">
																📅{' '}
																{format(
																	new Date(schedule.schedule),
																	'MMM dd, yyyy HH:mm'
																)}
															</p>
														)}
														{schedule.reason && (
															<p className="text-xs text-muted-foreground mt-1">
																Reason: {schedule.reason}
															</p>
														)}
													</div>
												)
											)}
										</div>
									</CardContent>
								</Card>
							)}

						{/* Quick Stats */}
						<Card className="border-2 shadow-lg">
							<CardHeader className="bg-gradient-to-r from-cyan-500/10 to-transparent border-b">
								<CardTitle className="flex items-center gap-2">
									<Info className="size-5" />
									Quick Stats
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6 space-y-3">
								<div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
									<span className="text-sm font-medium">Total Activities</span>
									<Badge variant="secondary" className="font-bold">
										{ticket.activities.length}
									</Badge>
								</div>
								<div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
									<span className="text-sm font-medium">Status Changes</span>
									<Badge variant="secondary" className="font-bold">
										{ticket.status_histories.length}
									</Badge>
								</div>
								<div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
									<span className="text-sm font-medium">Current Visit</span>
									<Badge variant="secondary" className="font-bold">
										{ticket.current_visit}
									</Badge>
								</div>
								<div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
									<span className="text-sm font-medium">Needs Revisit</span>
									<Badge
										variant={ticket.needs_revisit ? 'destructive' : 'default'}
										className={
											!ticket.needs_revisit ? 'bg-green-500' : ''
										}
									>
										{ticket.needs_revisit ? 'Yes' : 'No'}
									</Badge>
								</div>
							</CardContent>
						</Card>

						{/* Raw Data (for debugging) */}
						<Card className="border-2 shadow-lg border-dashed opacity-50 hover:opacity-100 transition-opacity">
							<CardHeader className="bg-gradient-to-r from-gray-500/10 to-transparent border-b">
								<CardTitle className="flex items-center gap-2 text-sm">
									<Info className="size-4" />
									Database ID
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								<p className="text-xs font-mono text-muted-foreground">
									ID: {ticket.id}
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
