import { NavFooter } from '@/components/nav-footer';
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
import { BookOpen, Folder, LayoutGrid, Ticket, FileText, CheckCircle, Trello, FileSpreadsheet, Hash } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const ticketingNavItems: NavItem[] = [
    {
        title: 'Manage Ticket',
        href: '/tickets',
        icon: Ticket,
        items: [
            {
                title: 'All Open',
                href: '/tickets?status=Open',
            },
            {
                title: 'Closed',
                href: '/tickets?status=Closed',
            },
        ],
    },
    {
        title: 'Request',
        href: '/tickets/request',
        icon: FileText,
    },
    {
        title: 'Confirmed',
        href: '/tickets/confirmed',
        icon: CheckCircle,
    },
    {
        title: 'Trello En',
        href: '/tickets/trello',
        icon: Trello,
    },
    {
        title: 'SP Detil',
        href: '/tickets/sp-detail',
        icon: FileSpreadsheet,
    },
];

const docsNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: '/documentation',
        icon: Hash,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
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
                    <SidebarGroupLabel>MAIN</SidebarGroupLabel>
                    <NavMain items={mainNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>TICKETING</SidebarGroupLabel>
                    <NavMain items={ticketingNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>DOCS</SidebarGroupLabel>
                    <NavMain items={docsNavItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
