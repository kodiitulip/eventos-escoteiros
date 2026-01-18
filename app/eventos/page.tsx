'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPlus, Search, Calendar } from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { BranchBadge } from '@/components/BranchBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'next/navigation';
import { EventData } from '@/types/event.type';
import { fetchAllEvents } from '@/schemas/queries';
import LoadingPage from '../loading';

export default function Events() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');

    const load = async () => {
      const eve = await fetchAllEvents();
      setEvents(eve);
    };

    load();
  }, [user, loading, router]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('todos');

  const filteredEvents = events.filter(({ nome, tipo }) => {
    const matchesSearch = nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'todos' || tipo === typeFilter;
    return matchesSearch && matchesType;
  });

  // Group events by year
  const eventsByYear = filteredEvents.reduce(
    (acc, event) => {
      const year = new Date(event.dataInicio).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(event);
      return acc;
    },
    {} as Record<number, EventData[]>,
  );

  if (loading) return <LoadingPage />;

  if (!user) return null;

  return (
    <AppLayout>
      <div className='space-y-6 animate-fade-in'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Eventos</h1>
            <p className='text-muted-foreground mt-1'>Gerencie todos os eventos do grupo escoteiro.</p>
          </div>
          <Button asChild>
            <Link href='/eventos/novo'>
              <CalendarPlus className='mr-2 h-4 w-4' />
              Novo Evento
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Buscar eventos...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}>
                <SelectTrigger className='w-full sm:w-[180px]'>
                  <SelectValue placeholder='Tipo de evento' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos os tipos</SelectItem>
                  <SelectItem value='geral'>Geral</SelectItem>
                  <SelectItem value='lobinho'>Lobinho</SelectItem>
                  <SelectItem value='escoteiro'>Escoteiro</SelectItem>
                  <SelectItem value='senior'>Sênior</SelectItem>
                  <SelectItem value='pioneiro'>Pioneiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {Object.entries(eventsByYear)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, events]) => (
            <div
              key={year}
              className='space-y-4'>
              <h2 className='text-xl font-semibold text-foreground'>{year}</h2>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {events.map(({ id, nome, tipo, dataInicio, valor }) => (
                  <Link
                    key={id}
                    href={`/eventos/${id}`}>
                    <Card className='hover:shadow-md transition-shadow cursor-pointer h-full'>
                      <CardHeader className='pb-2'>
                        <div className='flex items-start justify-between gap-2'>
                          <CardTitle className='text-base line-clamp-2'>{nome}</CardTitle>
                          <BranchBadge branch={tipo} />
                        </div>
                        <CardDescription className='flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {format(new Date(dataInicio), "dd 'de' MMMM", { locale: ptBR })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {valor > 0 && (
                          <div className='mt-2 text-sm font-medium text-primary'>R$ {valor.toFixed(2)}</div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className='py-12 text-center'>
              <p className='text-muted-foreground'>Nenhum evento encontrado.</p>
              <Button
                className='mt-4'
                asChild>
                <Link href='/eventos/novo'>Criar Primeiro Evento</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
