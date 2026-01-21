'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, LoaderIcon } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/app/providers/auth-provider';
import { useForm } from 'react-hook-form';
import {
  EventFormDataInput,
  EventFormDataOutput,
  EventFormData,
  ScoutBranches,
  EventFormDataSchema,
} from '@/schemas/escoteiro';
import { updateEvent } from '@/schemas/actions';
import { fetchEventByID } from '@/schemas/queries';

export default function CreateEvent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id: eventId } = useParams<{ id: string }>();
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    reset,
  } = useForm<EventFormDataInput, unknown, EventFormDataOutput>({
    resolver: zodResolver(EventFormDataSchema),
    defaultValues: { valor: 0, limiteVagas: 0, participants: {} },
  });

  useEffect(() => {
    if (!loading && !user) router.push('/auth');

    const load = async () => {
      const data = await fetchEventByID(eventId);
      reset(data);
      setDataLoading(false);
    };
    load();
  }, [user, loading, router, eventId, reset]);

  const handleUpdateEvent = (data: EventFormData) => {
    try {
      toast({
        title: 'Evento Atualizado',
        description: 'Alterações foram salvas.',
      });
      updateEvent(eventId, data);
      router.push(`/eventos/${eventId}`);
    } catch (error) {
      toast({
        title: 'Houve um erro desconhecido',
        description: error instanceof Error ? error.message : `${error}`,
        variant: 'destructive',
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
            <Link href={`/eventos/${eventId}`}>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Editar Evento</h1>
          </div>
        </div>
        {dataLoading && <LoaderIcon className='animate-spin absolute top-1/2 left-1/2 -translate-1/2' />}
        {!dataLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Informações do Evento</CardTitle>
              <CardDescription>Preencha os dados do evento.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(handleUpdateEvent)}
                className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Nome do Evento *</Label>
                  <Input
                    id='name'
                    placeholder='Nome do Evento'
                    {...register('nome')}
                  />
                  <span className='text-red-500 text-sm'>{errors.nome && errors.nome.message}</span>
                </div>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='addrs'>Local do Evento *</Label>
                    <Input
                      id='addrs'
                      placeholder='Local do Evento'
                      {...register('local')}
                    />
                    <span className='text-red-500 text-sm'>{errors.local && errors.local.message}</span>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='responsavel'>Responsável pelo Evento *</Label>
                    <Input
                      id='responsavel'
                      placeholder='Nome Completo'
                      {...register('responsavel')}
                    />
                    <span className='text-red-500 text-sm'>{errors.responsavel && errors.responsavel.message}</span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='event_type'>Ramo do Evento *</Label>
                  <Select
                    defaultValue={getValues().tipo}
                    onValueChange={(value) => {
                      setValue('tipo', value as ScoutBranches);
                      trigger('tipo');
                    }}
                    {...register('tipo')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='geral'>Geral (todos os ramos)</SelectItem>
                      <SelectItem value='lobinho'>Lobinho</SelectItem>
                      <SelectItem value='escoteiro'>Escoteiro</SelectItem>
                      <SelectItem value='senior'>Sênior</SelectItem>
                      <SelectItem value='pioneiro'>Pioneiro</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className='text-red-500 text-sm'>{errors.tipo && errors.tipo.message}</span>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='date'>Data Inicio *</Label>
                    <Input
                      id='date'
                      type='datetime-local'
                      {...register('dataInicio')}
                    />
                    <span className='text-red-500 text-sm'>{errors.dataInicio && errors.dataInicio.message}</span>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='date-end'>Data Fim *</Label>
                    <Input
                      id='date-end'
                      type='datetime-local'
                      {...register('dataFim')}
                    />
                    <span className='text-red-500 text-sm'>{errors.dataFim && errors.dataFim.message}</span>
                  </div>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='registration_fee'>Taxa de Inscrição (R$)</Label>
                    <Input
                      id='registration_fee'
                      type='number'
                      min='0'
                      step='0.01'
                      placeholder='0.00'
                      {...register('valor', { valueAsNumber: true })}
                    />
                    <span className='text-red-500 text-sm'>{errors.valor && errors.valor.message}</span>
                    <p className='text-xs text-muted-foreground'>Deixe em branco ou 0 para eventos gratuitos.</p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='vagas'>Limite de Vagas</Label>
                    <Input
                      id='vagas'
                      type='number'
                      min='0'
                      step='0.01'
                      placeholder='0.00'
                      {...register('limiteVagas', { valueAsNumber: true })}
                    />
                    <span className='text-red-500 text-sm'>{errors.limiteVagas && errors.limiteVagas.message}</span>
                    <p className='text-xs text-muted-foreground'>Deixe em branco ou 0 para não ter limite</p>
                  </div>
                </div>

                <div className='flex gap-4 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    asChild
                    className='flex-1'>
                    <Link href={`/eventos/${eventId}`}>Cancelar</Link>
                  </Button>
                  <Button
                    type='submit'
                    className='flex-1'>
                    Salvar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
