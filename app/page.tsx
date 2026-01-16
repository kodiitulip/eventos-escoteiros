'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, FileText, TrendingUp, CalendarPlus, LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from './providers/auth-provider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  // TODO: remove placeholder
  const stats = {
    totalEvents: 12,
    upcomingEvents: 3,
    totalScouts: 48,
    pendingPayments: 15
  };

  if (loading)
    return (
      <AppLayout>
        <div className='absolute inset-1/2'>
          <LoaderIcon
            className='animate-spin'
            size={40}
          />
          <span className='sr-only'>Carregando</span>
        </div>
      </AppLayout>
    );

  if (!user) return null;

  return (
    <AppLayout>
      <div className='space-y-6 animate-fade-in'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Bem-vindo ao Sistema de Eventos</h1>
            <p className='text-muted-foreground mt-1'>
              Gerencie eventos, pagamentos e presenças do seu grupo escoteiro.
            </p>
          </div>
          <Button asChild>
            <Link href='/eventos/novo'>
              <CalendarPlus className='mr-2 h-4 w-4' />
              Novo Evento
            </Link>
          </Button>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total de Eventos</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.totalEvents}</div>
              <p className='text-xs text-muted-foreground'>{stats.upcomingEvents} próximos eventos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Escoteiros Ativos</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.totalScouts}</div>
              <p className='text-xs text-muted-foreground'>Em todos os ramos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pagamentos Pendentes</CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-warning'>{stats.pendingPayments}</div>
              <p className='text-xs text-muted-foreground'>Aguardando confirmação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Relatórios</CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <Button
                variant='outline'
                size='sm'
                asChild
                className='w-full'>
                <Link href='/relatorios'>Ver Relatórios</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Eventos agendados para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground text-center py-8'>Nenhum evento próximo cadastrado.</p>
              <Button
                variant='outline'
                className='w-full'
                asChild>
                <Link href='/eventos'>Ver Todos os Eventos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesse as principais funcionalidades</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Button
                variant='outline'
                className='w-full justify-start'
                asChild>
                <Link href='/escoteiros'>
                  <Users className='mr-2 h-4 w-4' />
                  Gerenciar Escoteiros
                </Link>
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start'
                asChild>
                <Link href='/relatorios'>
                  <FileText className='mr-2 h-4 w-4' />
                  Gerar Relatório
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
