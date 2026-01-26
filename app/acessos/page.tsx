'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';
import LoadingPage from '../loading';
import Link from 'next/link';
import { removeAccess } from '@/schemas/actions';
import { fetchAllAccess } from './queries';

const AccessPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [access, setAccess] = useState<{ email?: string; uid: string }[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  const handleRemoveAccess = async (uid: string) => {
    await removeAccess(uid);
    setAccess((prev) => prev.filter(({ uid: prevId }) => prevId !== uid));
  };

  useEffect(() => {
    const load = async () => {
      try {
        setAccess(await fetchAllAccess());
      } catch (err) {
        console.error('Error: ', err);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <AppLayout>
      <div className='space-y-6 animate-fade-in'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Acessos</h1>
            <p className='text-muted-foreground mt-1'>Gerencie quem tem acesso ao sistema</p>
          </div>
          <Button asChild>
            <Link href='/auth/register'>Adicionar Acesso</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Lista de Acessos</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Buscar acessos...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className='text-right'>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {access.map(({ email, uid }, idx) => (
                    <TableRow key={uid + String(idx)}>
                      <TableCell className='font-medium'>{email ?? 'Email Not Found'}</TableCell>
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
                              {/* <DropdownMenuItem> */}
                              {/*   <Pencil className='mr-2 h-4 w-4' /> */}
                              {/*   Resetar Senha */}
                              {/* </DropdownMenuItem> */}
                              <DropdownMenuItem
                                className='text-destructive'
                                onClick={() => handleRemoveAccess(uid)}>
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
};

export default AccessPage;
