import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Pencil, Trash, Clock, User, Building2, Calendar, Download, FileText, Image as ImageIcon } from 'lucide-react'
import { format } from 'date-fns'

interface User {
	id: number
	name: string
	email: string
}

interface StatusHistory {
	id: number
	old_status: string | null
	new_status: string
	changed_by: number | null
	notes: string | null
	created_at: string
	changed_by_user?: User
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
	completion_notes: string | null
	completed_at: string | null
	created_at: string
	updated_at: string
	assigned_to_user?: User
	created_by_user?: User
	status_histories?: StatusHistory[]
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
	Resolved:
		'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
	Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

export default function ShowTicket({ ticket }: Props) {
	const handleDelete = () => {
		if (confirm('Are you sure you want to delete this ticket?')) {
			router.delete(`/tickets/${ticket.id}`)
		}
	}

	const hasAttachments = ticket.ct_bad_part || ticket.ct_good_part || ticket.bap_file

	const getFileIcon = (fileName: string | null) => {
		if (!fileName) return <FileText className="size-5" />

		const ext = fileName.split('.').pop()?.toLowerCase()
		if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
			return <ImageIcon className="size-5" />
		}
		return <FileText className="size-5" />
	}

	const getFileName = (filePath: string | null) => {
		if (!filePath) return ''
		return filePath.split('/').pop() || filePath
	}

	return (
		<AppLayout>
			<Head title={`Ticket #${ticket.ticket_number}`} />

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
									#{ticket.ticket_number}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/tickets">
							<Button variant="outline" size="icon">
								<ArrowLeft className="size-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold">
								Ticket #{ticket.ticket_number}
							</h1>
							<p className="text-muted-foreground mt-1">
								Created{' '}
								{format(
									new Date(ticket.created_at),
									'PPP p'
								)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Link href={`/tickets/${ticket.id}/timeline`}>
							<Button variant="default">
								<Clock className="mr-2 size-4" />
								View Timeline
							</Button>
						</Link>
						<Link href={`/tickets/${ticket.id}/edit`}>
							<Button variant="outline">
								<Pencil className="mr-2 size-4" />
								Edit
							</Button>
						</Link>
						<Button
							variant="destructive"
							onClick={handleDelete}
						>
							<Trash className="mr-2 size-4" />
							Delete
						</Button>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					<div className="md:col-span-2 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Ticket Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-2 gap-6">
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Ticket Number
										</p>
										<p className="text-lg font-semibold mt-1">
											{ticket.ticket_number}
										</p>
									</div>

									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Case ID
										</p>
										<p className="text-lg font-semibold mt-1">
											{ticket.case_id || '-'}
										</p>
									</div>

									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Status
										</p>
										<Badge
											className={`${statusColors[ticket.status]} mt-1`}
											variant="outline"
										>
											{ticket.status}
										</Badge>
									</div>

									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Serial Number
										</p>
										<p className="text-lg font-semibold mt-1">
											{ticket.serial_number || '-'}
										</p>
									</div>
								</div>

								<Separator />

								<div>
									<p className="text-sm font-medium text-muted-foreground mb-2">
										<Building2 className="inline mr-2 size-4" />
										Company
									</p>
									<p className="text-lg">{ticket.company}</p>
								</div>

								<Separator />

								<div>
									<p className="text-sm font-medium text-muted-foreground mb-2">
										Problem Description
									</p>
									<p className="text-base leading-relaxed">
										{ticket.problem}
									</p>
								</div>

								{ticket.notes && (
									<>
										<Separator />
										<div>
											<p className="text-sm font-medium text-muted-foreground mb-2">
												Additional Notes
											</p>
											<p className="text-base leading-relaxed text-muted-foreground">
												{ticket.notes}
											</p>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{ticket.status_histories && ticket.status_histories.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>Status History</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{ticket.status_histories.map((history, index) => (
											<div
												key={history.id}
												className="flex gap-4"
											>
												<div className="flex flex-col items-center">
													<div className="size-2 rounded-full bg-primary" />
													{index !== ticket.status_histories!.length - 1 && (
														<div className="w-px flex-1 bg-border my-1" />
													)}
												</div>
												<div className="flex-1 pb-4">
													<div className="flex items-center gap-2">
														{history.old_status && (
															<Badge
																variant="outline"
																className="text-xs"
															>
																{history.old_status}
															</Badge>
														)}
														{history.old_status && (
															<span className="text-xs text-muted-foreground">→</span>
														)}
														<Badge
															className={statusColors[history.new_status]}
															variant="outline"
														>
															{history.new_status}
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground mt-1">
														{history.changed_by_user?.name || 'System'} •{' '}
														{format(
															new Date(history.created_at),
															'PPP p'
														)}
													</p>
													{history.notes && (
														<p className="text-sm mt-2">
															{history.notes}
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{hasAttachments && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Download className="size-5" />
										Uploaded Files
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{ticket.ct_bad_part && (
											<div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
												<div className="flex items-center gap-3">
													{getFileIcon(ticket.ct_bad_part)}
													<div>
														<p className="font-medium text-sm">CT Bad Part</p>
														<p className="text-xs text-muted-foreground">
															{getFileName(ticket.ct_bad_part)}
														</p>
													</div>
												</div>
												<a
													href={`/tickets/${ticket.id}/download/ct_bad_part`}
													className="inline-flex"
												>
													<Button size="sm" variant="outline">
														<Download className="mr-2 size-4" />
														Download
													</Button>
												</a>
											</div>
										)}

										{ticket.ct_good_part && (
											<div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
												<div className="flex items-center gap-3">
													{getFileIcon(ticket.ct_good_part)}
													<div>
														<p className="font-medium text-sm">CT Good Part</p>
														<p className="text-xs text-muted-foreground">
															{getFileName(ticket.ct_good_part)}
														</p>
													</div>
												</div>
												<a
													href={`/tickets/${ticket.id}/download/ct_good_part`}
													className="inline-flex"
												>
													<Button size="sm" variant="outline">
														<Download className="mr-2 size-4" />
														Download
													</Button>
												</a>
											</div>
										)}

										{ticket.bap_file && (
											<div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
												<div className="flex items-center gap-3">
													{getFileIcon(ticket.bap_file)}
													<div>
														<p className="font-medium text-sm">BAP File</p>
														<p className="text-xs text-muted-foreground">
															{getFileName(ticket.bap_file)}
														</p>
													</div>
												</div>
												<a
													href={`/tickets/${ticket.id}/download/bap_file`}
													className="inline-flex"
												>
													<Button size="sm" variant="outline">
														<Download className="mr-2 size-4" />
														Download
													</Button>
												</a>
											</div>
										)}

										{ticket.completion_notes && (
											<>
												<Separator className="my-4" />
												<div>
													<p className="text-sm font-medium text-muted-foreground mb-2">
														Completion Notes
													</p>
													<p className="text-sm leading-relaxed">
														{ticket.completion_notes}
													</p>
												</div>
											</>
										)}
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Schedule & Deadline</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
										<Calendar className="size-4" />
										Schedule
									</p>
									<p className="text-base mt-1">
										{ticket.schedule
											? format(
													new Date(ticket.schedule),
													'PPP p'
												)
											: 'Not scheduled'}
									</p>
								</div>

								<Separator />

								<div>
									<p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
										<Clock className="size-4" />
										Deadline
									</p>
									<p className="text-base mt-1">
										{ticket.deadline
											? format(
													new Date(ticket.deadline),
													'PPP p'
												)
											: 'No deadline'}
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Assignment</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
										<User className="size-4" />
										Assigned To
									</p>
									<p className="text-base mt-1">
										{ticket.assigned_to_user?.name ||
											'Unassigned'}
									</p>
								</div>

								<Separator />

								<div>
									<p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
										<User className="size-4" />
										Created By
									</p>
									<p className="text-base mt-1">
										{ticket.created_by_user?.name || '-'}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
