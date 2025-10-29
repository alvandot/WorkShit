import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreVertical, Eye, Pencil, Trash, Download, Filter, FileText } from 'lucide-react'
import { format } from 'date-fns'

interface User {
	id: number
	name: string
	email: string
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
	created_at: string
	updated_at: string
	assigned_to_user?: User
	created_by_user?: User
}

interface PaginationLink {
	url: string | null
	label: string
	active: boolean
}

interface PaginatedTickets {
	data: Ticket[]
	current_page: number
	last_page: number
	per_page: number
	total: number
	links: PaginationLink[]
}

interface Props {
	tickets: PaginatedTickets
	filters: {
		search?: string
		status?: string
	}
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

export default function TicketsIndex({ tickets, filters }: Props) {
	const [search, setSearch] = useState(filters.search || '')
	const [status, setStatus] = useState(filters.status || 'all')

	const handleSearch = (value: string) => {
		setSearch(value)
		router.get(
			'/tickets',
			{ search: value, status },
			{ preserveState: true, replace: true }
		)
	}

	const handleStatusFilter = (value: string) => {
		setStatus(value)
		router.get(
			'/tickets',
			{ search, status: value === 'all' ? undefined : value },
			{ preserveState: true, replace: true }
		)
	}

	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this ticket?')) {
			router.delete(`/tickets/${id}`)
		}
	}

	return (
		<AppLayout>
			<Head title="Manage Tickets" />

			<div className="space-y-8">
				{/* Header Section */}
				<div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20">
					<div className="space-y-2">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							MANAGE TICKET
						</h1>
						<p className="text-muted-foreground text-sm">
							View and manage all support tickets
						</p>
					</div>
					<div className="flex items-center gap-3">
						<a href="/tickets/export">
							<Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
								<Download className="mr-2 size-4" />
								Export Excel
							</Button>
						</a>
						<Link href="/tickets/create">
							<Button className="shadow-lg hover:shadow-xl transition-shadow">
								<Plus className="mr-2 size-4" />
								Create Ticket
							</Button>
						</Link>
					</div>
				</div>

				{/* Filter Section */}
				<div className="flex items-center gap-6 p-5 bg-card rounded-xl border shadow-sm">
					<div className="flex items-center gap-3">
						<span className="text-sm font-medium text-muted-foreground">Show</span>
						<Select defaultValue="10">
							<SelectTrigger className="w-24 shadow-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="25">25</SelectItem>
								<SelectItem value="50">50</SelectItem>
								<SelectItem value="100">100</SelectItem>
							</SelectContent>
						</Select>
						<span className="text-sm font-medium text-muted-foreground">entries</span>
					</div>

					<div className="flex-1" />

					<div className="flex items-center gap-3">
						<Filter className="size-4 text-muted-foreground" />
						<Select value={status} onValueChange={handleStatusFilter}>
							<SelectTrigger className="w-52 shadow-sm">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="Open">Open</SelectItem>
								<SelectItem value="Need to Receive">
									Need to Receive
								</SelectItem>
								<SelectItem value="In Progress">
									In Progress
								</SelectItem>
								<SelectItem value="Resolved">Resolved</SelectItem>
								<SelectItem value="Closed">Closed</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Input
						type="search"
						placeholder="Search tickets..."
						value={search}
						onChange={(e) => handleSearch(e.target.value)}
						className="w-72 shadow-sm"
					/>
				</div>

				{/* Table Section */}
				<div className="rounded-xl border bg-card shadow-lg overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/50 hover:bg-muted/50">
								<TableHead className="w-20 font-bold text-foreground">NO</TableHead>
								<TableHead className="font-bold text-foreground">NO TICKET</TableHead>
								<TableHead className="font-bold text-foreground">CASE ID</TableHead>
								<TableHead className="font-bold text-foreground">COMPANY</TableHead>
								<TableHead className="font-bold text-foreground">PROBLEM</TableHead>
								<TableHead className="font-bold text-foreground">SCHEDULE</TableHead>
								<TableHead className="font-bold text-foreground">STATUS</TableHead>
								<TableHead className="w-20 font-bold text-foreground text-center">OPTION</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tickets.data.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className="text-center py-12 text-muted-foreground"
									>
										<div className="flex flex-col items-center gap-3">
											<div className="p-4 rounded-full bg-muted">
												<Filter className="size-8 text-muted-foreground" />
											</div>
											<p className="text-lg font-medium">No tickets found</p>
											<p className="text-sm">Try adjusting your search or filter to find what you're looking for.</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								tickets.data.map((ticket, index) => (
									<TableRow
										key={ticket.id}
										className="cursor-pointer hover:bg-primary/5 transition-colors border-b last:border-0"
										onClick={() => router.visit(`/tickets/${ticket.id}/timeline`)}
									>
										<TableCell className="font-medium text-muted-foreground">
											{(tickets.current_page - 1) *
												tickets.per_page +
												index +
												1}
										</TableCell>
										<TableCell className="font-semibold text-primary">
											{ticket.ticket_number}
										</TableCell>
										<TableCell className="font-medium">
											{ticket.case_id ? (
												<span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
													{ticket.case_id}
												</span>
											) : (
												<span className="text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell className="font-medium">{ticket.company}</TableCell>
										<TableCell className="max-w-sm">
											<div className="truncate text-sm" title={ticket.problem}>
												{ticket.problem}
											</div>
										</TableCell>
										<TableCell>
											{ticket.schedule ? (
												<div className="flex flex-col gap-1">
													<span className="text-sm font-medium">
														{format(new Date(ticket.schedule), 'dd MMM yyyy')}
													</span>
													<span className="text-xs text-muted-foreground">
														{format(new Date(ticket.schedule), 'HH:mm')}
													</span>
												</div>
											) : (
												<span className="text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell>
											<Badge
												className={`${statusColors[ticket.status]} font-semibold px-3 py-1 shadow-sm`}
												variant="outline"
											>
												{ticket.status}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="hover:bg-primary/10 hover:text-primary transition-colors"
														>
															<MoreVertical className="size-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-48">
														<DropdownMenuItem asChild>
															<Link
																href={`/tickets/${ticket.id}/detail`}
																className="cursor-pointer"
															>
																<FileText className="mr-2 size-4" />
																Detail Lengkap
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link
																href={`/tickets/${ticket.id}`}
																className="cursor-pointer"
															>
																<Eye className="mr-2 size-4" />
																View Ticket
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link
																href={`/tickets/${ticket.id}/edit`}
																className="cursor-pointer"
															>
																<Pencil className="mr-2 size-4" />
																Edit Ticket
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleDelete(
																	ticket.id
																)
															}
															className="text-destructive focus:text-destructive cursor-pointer"
														>
															<Trash className="mr-2 size-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination Section */}
				{tickets.last_page > 1 && (
					<div className="flex items-center justify-between p-5 bg-card rounded-xl border shadow-sm">
						<p className="text-sm font-medium text-muted-foreground">
							Showing <span className="font-bold text-foreground">{(tickets.current_page - 1) * tickets.per_page + 1}</span> to{' '}
							<span className="font-bold text-foreground">
								{Math.min(
									tickets.current_page * tickets.per_page,
									tickets.total
								)}
							</span>{' '}
							of <span className="font-bold text-foreground">{tickets.total}</span> entries
						</p>

						<div className="flex items-center gap-2">
							{tickets.links.map((link, index) => {
								if (link.label === '&laquo; Previous') {
									return (
										<Button
											key={index}
											variant="outline"
											size="sm"
											disabled={!link.url}
											onClick={() =>
												link.url && router.get(link.url)
											}
											className="shadow-sm hover:shadow-md transition-shadow"
										>
											Previous
										</Button>
									)
								}

								if (link.label === 'Next &raquo;') {
									return (
										<Button
											key={index}
											variant="outline"
											size="sm"
											disabled={!link.url}
											onClick={() =>
												link.url && router.get(link.url)
											}
											className="shadow-sm hover:shadow-md transition-shadow"
										>
											Next
										</Button>
									)
								}

								return (
									<Button
										key={index}
										variant={
											link.active ? 'default' : 'outline'
										}
										size="sm"
										disabled={!link.url}
										onClick={() =>
											link.url && router.get(link.url)
										}
										className={link.active ? 'shadow-lg' : 'shadow-sm hover:shadow-md transition-shadow'}
									>
										{link.label}
									</Button>
								)
							})}
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	)
}
