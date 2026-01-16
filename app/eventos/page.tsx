'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPlus, Search, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { BranchBadge } from '@/components/BranchBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data for UI shell
const mockEvents = [
  {
    id: '1',
    name: 'Acampamento de Páscoa',
    date: '2025-04-18',
    event_type: 'geral' as const,
    registration_fee: 150,
    participants_count: 48,
    paid_count: 32
  },
  {
    id: '2',
    name: 'Reunião de Lobinhos',
    date: '2025-04-12',
    event_type: 'lobinho' as const,
    registration_fee: 0,
    participants_count: 12,
    paid_count: 12
  },
  {
    id: '3',
    name: 'Trilha Ecológica',
    date: '2025-03-22',
    event_type: 'escoteiro' as const,
    registration_fee: 30,
    participants_count: 15,
    paid_count: 10
  }
];

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('todos');

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'todos' || event.event_type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Group events by year
  const eventsByYear = filteredEvents.reduce(
    (acc, event) => {
      const year = new Date(event.date).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(event);
      return acc;
    },
    {} as Record<number, typeof mockEvents>
  );

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
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/eventos/${event.id}`}>
                    <Card className='hover:shadow-md transition-shadow cursor-pointer h-full'>
                      <CardHeader className='pb-2'>
                        <div className='flex items-start justify-between gap-2'>
                          <CardTitle className='text-base line-clamp-2'>{event.name}</CardTitle>
                          <BranchBadge branch={event.event_type} />
                        </div>
                        <CardDescription className='flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {format(new Date(event.date), "dd 'de' MMMM", { locale: ptBR })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center gap-1 text-muted-foreground'>
                            <Users className='h-3 w-3' />
                            <span>{event.participants_count} participantes</span>
                          </div>
                          <div className='text-muted-foreground'>
                            {event.paid_count}/{event.participants_count} pagos
                          </div>
                        </div>
                        {event.registration_fee > 0 && (
                          <div className='mt-2 text-sm font-medium text-primary'>
                            R$ {event.registration_fee.toFixed(2)}
                          </div>
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
