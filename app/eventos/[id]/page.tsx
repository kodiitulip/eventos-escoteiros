'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Calendar, Clock, Users, Receipt, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BranchBadge } from '@/components/BranchBadge';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data for UI shell
const mockEvent = {
  id: '1',
  name: 'Acampamento de Páscoa',
  date: '2025-04-18',
  start_time: '08:00',
  end_time: '18:00',
  event_type: 'geral' as const,
  registration_fee: 150
};

type Participant = {
  id: string;
  scout_id: string;
  scout_name: string;
  ramo: 'lobinho' | 'escoteiro' | 'senior' | 'pioneiro';
  payment_status: 'pago' | 'pendente';
  attended: boolean | null;
};

const mockParticipants: Participant[] = [
  { id: 'p1', scout_id: 's1', scout_name: 'Ana Silva', ramo: 'lobinho', payment_status: 'pago', attended: null },
  {
    id: 'p2',
    scout_id: 's2',
    scout_name: 'Bruno Santos',
    ramo: 'escoteiro',
    payment_status: 'pendente',
    attended: null
  },
  { id: 'p3', scout_id: 's3', scout_name: 'Carla Oliveira', ramo: 'senior', payment_status: 'pago', attended: null },
  { id: 'p4', scout_id: 's4', scout_name: 'Daniel Costa', ramo: 'pioneiro', payment_status: 'pendente', attended: null }
];

export default function EventDetail() {
  const params = useParams();
  const [participants, setParticipants] = useState(mockParticipants);

  const event = mockEvent;
  const isPastEvent = new Date(event.date) < new Date();

  const summary = {
    total: participants.length,
    paid: participants.filter((p) => p.payment_status === 'pago').length,
    attended: participants.filter((p) => p.attended).length
  };

  const togglePayment = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            payment_status: p.payment_status === 'pago' ? 'pendente' : 'pago'
          };
        }
        return p;
      })
    );
  };

  const toggleAttendance = (participantId: string) => {
    if (!isPastEvent) return;
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return { ...p, attended: !p.attended };
        }
        return p;
      })
    );
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
              <h1 className='text-2xl md:text-3xl font-bold text-foreground'>{event.name}</h1>
              <BranchBadge branch={event.event_type} />
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
              <p className='text-lg font-semibold'>
                {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
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
                {event.start_time} - {event.end_time}
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
              <p className='text-lg font-semibold'>
                {summary.paid}/{summary.total} pagos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Taxa de Inscrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-lg font-semibold text-primary'>
                {event.registration_fee > 0 ? `R$ ${event.registration_fee.toFixed(2)}` : 'Gratuito'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <CardTitle>Participantes</CardTitle>
                <CardDescription>{summary.total} escoteiros inscritos neste evento</CardDescription>
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
