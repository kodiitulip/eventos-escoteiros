'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Printer } from 'lucide-react';
import { PaymentStatusBadge } from '@/components/PaymentStatusBadge';
import { useToast } from '@/hooks/use-toast';

interface ScoutEvent {
  id: string;
  name: string;
  date: string;
  paymentStatus: 'pendente' | 'pago' | 'isento';
  value: number;
}

interface ScoutEventsDialogProps {
  scoutName: string;
  scoutId: string;
}

// Mock data for UI shell
const mockScoutEvents: ScoutEvent[] = [
  { id: 'e1', name: 'Acampamento de Inverno', date: '2024-07-15', paymentStatus: 'pago', value: 150 },
  { id: 'e2', name: 'Reunião Semanal - Junho', date: '2024-06-20', paymentStatus: 'pago', value: 25 },
  { id: 'e3', name: 'Festa Junina', date: '2024-06-10', paymentStatus: 'isento', value: 0 },
  { id: 'e4', name: 'Caminhada Ecológica', date: '2024-05-18', paymentStatus: 'pago', value: 40 },
  { id: 'e5', name: 'Dia do Escoteiro', date: '2024-04-23', paymentStatus: 'pendente', value: 30 }
];

export function ScoutEventsDialog({ scoutName, scoutId }: ScoutEventsDialogProps) {
  const { toast } = useToast();

  // Mock events - in real implementation would filter by scoutId
  const events = mockScoutEvents;

  const totalPaid = events.filter((e) => e.paymentStatus === 'pago').reduce((acc, e) => acc + e.value, 0);

  const totalPending = events.filter((e) => e.paymentStatus === 'pendente').reduce((acc, e) => acc + e.value, 0);

  const handleDownloadPDF = () => {
    toast({
      title: 'Gerando PDF...',
      description: `Relatório de eventos de ${scoutName} será baixado em breve.`
    });
  };

  const handlePrint = () => {
    toast({
      title: 'Preparando impressão...',
      description: 'O relatório será enviado para a impressora.'
    });
    window.print();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='gap-2'>
          <FileText className='h-4 w-4' />
          Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Histórico de Eventos</DialogTitle>
          <DialogDescription>Eventos dos quais {scoutName} participou</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Summary Cards */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-accent/30 rounded-lg p-4'>
              <p className='text-sm text-muted-foreground'>Total Pago</p>
              <p className='text-xl font-bold text-primary'>{formatCurrency(totalPaid)}</p>
            </div>
            <div className='bg-accent/30 rounded-lg p-4'>
              <p className='text-sm text-muted-foreground'>Total Pendente</p>
              <p className='text-xl font-bold text-destructive'>{formatCurrency(totalPending)}</p>
            </div>
          </div>

          {/* Events Table */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length > 0 ?
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className='font-medium'>{event.name}</TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell>{formatCurrency(event.value)}</TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={event.paymentStatus} />
                      </TableCell>
                    </TableRow>
                  ))
                : <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center text-muted-foreground py-8'>
                      Nenhum evento encontrado
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-2 pt-4 border-t'>
            <Button
              variant='outline'
              onClick={handleDownloadPDF}>
              <Download className='mr-2 h-4 w-4' />
              Baixar PDF
            </Button>
            <Button
              variant='outline'
              onClick={handlePrint}>
              <Printer className='mr-2 h-4 w-4' />
              Imprimir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
