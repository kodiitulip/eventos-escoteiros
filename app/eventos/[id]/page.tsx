'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Calendar, Clock, Users, UserPlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BranchBadge } from '@/components/BranchBadge';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';
import { useAuth } from '@/app/providers/auth-provider';
import { fetchAllScouts, fetchEventByID, ScoutDataId } from '@/schemas/queries';
import { EventFormData, PaymentStatus } from '@/schemas/escoteiro';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateEvent } from '@/schemas/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function EventDetail() {
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();
  const { id: eventId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<EventFormData>();
  const [participants, setParticipants] = useState<ScoutDataId[]>([]);
  const [scouts, setScouts] = useState<ScoutDataId[]>([]);

  useEffect(() => {
    if (!userLoading && !user) router.push('/auth');
    const load = async () => {
      const eve = await fetchEventByID(eventId);
      if (!eve) notFound();
      const scoutIds = Object.keys(eve.participants ?? {});
      const scouts = await fetchAllScouts();
      setScouts(
        scouts
          .filter(({ id, ramo }) => !scoutIds.includes(id) && (eve.tipo === 'geral' || eve.tipo === ramo))
          .sort(({ nome: nomeA }, { nome: nomeB }) => (nomeA < nomeB ? 1 : -1)),
      );
      setParticipants(
        scouts
          .filter(({ id }) => scoutIds.includes(id))
          .sort(({ nome: nomeA }, { nome: nomeB }) => (nomeA < nomeB ? 1 : -1)),
      );
      setEvent(eve);
      setLoading(false);
    };
    load();
  }, [user, userLoading, router, eventId]);

  if (!event) return null;

  const isPastEvent = new Date(event.dataFim) < new Date();
  const dataInicio = new Date(event.dataInicio);
  const dataFim = new Date(event.dataFim);

  const togglePayment = (participantId: string, status: PaymentStatus) => {
    const e = { ...event };
    e.participants[participantId].payment = status;
    setEvent(e);
    updateEvent(eventId, e);
  };

  const excludeParticipant = (participantId: string) => {
    const e = { ...event };
    if (!e.participants) e.participants = {};
    delete e.participants[participantId];
    setEvent(e);
    updateEvent(eventId, e);
    setScouts((prev) =>
      [...prev, ...participants.filter(({ id }) => id === participantId)].sort(({ nome: nomeA }, { nome: nomeB }) =>
        nomeA < nomeB ? 1 : -1,
      ),
    );
    setParticipants((prev) =>
      prev
        .filter(({ id }) => id !== participantId)
        .sort(({ nome: nomeA }, { nome: nomeB }) => (nomeA < nomeB ? 1 : -1)),
    );
  };

  const includeParticipant = (participantId: string) => {
    const e = { ...event };
    if (!e.participants) e.participants = {};
    e.participants[participantId] = {
      attended: false,
      payment: 'pendente',
    };
    setEvent(e);
    updateEvent(eventId, e);
    setParticipants((prev) =>
      [...prev, ...scouts.filter(({ id }) => id === participantId)].sort(({ nome: nomeA }, { nome: nomeB }) =>
        nomeA < nomeB ? 1 : -1,
      ),
    );
    setScouts((prev) =>
      prev
        .filter(({ id }) => id !== participantId)
        .sort(({ nome: nomeA }, { nome: nomeB }) => (nomeA < nomeB ? 1 : -1)),
    );
  };

  const toggleAttendance = (participantId: string, checked: boolean) => {
    const e = { ...event };
    e.participants[participantId].attended = checked;
    setEvent(e);
    updateEvent(eventId, e);
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
          <div className='flex-1 flex justify-between'>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl md:text-3xl font-bold text-foreground'>{event.nome}</h1>
              <BranchBadge branch={event.tipo} />
            </div>
            <Button asChild>
              <Link href={`/eventos/${eventId}/edit`}>
                <PencilIcon />
                Editar
              </Link>
            </Button>
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
                {dataInicio.toLocaleDateString('pt-BR', { day: 'numeric', month: '2-digit' })} -{' '}
                {dataFim.toLocaleDateString('pt-BR', { day: 'numeric', month: '2-digit' })}
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
                {dataInicio.toLocaleTimeString('pt-BR', { hour: 'numeric', minute: '2-digit' })} -{' '}
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
              <p className='text-lg font-semibold'>{participants.length}</p>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>
                    <UserPlusIcon size={12} /> Adicionar Escoteiro
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {scouts.map(({ id, nome }) => (
                    <DropdownMenuItem
                      key={id + nome}
                      onClick={() => includeParticipant(id)}>
                      {nome}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                  {!loading
                    && participants.map(({ nome, ramo, id }) => (
                      <TableRow key={id}>
                        <TableCell className='font-medium'>{nome}</TableCell>
                        <TableCell>
                          <BranchBadge branch={ramo} />
                        </TableCell>
                        <TableCell>
                          {event.participants[id] && (
                            <Select
                              defaultValue={event.participants[id].payment}
                              onValueChange={(value) => togglePayment(id, value as PaymentStatus)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='pago'>
                                  <PaymentStatusBadge status='pago' />
                                </SelectItem>
                                <SelectItem value='isento'>
                                  <PaymentStatusBadge status='isento' />
                                </SelectItem>
                                <SelectItem value='pendente'>
                                  <PaymentStatusBadge status='pendente' />
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        {isPastEvent && (
                          <TableCell>
                            <Checkbox
                              checked={event.participants[id].attended || false}
                              onCheckedChange={(checked) =>
                                toggleAttendance(id, checked === 'indeterminate' ? false : checked)
                              }
                            />
                          </TableCell>
                        )}
                        <TableCell className='text-right w-min'>
                          <Button
                            onClick={() => excludeParticipant(id)}
                            variant='ghost'>
                            <TrashIcon />
                          </Button>
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
