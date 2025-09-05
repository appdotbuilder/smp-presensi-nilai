import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, BookOpenCheck, ClipboardList, GraduationCap, Building } from 'lucide-react';
import AppLogo from './app-logo';

const getNavItems = (userRole: string): NavItem[] => {
    const commonItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    const adminItems: NavItem[] = [
        {
            title: 'Data Siswa',
            href: '/students',
            icon: Users,
        },
        {
            title: 'Mata Pelajaran',
            href: '/subjects',
            icon: BookOpenCheck,
        },
        {
            title: 'Kelas',
            href: '/classes',
            icon: Building,
        },
    ];

    const teacherItems: NavItem[] = [
        {
            title: 'Presensi',
            href: '/attendances',
            icon: ClipboardList,
        },
        {
            title: 'Nilai',
            href: '/grades',
            icon: GraduationCap,
        },
    ];

    if (userRole === 'admin') {
        return [...commonItems, ...adminItems, ...teacherItems];
    } else if (userRole === 'guru') {
        return [...commonItems, ...teacherItems];
    }

    return commonItems;
};

const footerNavItems: NavItem[] = [
    {
        title: 'SMP Presensi',
        href: '/',
        icon: Folder,
    },
    {
        title: 'Bantuan',
        href: '#',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const userRole = auth?.user?.role || 'guest';
    const navItems = getNavItems(userRole);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
