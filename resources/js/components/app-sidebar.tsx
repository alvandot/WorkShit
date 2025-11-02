import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BarChart3,
    Download,
    FileText,
    HelpCircle,
    LayoutDashboard,
    ListChecks,
    MapPin,
    Settings,
    Ticket,
    UserCog,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        items: [
            {
                title: 'Overview',
                href: '/analytics/overview',
            },
            {
                title: 'Trends',
                href: '/analytics/trends',
            },
            {
                title: 'Performance',
                href: '/analytics/performance',
            },
            {
                title: 'Real-time',
                href: '/analytics/realtime',
            },
        ],
    },
];

const ticketingNavItems: NavItem[] = [
    {
        title: 'All Tickets',
        href: '/tickets',
        icon: Ticket,
        items: [
            {
                title: 'All',
                href: '/tickets',
            },
            {
                title: 'Open',
                href: '/tickets?status=Open',
            },
            {
                title: 'In Progress',
                href: '/tickets?status=In Progress',
            },
            {
                title: 'Closed',
                href: '/tickets?status=Closed',
            },
        ],
    },
    {
        title: 'Create Ticket',
        href: '/tickets/create',
        icon: FileText,
    },
    {
        title: 'Assignments',
        href: '/assignments',
        icon: ListChecks,
    },
];

const resourcesNavItems: NavItem[] = [
    {
        title: 'Engineers',
        href: '/engineers',
        icon: UserCog,
        items: [
            {
                title: 'All Engineers',
                href: '/engineers',
            },
            {
                title: 'Add Engineer',
                href: '/engineers/create',
            },
        ],
    },
    {
        title: 'Special Places',
        href: '/special-places',
        icon: MapPin,
        items: [
            {
                title: 'All Locations',
                href: '/special-places',
            },
            {
                title: 'Add Location',
                href: '/special-places/create',
            },
        ],
    },
];

const reportsNavItems: NavItem[] = [
    {
        title: 'Export Data',
        href: '/tickets/export',
        icon: Download,
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
    {
        title: 'Help & Support',
        href: '/help',
        icon: HelpCircle,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <NavMain items={mainNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Ticketing</SidebarGroupLabel>
                    <NavMain items={ticketingNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Resources</SidebarGroupLabel>
                    <NavMain items={resourcesNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Reports</SidebarGroupLabel>
                    <NavMain items={reportsNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>System</SidebarGroupLabel>
                    <NavMain items={settingsNavItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
