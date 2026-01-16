'use client';

import { Calendar, CalendarPlus, FileText, Users, Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import { ScoutLogo } from '../ScoutLogo';
import { cn } from '@/lib/utils';

const menuItems = [
  { title: 'Início', url: '/', icon: Home },
  { title: 'Eventos', url: '/eventos', icon: Calendar },
  { title: 'Novo Evento', url: '/eventos/novo', icon: CalendarPlus },
  { title: 'Escoteiros', url: '/escoteiros', icon: Users },
  { title: 'Relatórios', url: '/relatorios', icon: FileText }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const pathname = usePathname();

  return (
    <Sidebar collapsible='icon'>
      <div className='p-4 flex items-center justify-center bg-white rounded-lg mx-2 mt-2'>
        <ScoutLogo className={cn('transition-all', collapsed ? 'h-8' : 'h-12')} />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-sidebar-foreground/70'>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url || (item.url !== '/' && pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon className='h-4 w-4' />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip='Sair'>
              <Link href='/auth'>
                <LogOut className='h-4 w-4' />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
