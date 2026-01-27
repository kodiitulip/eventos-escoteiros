'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { ScoutLogoX128 } from '../scout-logo';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
              <ScoutLogoX128 className='h-10 w-auto' />
              <span className='font-semibold text-lg hidden sm:inline text-primary'>14º GEABEG</span>
            </div>

            <div className='ml-auto'>
              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-muted-foreground'>
                        <Info className='h-5 w-5' />
                        <span className='sr-only'>Créditos</span>
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Créditos</p>
                  </TooltipContent>
                </Tooltip>
                <DialogContent className='data-[state=open]:slide-in-from-bottom-full data-[state=open]:slide-in-from-top-auto data-[state=closed]:slide-out-to-bottom-full data-[state=closed]:slide-out-to-top-auto'>
                  <DialogHeader>
                    <DialogTitle>Créditos</DialogTitle>
                    <DialogDescription>Equipe responsável pelo projeto.</DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4'>
                    <ul className='space-y-3 pt-2 text-sm'>
                      <li className='flex items-center gap-2'>
                        <span className='h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                        <span>
                          <span className='font-semibold'>Luisa Pinheiro:</span> Product Owner
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                        <span>
                          <span className='font-semibold'>Maria Eduarda:</span> Scrum Master
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                        <span>
                          <span className='font-semibold'>Shayane Soares:</span> UI / Ux Designer
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                        <span>
                          <span className='font-semibold'>Kodie Freitas:</span> Desenvolvedor
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                        <span>
                          <span className='font-semibold'>Gabriel Melo:</span> Desenvolvedor
                        </span>
                      </li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>
          <main className='flex-1 p-4 md:p-6 overflow-auto bg-background'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
