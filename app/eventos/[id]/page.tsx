'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Calendar, Clock, Users, Receipt, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BranchBadge } from '@/components/BranchBadge';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/app/providers/auth-provider';
import { EventData } from '@/types/event.type';
import { fetchEventByID } from '@/schemas/queries';

type Participant = {
  id: string;
  scout_id: string;
  scout_name: string;
  ramo: 'lobinho' | 'escoteiro' | 'senior' | 'pioneiro';
  payment_status: 'pago' | 'pendente';
  attended: boolean | null;
};

export default function EventDetail() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: EventData['id'] }>();
  const [event, setEvent] = useState<EventData>();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
    const load = async () => {
      const eve = await fetchEventByID(id);
      if (!eve) notFound();
      setEvent(eve);
    };
    load();
  }, [user, loading, router, id]);

  if (!event) return null;

  const isPastEvent = new Date(event.dataFim) < new Date();
  const dataInicio = new Date(event.dataInicio);
  const dataFim = new Date(event.dataFim);
  const participants: Participant[] = [];

  // const summary = {
  //   total: participants.length,
  //   paid: participants.filter((p) => p.payment_status === 'pago').length,
  //   attended: participants.filter((p) => p.attended).length
  // };

  const togglePayment = (participantId: string) => {};

  const toggleAttendance = (participantId: string) => {
    if (!isPastEvent) return;
  };

  return (
    <AppLayout>
      <div className='space-y-6 animate-fade-in'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            asChild>
            <Link href='/eventos'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div className='flex-1'>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl md:text-3xl font-bold text-foreground'>{event.nome}</h1>
              <BranchBadge branch={event.tipo} />
            </div>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg font-semibold'>{format(dataInicio, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg font-semibold'>
                {dataInicio.toLocaleTimeString('pt-BR', { hour: 'numeric', minute: '2-digit' })} -
                {dataFim.toLocaleTimeString('pt-BR', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center gap-2'>
                <Users className='h-4 w-4' />
                Participantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg font-semibold'>{event.inscritosCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Taxa de Inscrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg font-semibold text-primary'>
                {event.valor > 0 ?
                  event.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'Gratuito'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <CardTitle>Participantes</CardTitle>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'>
                  <FileText className='mr-2 h-4 w-4' />
                  Relatório
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ramo</TableHead>
                    <TableHead>Pagamento</TableHead>
                    {isPastEvent && <TableHead>Presença</TableHead>}
                    <TableHead className='text-right'>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className='font-medium'>{participant.scout_name}</TableCell>
                      <TableCell>
                        <BranchBadge branch={participant.ramo} />
                      </TableCell>
                      <TableCell>
                        <button onClick={() => togglePayment(participant.id)}>
                          <PaymentStatusBadge status={participant.payment_status} />
                        </button>
                      </TableCell>
                      {isPastEvent && (
                        <TableCell>
                          <Checkbox
                            checked={participant.attended || false}
                            onCheckedChange={() => toggleAttendance(participant.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell className='text-right'>
                        {participant.payment_status === 'pago' && (
                          <Button
                            variant='ghost'
                            size='sm'>
                            <Receipt className='h-4 w-4' />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
