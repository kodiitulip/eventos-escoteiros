'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { ScoutLogo } from '../ScoutLogo';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className='min-h-screen flex w-full'>
        <AppSidebar />
        <div className='flex-1 flex flex-col'>
          <header className='h-14 border-b bg-card flex items-center px-4 gap-4'>
            <SidebarTrigger className='text-foreground' />
            <div className='flex items-center gap-3'>
              <ScoutLogo className='h-10 w-auto' />
              <span className='font-semibold text-lg hidden sm:inline text-primary'>14º GEABEG</span>
            </div>
          </header>
          <main className='flex-1 p-4 md:p-6 overflow-auto'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
