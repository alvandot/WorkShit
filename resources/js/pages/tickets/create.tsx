import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ArrowLeft } from 'lucide-react'
import InputError from '@/components/input-error'
import { FormEventHandler } from 'react'

interface User {
	id: number
	name: string
	email: string
}

interface Props {
	users?: User[]
}

export default function CreateTicket({ users = [] }: Props) {
	const { data, setData, post, processing, errors } = useForm({
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
	})

	const submit: FormEventHandler = (e) => {
		e.preventDefault()
		post('/tickets')
	}

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
						<h1 className="text-3xl font-bold">Create New Ticket</h1>
						<p className="text-muted-foreground mt-1">
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
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
												e.target.value
											)
										}
										placeholder="e.g., 251022005"
										required
									/>
									<InputError message={errors.ticket_number} />
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
												e.target.value
											)
										}
										placeholder="e.g., 5CG24815SF"
									/>
									<InputError message={errors.serial_number} />
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
										className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
											<SelectItem value="Resolved">
												Resolved
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
										className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
									{processing ? 'Creating...' : 'Create Ticket'}
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
	)
}
