
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Trophy, ClipboardCheck, Users, CalendarDays, Library } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/upcoming-contests', label: 'Upcoming Contests', icon: CalendarDays },
  { href: '/resources', label: 'Resources', icon: Library },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href}
              className={cn(
                'w-full justify-start',
                pathname === item.href && 'bg-sidebar-accent text-sidebar-accent-foreground'
              )}
              tooltip={item.label}
            >
              <item.icon className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
