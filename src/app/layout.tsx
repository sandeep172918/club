import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
// Removed: import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/layout/main-nav';
import { UserNav } from '@/components/layout/user-nav';
import { AppLogo } from '@/components/layout/app-logo';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
// Removed: import { Bell } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'CP.cpp - Student Progress Tracker',
  description: 'Track coding contest progress for students on Codeforces and CodeChef.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <SidebarProvider defaultOpen>
          <Sidebar collapsible="icon" className="border-r border-sidebar-border">
            <SidebarHeader className="p-4 flex items-center justify-between">
              <AppLogo className="group-data-[collapsible=icon]:hidden" />
               <div className="group-data-[collapsible=icon]:hidden"> {/* Placeholder for dark mode toggle or other actions */}
               </div>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
              <SidebarSeparator />
              <div className="px-4 py-2 group-data-[collapsible=icon]:hidden">
                <Breadcrumbs />
              </div>
            </SidebarContent>
            <SidebarFooter className="p-2">
               <div className="group-data-[collapsible=icon]:hidden w-full">
                 <UserNav />
               </div>
               <div className="hidden group-data-[collapsible=icon]:block mx-auto">
                 <UserNav />
               </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
              <SidebarTrigger className="sm:hidden" />
              <div className="flex-1">
                {/* Breadcrumbs or page title can go here */}
              </div>
              {/* Removed the notification bell and UserNav from here */}
            </header>
            <main className="flex-1 p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
