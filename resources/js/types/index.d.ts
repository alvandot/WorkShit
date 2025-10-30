import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Ticket {
    id: number;
    ticket_number: string;
    case_id: string | null;
    company: string;
    address: string | null;
    phone_number: string | null;
    serial_number: string | null;
    product_number: string | null;
    problem: string;
    schedule: string | null;
    deadline: string | null;
    status: 'Open' | 'Need to Receive' | 'In Progress' | 'Finish' | 'Closed';
    assigned_to: number | null;
    assigned_at: string | null;
    assigned_by: number | null;
    created_by: number | null;
    notes: string | null;
    ct_bad_part: string | null;
    ct_good_part: string | null;
    bap_file: string | null;
    needs_revisit: boolean;
    current_visit: number;
    visit_schedules: VisitSchedule[] | null;
    completion_notes: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    assigned_to_user?: User;
    assigned_by_user?: User;
    created_by_user?: User;
}

export interface VisitSchedule {
    visit_number: number;
    scheduled_date: string;
    status: 'pending' | 'completed' | 'cancelled';
    completed_at?: string;
    notes?: string;
}

export interface TicketAssignment {
    id: number;
    ticket_id: number;
    assigned_to: number;
    assigned_by: number;
    assigned_at: string;
    unassigned_at: string | null;
    unassigned_by: number | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    ticket?: Ticket;
    assigned_to_user?: User;
    assigned_by_user?: User;
    unassigned_by_user?: User;
}

export interface EngineerStats {
    id: number;
    name: string;
    email: string;
    active_tickets_count: number;
    total_tickets_count: number;
    completed_tickets_count: number;
}

export interface AssignmentFilters {
    engineer_id?: number | null;
    date_from?: string | null;
    date_to?: string | null;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
