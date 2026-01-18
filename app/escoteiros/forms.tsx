import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { pushScout, updateScout } from '@/schemas/actions';
import { ScoutBranches, ScoutData, ScoutDataInput, ScoutDataOutput, ScoutDataSchema } from '@/schemas/escoteiro';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const RegisterForm = ({
  setScouts,
}: {
  setScouts: React.Dispatch<React.SetStateAction<(ScoutData & { id: string })[]>>;
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    trigger,
    reset,
  } = useForm<ScoutDataInput, unknown, ScoutDataOutput>({ resolver: zodResolver(ScoutDataSchema) });

  const handleAddScout = async () => {
    const values = getValues();
    toast({
      title: 'Escoteiro cadastrado!',
      description: `${values.nome} foi adicionado ao sistema.`,
    });
    const id = await pushScout(values);
    if (id) setScouts((prev) => [...prev, { id, ...values }]);
    else setScouts((prev) => [...prev]);
    setIsDialogOpen(false);
  };

  const closeForm = (value: boolean) => {
    if (!value) reset();
    setIsDialogOpen(value);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={closeForm}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className='mr-2 h-4 w-4' />
          Novo Escoteiro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(handleAddScout)}>
          <DialogHeader>
            <DialogTitle>Cadastrar Escoteiro</DialogTitle>
            <DialogDescription>Adicione um novo escoteiro ao sistema.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='scout-name'>Nome</Label>
              <Input
                id='scout-name'
                placeholder='Nome completo'
                {...register('nome', { required: true })}
              />
              <span className='text-red-500 text-sm '>{errors.nome && errors.nome.message}</span>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='scout-branch'>Ramo</Label>
              <Select
                {...register('ramo')}
                onValueChange={(value) => {
                  setValue('ramo', value as ScoutBranches);
                  trigger('ramo');
                }}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o ramo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='lobinho'>Lobinho</SelectItem>
                  <SelectItem value='escoteiro'>Escoteiro</SelectItem>
                  <SelectItem value='senior'>Sênior</SelectItem>
                  <SelectItem value='pioneiro'>Pioneiro</SelectItem>
                </SelectContent>
              </Select>
              <span className='text-red-500 text-sm '>{errors.ramo && errors.ramo.message}</span>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='scout-res'>Responsável (opcional)</Label>
              <Input
                id='scout-res'
                placeholder='Nome Completo'
                {...register('responsavel', { required: false })}
              />
              <span className='text-red-500 text-sm '>{errors.responsavel && errors.responsavel.message}</span>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='scout-num'>Telefone do Responsavel</Label>
              <Input
                id='scout-num'
                placeholder='(85) XXXXX-XXXX'
                {...register('telefone', { required: true })}
              />
              <span className='text-red-500 text-sm '>{errors.telefone && errors.telefone.message}</span>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='scout-addr'>Endereço</Label>
              <Input
                id='scout-addr'
                placeholder='Endereço'
                {...register('endereco', { required: true })}
              />
              <span className='text-red-500 text-sm '>{errors.endereco && errors.endereco.message}</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              type='button'
              onClick={() => closeForm(false)}>
              Cancelar
            </Button>
            <Button type='submit'>Cadastrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const EditForm = ({
  setScouts,
  open,
  setOpen,
  scoutData,
}: {
  setScouts: React.Dispatch<React.SetStateAction<(ScoutData & { id: string })[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scoutData?: ScoutData & { id: string };
}) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    trigger,
    reset,
  } = useForm<ScoutDataInput, unknown, ScoutDataOutput>({ resolver: zodResolver(ScoutDataSchema) });

  const handleEditScout = async () => {
    const values = getValues();
    if (!scoutData) return;
    toast({
      title: 'Escoteiro atualizado!',
      description: `${values.nome} foi adicionado ao sistema.`,
    });
    updateScout(scoutData.id, values);
    if (scoutData.id)
      setScouts((prev) => {
        const toEdit = prev.findIndex(({ id }) => id === scoutData.id);
        prev[toEdit] = { id: scoutData.id, ...values };
        return prev;
      });
    else setScouts((prev) => [...prev]);
    setOpen(false);
  };

  const closeForm = (value: boolean) => {
    if (!value) reset();
    setOpen(value);
  };

  useEffect(() => {
    reset(scoutData);
  }, [reset, scoutData]);

  if (!scoutData) return <></>;

  return (
    <Dialog
      open={open}
      onOpenChange={closeForm}>
      <DialogContent>
        <form onSubmit={handleSubmit(handleEditScout)}>
          <DialogHeader>
            <DialogTitle>Cadastrar Escoteiro</DialogTitle>
            <DialogDescription>Adicione um novo escoteiro ao sistema.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='scout-name'>Nome</Label>
              <Input
                id='scout-name'
                placeholder='Nome completo'
                {...register('nome', { required: true })}
              />
              <span className='text-red-500 text-sm '>{errors.nome && errors.nome.message}</span>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='scout-branch'>Ramo</Label>
              <Select
                {...register('ramo')}
                onValueChange={(value) => {
                  setValue('ramo', value as ScoutBranches);
                  trigger('ramo');
                }}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o ramo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='lobinho'>Lobinho</SelectItem>
                  <SelectItem value='escoteiro'>Escoteiro</SelectItem>
                  <SelectItem value='senior'>Sênior</SelectItem>
                  <SelectItem value='pioneiro'>Pioneiro</SelectItem>
                </SelectContent>
              </Select>
              <span className='text-red-500 text-sm '>{errors.ramo && errors.ramo.message}</span>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='scout-res'>Responsável (opcional)</Label>
              <Input
                id='scout-res'
                placeholder='Nome Completo'
                {...register('responsavel', { required: false })}
              />
              <span className='text-red-500 text-sm '>{errors.responsavel && errors.responsavel.message}</span>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='scout-num'>Telefone do Responsavel</Label>
              <Input
                id='scout-num'
                placeholder='(85) XXXXX-XXXX'
                {...register('telefone', { required: true })}
              />
              <span className='text-red-500 text-sm '>{errors.telefone && errors.telefone.message}</span>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='scout-addr'>Endereço</Label>
              <Input
                id='scout-addr'
                placeholder='Endereço'
                {...register('endereco', { required: true })}
              />
              <span className='text-red-500 text-sm '>{errors.endereco && errors.endereco.message}</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              type='button'
              onClick={() => closeForm(false)}>
              Cancelar
            </Button>
            <Button type='submit'>Cadastrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
