import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
	CheckCircle,
	XCircle,
	Plus,
	FileText,
	Download,
	Clock,
	User,
	Building2,
	Hash,
	Calendar,
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
	'Need to Receive': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
	'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
	Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
	Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

const activityTypeColors: Record<string, string> = {
	received: 'bg-blue-500',
	on_the_way: 'bg-indigo-500',
	arrived: 'bg-purple-500',
	start_working: 'bg-yellow-500',
	need_part: 'bg-orange-500',
	completed: 'bg-green-500',
	revisit: 'bg-red-500',
	status_change: 'bg-gray-500',
	note: 'bg-slate-500',
}

const activityTypeLabels: Record<string, string> = {
	received: 'Received Ticket',
	on_the_way: 'On The Way',
	arrived: "It's Arrived",
	start_working: 'Start Working',
	need_part: 'Need a Part',
	completed: 'Work Completed',
	revisit: 'Revisit Required',
	status_change: 'Status Changed',
	note: 'Note Added',
}

export default function Timeline({ ticket }: Props) {
	const [showCompleteDialog, setShowCompleteDialog] = useState(false)
	const [showRevisitDialog, setShowRevisitDialog] = useState(false)
	const [showAddActivityDialog, setShowAddActivityDialog] = useState(false)

	const completeForm = useForm({
		ct_bad_part: null as File | null,
		ct_good_part: null as File | null,
		bap_file: null as File | null,
		completion_notes: '',
	})

	const revisitForm = useForm({
		reason: '',
	})

	const activityForm = useForm({
		activity_type: 'received',
		title: '',
		description: '',
		activity_time: new Date().toISOString().slice(0, 16),
	})

	const handleComplete = (e: React.FormEvent) => {
		e.preventDefault()
		completeForm.post(`/tickets/${ticket.id}/complete`, {
			onSuccess: () => {
				setShowCompleteDialog(false)
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

	const handleAddActivity = (e: React.FormEvent) => {
		e.preventDefault()
		activityForm.post(`/tickets/${ticket.id}/activities`, {
			onSuccess: () => {
				setShowAddActivityDialog(false)
				activityForm.reset()
			},
		})
	}

	return (
		<AppLayout>
			<Head title={`Timeline - ${ticket.ticket_number}`} />

			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/tickets">
							<Button variant="outline" size="icon">
								<ArrowLeft className="size-4" />
							</Button>
						</Link>
						<div>
							<div className="flex items-center gap-3">
								<h1 className="text-3xl font-bold">
									TIMELINE ACTIVITY
								</h1>
								<Badge
									className={statusColors[ticket.status]}
									variant="outline"
								>
									{ticket.status}
								</Badge>
							</div>
							<p className="text-muted-foreground mt-1">
								{ticket.ticket_number}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Dialog
							open={showAddActivityDialog}
							onOpenChange={setShowAddActivityDialog}
						>
							<DialogTrigger asChild>
								<Button variant="outline">
									<Plus className="mr-2 size-4" />
									Add Activity
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add Timeline Activity</DialogTitle>
									<DialogDescription>
										Record a new activity or update for this ticket
									</DialogDescription>
								</DialogHeader>
								<form onSubmit={handleAddActivity} className="space-y-4">
									<div>
										<Label>Activity Type</Label>
										<select
											className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
											value={activityForm.data.activity_type}
											onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
												activityForm.setData(
													'activity_type',
													e.target.value
												)
											}
										>
											<option value="received">Received Ticket</option>
											<option value="on_the_way">On The Way</option>
											<option value="arrived">It's Arrived</option>
											<option value="start_working">Start Working</option>
											<option value="need_part">Need a Part</option>
											<option value="note">Note</option>
										</select>
									</div>
									<div>
										<Label>Title</Label>
										<Input
											value={activityForm.data.title}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												activityForm.setData('title', e.target.value)
											}
											placeholder="Activity title"
											required
										/>
									</div>
									<div>
										<Label>Description</Label>
										<Textarea
											value={activityForm.data.description}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
												activityForm.setData(
													'description',
													e.target.value
												)
											}
											placeholder="Activity description"
										/>
									</div>
									<div>
										<Label>Activity Time</Label>
										<Input
											type="datetime-local"
											value={activityForm.data.activity_time}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												activityForm.setData(
													'activity_time',
													e.target.value
												)
											}
											required
										/>
									</div>
									<div className="flex justify-end gap-2">
										<Button
											type="button"
											variant="outline"
											onClick={() => setShowAddActivityDialog(false)}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											disabled={activityForm.processing}
										>
											Add Activity
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>

						{!ticket.completed_at && ticket.status !== 'Closed' && (
							<>
								<Dialog
									open={showRevisitDialog}
									onOpenChange={setShowRevisitDialog}
								>
									<DialogTrigger asChild>
										<Button variant="outline" className="text-red-600">
											<XCircle className="mr-2 size-4" />
											Revisit
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Mark for Revisit</DialogTitle>
											<DialogDescription>
												Indicate that this ticket requires additional attention or a follow-up visit
											</DialogDescription>
										</DialogHeader>
										<form onSubmit={handleRevisit} className="space-y-4">
											<div>
												<Label>Reason for Revisit</Label>
												<Textarea
													value={revisitForm.data.reason}
													onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
														revisitForm.setData(
															'reason',
															e.target.value
														)
													}
													placeholder="Explain why this ticket needs a revisit..."
													required
												/>
												{revisitForm.errors.reason && (
													<p className="text-sm text-red-600 mt-1">
														{revisitForm.errors.reason}
													</p>
												)}
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
													variant="destructive"
													disabled={revisitForm.processing}
												>
													Mark for Revisit
												</Button>
											</div>
										</form>
									</DialogContent>
								</Dialog>

								<Dialog
									open={showCompleteDialog}
									onOpenChange={setShowCompleteDialog}
								>
									<DialogTrigger asChild>
										<Button>
											<CheckCircle className="mr-2 size-4" />
											Complete Work
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-2xl">
										<DialogHeader>
											<DialogTitle>Complete Ticket Work</DialogTitle>
											<DialogDescription>
												Upload completion documents and finalize this ticket
											</DialogDescription>
										</DialogHeader>
										<form onSubmit={handleComplete} className="space-y-4">
											<div>
												<Label>CT Bad Part</Label>
												<Input
													type="file"
													accept=".jpg,.jpeg,.png,.pdf"
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
													accept=".pdf,.doc,.docx"
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
														completeForm.setData(
															'bap_file',
															e.target.files?.[0] || null
														)
													}
												/>
												<p className="text-xs text-muted-foreground mt-1">
													Upload PDF or Word document (max 10MB)
												</p>
											</div>
											<div>
												<Label>Completion Notes</Label>
												<Textarea
													value={completeForm.data.completion_notes}
													onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
														completeForm.setData(
															'completion_notes',
															e.target.value
														)
													}
													placeholder="Add completion notes..."
												/>
											</div>
											<div className="flex justify-end gap-2">
												<Button
													type="button"
													variant="outline"
													onClick={() => setShowCompleteDialog(false)}
												>
													Cancel
												</Button>
												<Button
													type="submit"
													disabled={completeForm.processing}
												>
													{completeForm.processing
														? 'Uploading...'
														: 'Complete Ticket'}
												</Button>
											</div>
										</form>
									</DialogContent>
								</Dialog>
							</>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Ticket Info */}
					<Card className="lg:col-span-1">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="size-5" />
								Ticket Information
							</CardTitle>
							<CardDescription>
								Details about this support ticket
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-start gap-3">
								<Building2 className="size-4 mt-1 text-muted-foreground" />
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Company</p>
									<p className="font-medium">{ticket.company}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Hash className="size-4 mt-1 text-muted-foreground" />
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Case ID</p>
									<p className="font-medium">{ticket.case_id || '-'}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Hash className="size-4 mt-1 text-muted-foreground" />
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Serial Number</p>
									<p className="font-medium">{ticket.serial_number || '-'}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<FileText className="size-4 mt-1 text-muted-foreground" />
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Problem</p>
									<p className="font-medium text-sm">{ticket.problem}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<User className="size-4 mt-1 text-muted-foreground" />
								<div className="flex-1">
									<p className="text-sm text-muted-foreground">Assigned To</p>
									<p className="font-medium">
										{ticket.assigned_to_user?.name || 'Unassigned'}
									</p>
								</div>
							</div>
							{ticket.schedule && (
								<div className="flex items-start gap-3">
									<Calendar className="size-4 mt-1 text-muted-foreground" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Schedule</p>
										<p className="font-medium text-sm">
											{format(
												new Date(ticket.schedule),
												'MMM dd, yyyy HH:mm'
											)}
										</p>
									</div>
								</div>
							)}
							{ticket.deadline && (
								<div className="flex items-start gap-3">
									<Clock className="size-4 mt-1 text-muted-foreground" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Deadline</p>
										<p className="font-medium text-sm">
											{format(
												new Date(ticket.deadline),
												'MMM dd, yyyy HH:mm'
											)}
										</p>
									</div>
								</div>
							)}

							{/* Completion Documents */}
							{ticket.completed_at && (
								<>
									<Separator className="my-4" />
									<div className="space-y-3">
										<p className="font-semibold flex items-center gap-2">
											<Download className="size-4" />
											Completion Documents
										</p>
										{ticket.ct_bad_part && (
											<a
												href={`/storage/${ticket.ct_bad_part}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
											>
												<FileText className="size-4" />
												CT Bad Part
											</a>
										)}
										{ticket.ct_good_part && (
											<a
												href={`/storage/${ticket.ct_good_part}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
											>
												<FileText className="size-4" />
												CT Good Part
											</a>
										)}
										{ticket.bap_file && (
											<a
												href={`/storage/${ticket.bap_file}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
											>
												<FileText className="size-4" />
												BAP Document
											</a>
										)}
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{/* Timeline */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle>Activity Timeline</CardTitle>
							<CardDescription>
								Chronological history of all ticket activities
							</CardDescription>
						</CardHeader>
						<CardContent>
							{ticket.activities.length === 0 ? (
								<div className="text-center py-12 text-muted-foreground">
									<p>No activities recorded yet</p>
								</div>
							) : (
								<ScrollArea className="h-[600px] pr-4">
									<div className="relative">
										{/* Timeline Line */}
										<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

										{/* Activities */}
										<div className="space-y-6">
											{ticket.activities.map((activity) => (
												<div key={activity.id} className="relative flex gap-4">
													{/* Timeline Dot */}
													<div
														className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full ${
															activityTypeColors[
																activity.activity_type
															] || 'bg-gray-500'
														}`}
													>
														<div className="size-3 rounded-full bg-white" />
													</div>

													{/* Activity Content */}
													<div className="flex-1 pb-6">
														<div className="rounded-lg border bg-card p-4">
															<div className="flex items-start justify-between gap-4">
																<div className="flex-1">
																	<h3 className="font-semibold">
																		{activity.title}
																	</h3>
																	<p className="text-sm text-muted-foreground mt-1">
																		{format(
																			new Date(
																				activity.activity_time
																			),
																			'MMM dd, yyyy HH:mm'
																		)}
																	</p>
																	{activity.description && (
																		<p className="mt-2 text-sm">
																			{activity.description}
																		</p>
																	)}
																{activity.user && (
																	<p className="text-xs text-muted-foreground mt-2">
																		By: {activity.user.name}
																	</p>
																)}

																{/* Attachments */}
																{activity.attachments && (
																	<div className="mt-3 space-y-2">
																		{activity.attachments
																			.ct_bad_part && (
																			<a
																				href={`/storage/${activity.attachments.ct_bad_part}`}
																				target="_blank"
																				rel="noopener noreferrer"
																				className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
																			>
																				<Download className="size-3" />
																				CT Bad Part
																			</a>
																		)}
																		{activity.attachments
																			.ct_good_part && (
																			<a
																				href={`/storage/${activity.attachments.ct_good_part}`}
																				target="_blank"
																				rel="noopener noreferrer"
																				className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
																			>
																				<Download className="size-3" />
																				CT Good Part
																			</a>
																		)}
																		{activity.attachments
																			.bap_file && (
																			<a
																				href={`/storage/${activity.attachments.bap_file}`}
																				target="_blank"
																				rel="noopener noreferrer"
																				className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
																			>
																				<FileText className="size-3" />
																				BAP Document
																			</a>
																		)}
																	</div>
																)}
															</div>
															<Badge variant="outline">
																{activityTypeLabels[
																	activity.activity_type
																] || activity.activity_type}
															</Badge>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
								</ScrollArea>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</AppLayout>
	)
}
