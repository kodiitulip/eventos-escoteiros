'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BranchBadge } from '@/components/BranchBadge';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';
import { useAuth } from '@/app/providers/auth-provider';
import { fetchAllScouts, fetchEventByID, ScoutDataId } from '@/schemas/queries';
import { EventFormData } from '@/schemas/escoteiro';
import { FileSpreadsheetIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrintPage = () => {
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();
  const { id: eventId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<EventFormData>();
  const [participants, setParticipants] = useState<ScoutDataId[]>([]);

  useEffect(() => {
    if (!userLoading && !user) router.push('/auth');
    const load = async () => {
      const eve = await fetchEventByID(eventId);
      if (!eve) notFound();
      const scoutIds = Object.keys(eve.participants ?? {});
      const scouts = await fetchAllScouts();
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

  const dataInicio = new Date(event.dataInicio);
  const dataFim = new Date(event.dataFim);
  const money = Object.values(event.participants).reduce((acc, { payment }) => {
    if (payment === 'pago') acc += event.valor;
    return acc;
  }, 0);

  return (
    <div className='space-y-6 animate-fade-in bg-white min-h-full'>
      <div className='flex items-center gap-3 justify-between'>
        <h1 className='text-2xl md:text-3xl font-bold text-foreground'>{event.nome}</h1>
        <Button
          variant='outline'
          onClick={(e) => {
            const button = e.currentTarget;
            button.hidden = true;
            window.print();
            setTimeout(() => (button.hidden = false), 200);
          }}>
          <FileSpreadsheetIcon />
          Imprimir
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data e Hora Inicio</TableHead>
            <TableHead>Data e Hora Fim</TableHead>
            <TableHead>Local do Evento</TableHead>
            <TableHead>Responsável</TableHead>
            {event.valor > 0 && <TableHead>Arrecadação por Ingresso</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{dataInicio.toLocaleString()}</TableCell>
            <TableCell>{dataFim.toLocaleString()}</TableCell>
            <TableCell>{event.local}</TableCell>
            <TableCell>{event.responsavel}</TableCell>
            {event.valor > 0 && <TableCell>{money}</TableCell>}
          </TableRow>
        </TableBody>
      </Table>

      <h2>Participantes</h2>

      <p>
        {participants.length}
        {event.limiteVagas > 0 && ' / ' + event.limiteVagas} participantes
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Ramo</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Presença</TableHead>
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
                  {event.participants[id] && <PaymentStatusBadge status={event.participants[id].payment} />}
                </TableCell>
                <TableCell>
                  <input
                    type='checkbox'
                    checked={event.participants[id].attended || false}
                    readOnly
                    inert
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrintPage;
