'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserPlus, Search, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AppLayout } from '@/components/layout/AppLayout';
import { BranchBadge } from '@/components/BranchBadge';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScoutEventsDialog } from '@/components/ScoutEventsDialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';

// Mock data for UI shell
const mockScouts = [
  { id: 's1', name: 'Ana Silva', ramo: 'lobinho' as const, active: true },
  { id: 's2', name: 'Bruno Santos', ramo: 'escoteiro' as const, active: true },
  { id: 's3', name: 'Carla Oliveira', ramo: 'senior' as const, active: true },
  { id: 's4', name: 'Daniel Costa', ramo: 'pioneiro' as const, active: true },
  { id: 's5', name: 'Eduardo Lima', ramo: 'lobinho' as const, active: false },
  { id: 's6', name: 'Fernanda Souza', ramo: 'escoteiro' as const, active: true }
];

export default function Scouts() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  const { toast } = useToast();
  const [scouts, setScouts] = useState(mockScouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newScout, setNewScout] = useState({ name: '', ramo: '' });

  const filteredScouts = scouts.filter((scout) => {
    const matchesSearch = scout.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'todos' || scout.ramo === branchFilter;
    const isActive = scout.active;
    return matchesSearch && matchesBranch && isActive;
  });

  const handleAddScout = () => {
    if (!newScout.name || !newScout.ramo) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome e ramo do escoteiro.',
        variant: 'destructive'
      });
      return;
    }

    setScouts((prev) => [
      ...prev,
      {
        id: `s${Date.now()}`,
        name: newScout.name,
        ramo: newScout.ramo as 'lobinho' | 'escoteiro' | 'senior' | 'pioneiro',
        active: true
      }
    ]);

    toast({
      title: 'Escoteiro cadastrado!',
      description: `${newScout.name} foi adicionado ao sistema.`
    });

    setNewScout({ name: '', ramo: '' });
    setIsDialogOpen(false);
  };

  const handleDeactivateScout = (scoutId: string) => {
    setScouts((prev) => prev.map((s) => (s.id === scoutId ? { ...s, active: false } : s)));
    toast({
      title: 'Escoteiro desativado',
      description: 'O escoteiro foi marcado como inativo.'
    });
  };

  const branchCounts = {
    lobinho: scouts.filter((s) => s.ramo === 'lobinho' && s.active).length,
    escoteiro: scouts.filter((s) => s.ramo === 'escoteiro' && s.active).length,
    senior: scouts.filter((s) => s.ramo === 'senior' && s.active).length,
    pioneiro: scouts.filter((s) => s.ramo === 'pioneiro' && s.active).length
  };

  return (
    <AppLayout>
      <div className='space-y-6 animate-fade-in'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Escoteiros</h1>
            <p className='text-muted-foreground mt-1'>Gerencie os escoteiros do grupo.</p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className='mr-2 h-4 w-4' />
                Novo Escoteiro
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                    value={newScout.name}
                    onChange={(e) => setNewScout((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='scout-branch'>Ramo</Label>
                  <Select
                    value={newScout.ramo}
                    onValueChange={(value) => setNewScout((prev) => ({ ...prev, ramo: value }))}>
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
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddScout}>Cadastrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className='grid gap-4 md:grid-cols-4'>
          <Card className='bg-lobinho/10 border-lobinho/20'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-lobinho'>Lobinhos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{branchCounts.lobinho}</p>
            </CardContent>
          </Card>
          <Card className='bg-escoteiro/10 border-escoteiro/20'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-escoteiro'>Escoteiros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{branchCounts.escoteiro}</p>
            </CardContent>
          </Card>
          <Card className='bg-senior/10 border-senior/20'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-senior'>Seniores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{branchCounts.senior}</p>
            </CardContent>
          </Card>
          <Card className='bg-pioneiro/10 border-pioneiro/20'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-pioneiro'>Pioneiros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{branchCounts.pioneiro}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Lista de Escoteiros</CardTitle>
            <CardDescription>{filteredScouts.length} escoteiros ativos</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Buscar escoteiros...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Select
                value={branchFilter}
                onValueChange={setBranchFilter}>
                <SelectTrigger className='w-full sm:w-[180px]'>
                  <SelectValue placeholder='Filtrar por ramo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos os ramos</SelectItem>
                  <SelectItem value='lobinho'>Lobinho</SelectItem>
                  <SelectItem value='escoteiro'>Escoteiro</SelectItem>
                  <SelectItem value='senior'>Sênior</SelectItem>
                  <SelectItem value='pioneiro'>Pioneiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ramo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScouts.map((scout) => (
                    <TableRow key={scout.id}>
                      <TableCell className='font-medium'>{scout.name}</TableCell>
                      <TableCell>
                        <BranchBadge branch={scout.ramo} />
                      </TableCell>
                      <TableCell>
                        <Badge variant={scout.active ? 'default' : 'secondary'}>
                          {scout.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <ScoutEventsDialog
                            scoutName={scout.name}
                            scoutId={scout.id}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem>
                                <Pencil className='mr-2 h-4 w-4' />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className='text-destructive'
                                onClick={() => handleDeactivateScout(scout.id)}>
                                <Trash2 className='mr-2 h-4 w-4' />
                                Desativar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
