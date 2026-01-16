'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CalendarPlus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/app/providers/auth-provider';
import { EventData, EventType } from '@/types/event.type';
import { push, ref, set } from 'firebase/database';
import { database } from '@/lib/firebase';

export type EventFormData = {
  nome: string;
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  valor: number;
  tipo: EventType;
};

export default function CreateEvent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  const { toast } = useToast();

  const [formData, setFormData] = useState<EventFormData>(() => {
    const d = new Date();
    return {
      dataFim: d.toISOString(),
      dataInicio: d.toISOString(),
      horaFim: d.toISOString(),
      horaInicio: d.toISOString(),
      nome: '',
      tipo: 'geral',
      valor: 0
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.nome || !formData.dataInicio || !formData.tipo) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const newRef = push(ref(database, 'events'));
      console.log(formData.dataInicio, formData.horaInicio);
      const dataInicio = new Date(formData.dataInicio.concat(' ', formData.horaInicio));
      const dataFim = new Date(formData.dataFim.concat(' ', formData.horaFim));
      await set(newRef, {
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
        nome: formData.nome,
        tipo: formData.tipo,
        valor: formData.valor,
        ativo: dataFim > new Date(),
        createdAt: new Date().toISOString()
      } as EventData);

      toast({
        title: 'Evento criado!',
        description: 'O evento foi cadastrado com sucesso.'
      });

      router.push('/eventos');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Houve um erro desconhecido',
        description: 'Tente novamente mais tarde',
        variant: 'destructive'
      });
    }
  };

  return (
    <AppLayout>
      <div className='space-y-6 animate-fade-in max-w-2xl'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            asChild>
            <Link href='/eventos'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Novo Evento</h1>
            <p className='text-muted-foreground mt-1'>Cadastre um novo evento para o grupo escoteiro.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Evento</CardTitle>
            <CardDescription>
              Preencha os dados do evento. Os participantes serão adicionados automaticamente com base no tipo de
              evento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nome do Evento *</Label>
                <Input
                  id='name'
                  placeholder='Ex: Acampamento de Páscoa'
                  value={formData.nome}
                  required
                  onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='event_type'>Ramo do Evento *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value as EventType }))}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='geral'>Geral (todos os ramos)</SelectItem>
                    <SelectItem value='lobinho'>Lobinho</SelectItem>
                    <SelectItem value='escoteiro'>Escoteiro</SelectItem>
                    <SelectItem value='senior'>Sênior</SelectItem>
                    <SelectItem value='pioneiro'>Pioneiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='date'>Data Inicio *</Label>
                  <Input
                    id='date'
                    type='date'
                    value={formData.dataInicio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dataInicio: e.target.value }))}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='date-end'>Data Fim *</Label>
                  <Input
                    id='date-end'
                    type='date'
                    value={formData.dataFim}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dataFim: e.target.value }))}
                  />
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='start_time'>Horário de Início *</Label>
                  <Input
                    id='start_time'
                    type='time'
                    value={formData.horaInicio}
                    required
                    onChange={(e) => setFormData((prev) => ({ ...prev, horaInicio: e.target.value }))}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='end_time'>Horário de Término *</Label>
                  <Input
                    id='end_time'
                    type='time'
                    value={formData.horaFim}
                    required
                    onChange={(e) => setFormData((prev) => ({ ...prev, horaFim: e.target.value }))}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='registration_fee'>Taxa de Inscrição (R$)</Label>
                <Input
                  id='registration_fee'
                  type='number'
                  min='0'
                  step='0.01'
                  placeholder='0.00'
                  value={formData.valor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, valor: Number(e.target.value) }))}
                />
                <p className='text-xs text-muted-foreground'>Deixe em branco ou 0 para eventos gratuitos.</p>
              </div>

              <div className='flex gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  asChild
                  className='flex-1'>
                  <Link href='/eventos'>Cancelar</Link>
                </Button>
                <Button
                  type='submit'
                  className='flex-1'>
                  <CalendarPlus className='mr-2 h-4 w-4' />
                  Criar Evento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
