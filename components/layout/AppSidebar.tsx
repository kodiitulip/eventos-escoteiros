'use client';

import { Calendar, FileText, Users, Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ScoutLogoX256 } from '../scout-logo';

const menuItems = [
  { title: 'Início', url: '/', icon: Home },
  { title: 'Eventos', url: '/eventos', icon: Calendar },
  { title: 'Escoteiros', url: '/escoteiros', icon: Users },
  // { title: 'Relatórios', url: '/relatorios', icon: FileText }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const pathname = usePathname();

  return (
    <Sidebar collapsible='icon'>
      <ScoutLogoX256 className={cn('transition-all mx-auto my-4', collapsed ? 'size-8' : 'size-20')} />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-sidebar-foreground/70'>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ url, title, icon: Icon }) => {
                const isActive = pathname === url || (url !== '/' && pathname.startsWith(url));

                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={title}>
                      <Link href={url}>
                        <Icon className='h-4 w-4' />
                        <span>{title}</span>
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
              tooltip='Sair'
              onClick={() => {
                signOut(auth);
              }}>
              <LogOut size={16} />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
