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
    FileText,
    HelpCircle,
    LayoutDashboard,
    Settings,
    Ticket,
    Users,
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
    },
];

const ticketingNavItems: NavItem[] = [
    {
        title: 'Manage Tickets',
        href: '/tickets',
        icon: Ticket,
        items: [
            {
                title: 'Open',
                href: '/tickets?status=open',
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
        icon: Users,
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
