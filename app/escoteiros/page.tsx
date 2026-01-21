'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppLayout } from '@/components/layout/AppLayout';
import { BranchBadge } from '@/components/BranchBadge';
import { ScoutEventsDialog } from '@/components/ScoutEventsDialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';
import { ScoutBranches, ScoutData } from '@/schemas/escoteiro';
import { fetchAllScouts } from '@/schemas/queries';
import LoadingPage from '../loading';
import { EditForm, RegisterForm } from './forms';
import { removeScout } from '@/schemas/actions';

export default function Scouts() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  const [scouts, setScouts] = useState<(ScoutData & { id: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<ScoutBranches | 'geral'>('geral');
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<ScoutData & { id: string }>();

  const filteredScouts = scouts.filter(({ nome, ramo }) => {
    const matchesSearch = nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'geral' || ramo === branchFilter;
    return matchesSearch && matchesBranch;
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllScouts();
        setScouts(data);
      } catch (err) {
        console.error('Error: ', err);
      }
    };
    load();
  }, []);

  const handleRemoveScout = (idToRemove: string) => {
    setScouts((prev) => prev.filter(({ id }) => id !== idToRemove));
    removeScout(idToRemove);
  };

  const branchCounts = {
    lobinho: scouts.filter(({ ramo }) => ramo === 'lobinho').length,
    escoteiro: scouts.filter(({ ramo }) => ramo === 'escoteiro').length,
    senior: scouts.filter(({ ramo }) => ramo === 'senior').length,
    pioneiro: scouts.filter(({ ramo }) => ramo === 'pioneiro').length,
  };

  if (loading) return <LoadingPage />;

  return (
    <AppLayout>
      <div className='space-y-6 animate-fade-in'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Escoteiros</h1>
            <p className='text-muted-foreground mt-1'>Gerencie os escoteiros do grupo.</p>
          </div>
          <RegisterForm setScouts={setScouts} />
          <EditForm
            setScouts={setScouts}
            scoutData={editData}
            open={editOpen}
            setOpen={setEditOpen}
          />
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
            <CardDescription>{filteredScouts.length} escoteiros encontrados</CardDescription>
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
                onValueChange={(value) => setBranchFilter(value as ScoutBranches)}>
                <SelectTrigger className='w-full sm:w-[180px]'>
                  <SelectValue placeholder='Filtrar por ramo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='geral'>Todos os ramos</SelectItem>
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
                    <TableHead className='text-right'>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScouts.map((scout) => (
                    <TableRow key={scout.id}>
                      <TableCell className='font-medium'>{scout.nome}</TableCell>
                      <TableCell>
                        <BranchBadge branch={scout.ramo} />
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditData(scout);
                                  setEditOpen(true);
                                }}>
                                <Pencil className='mr-2 h-4 w-4' />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className='text-destructive'
                                onClick={() => handleRemoveScout(scout.id)}>
                                <Trash2 className='mr-2 h-4 w-4' />
                                Deletar
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
