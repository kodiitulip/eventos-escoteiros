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
      <div className='flex min-h-screen w-full overflow-hidden'>
        {/* Container da Sidebar - Força 1/4 da largura (aprox 250px-300px em desktops) */}
        <div className='hidden md:block w-1/4 min-w-[250px] max-w-[300px] shrink-0 border-r bg-sidebar relative z-20'>
          <div className='h-full w-full'>
            <AppSidebar />
          </div>
        </div>

        {/* Container do Conteúdo - Ocupa o restante */}
        <div className='flex-1 flex flex-col min-w-0 h-screen overflow-hidden'>
          <header className='h-14 border-b bg-card flex items-center px-4 gap-4 shrink-0'>
            <SidebarTrigger className='text-foreground md:hidden' />
            <div className='flex items-center gap-3'>
              <ScoutLogo className='h-10 w-auto' />
              <span className='font-semibold text-lg hidden sm:inline text-primary'>14º GEABEG</span>
            </div>
          </header>
          <main className='flex-1 p-4 md:p-6 overflow-auto bg-background'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
