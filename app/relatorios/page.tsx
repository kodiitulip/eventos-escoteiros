'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { FileText, Download, Printer, Calendar, Users, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { ShareReportDialog } from '@/components/ShareReportDialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';

export default function Reports() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedBranch, setSelectedBranch] = useState('todos');

  const handleGenerateReport = (type: string) => {
    toast({
      title: 'Relatório gerado',
      description: `O relatório de ${type} foi gerado com sucesso.`
    });
  };

  return (
    <AppLayout>
      <div className='space-y-6 animate-fade-in'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-foreground'>Relatórios</h1>
          <p className='text-muted-foreground mt-1'>
            Gere relatórios detalhados sobre eventos, pagamentos e participação.
          </p>
        </div>

        <Tabs
          defaultValue='year'
          className='space-y-6'>
          <TabsList className='grid w-full grid-cols-2 lg:grid-cols-4'>
            <TabsTrigger value='year'>Por Ano</TabsTrigger>
            <TabsTrigger value='branch'>Por Ramo</TabsTrigger>
            <TabsTrigger value='scout'>Por Escoteiro</TabsTrigger>
            <TabsTrigger value='financial'>Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent
            value='year'
            className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Calendar className='h-5 w-5' />
                  Relatório Anual
                </CardTitle>
                <CardDescription>Visualize todos os eventos e estatísticas de um ano específico.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Selecione o ano</Label>
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}>
                    <SelectTrigger className='w-full sm:w-[200px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='2025'>2025</SelectItem>
                      <SelectItem value='2024'>2024</SelectItem>
                      <SelectItem value='2023'>2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid gap-4 md:grid-cols-3'>
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-sm'>Total de Eventos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-2xl font-bold'>12</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-sm'>Total Arrecadado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-2xl font-bold text-primary'>R$ 4.850,00</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-sm'>Taxa de Presença</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-2xl font-bold text-success'>87%</p>
                    </CardContent>
                  </Card>
                </div>

                <div className='flex flex-wrap gap-2 pt-4'>
                  <Button onClick={() => handleGenerateReport('ano')}>
                    <FileText className='mr-2 h-4 w-4' />
                    Gerar Relatório
                  </Button>
                  <Button variant='outline'>
                    <Download className='mr-2 h-4 w-4' />
                    Baixar PDF
                  </Button>
                  <Button variant='outline'>
                    <Printer className='mr-2 h-4 w-4' />
                    Imprimir
                  </Button>
                  <ShareReportDialog
                    reportType='year'
                    reportTitle={`Relatório Anual ${selectedYear}`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value='branch'
            className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Users className='h-5 w-5' />
                  Relatório por Ramo
                </CardTitle>
                <CardDescription>Estatísticas específicas de cada ramo escoteiro.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Selecione o ramo</Label>
                  <Select
                    value={selectedBranch}
                    onValueChange={setSelectedBranch}>
                    <SelectTrigger className='w-full sm:w-[200px]'>
                      <SelectValue />
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

                <div className='grid gap-4 md:grid-cols-2'>
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-sm'>Eventos do Ramo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-2xl font-bold'>5</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-sm'>Escoteiros Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-2xl font-bold'>12</p>
                    </CardContent>
                  </Card>
                </div>

                <div className='flex flex-wrap gap-2 pt-4'>
                  <Button onClick={() => handleGenerateReport('ramo')}>
                    <FileText className='mr-2 h-4 w-4' />
                    Gerar Relatório
                  </Button>
                  <Button variant='outline'>
                    <Download className='mr-2 h-4 w-4' />
                    Baixar PDF
                  </Button>
                  <ShareReportDialog
                    reportType='branch'
                    reportTitle={`Relatório do Ramo ${selectedBranch === 'todos' ? 'Geral' : selectedBranch.charAt(0).toUpperCase() + selectedBranch.slice(1)}`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value='scout'
            className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Users className='h-5 w-5' />
                  Relatório Individual
                </CardTitle>
                <CardDescription>Histórico completo de participação de um escoteiro.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Selecione o escoteiro</Label>
                  <Select>
                    <SelectTrigger className='w-full sm:w-[300px]'>
                      <SelectValue placeholder='Buscar escoteiro...' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='s1'>Ana Silva</SelectItem>
                      <SelectItem value='s2'>Bruno Santos</SelectItem>
                      <SelectItem value='s3'>Carla Oliveira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex flex-wrap gap-2 pt-4'>
                  <Button onClick={() => handleGenerateReport('escoteiro')}>
                    <FileText className='mr-2 h-4 w-4' />
                    Gerar Relatório
                  </Button>
                  <Button variant='outline'>
                    <Download className='mr-2 h-4 w-4' />
                    Baixar PDF
                  </Button>
                  <ShareReportDialog
                    reportType='scout'
                    reportTitle='Relatório Individual do Escoteiro'
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value='financial'
            className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Relatório Financeiro
                </CardTitle>
                <CardDescription>Resumo de arrecadação e pagamentos pendentes.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-3'>
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-sm'>Total Arrecadado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-2xl font-bold text-primary'>R$ 4.850,00</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-sm'>Pendente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-2xl font-bold text-warning'>R$ 750,00</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-sm'>Taxa de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-2xl font-bold text-success'>87%</p>
                    </CardContent>
                  </Card>
                </div>

                <div className='flex flex-wrap gap-2 pt-4'>
                  <Button onClick={() => handleGenerateReport('financeiro')}>
                    <FileText className='mr-2 h-4 w-4' />
                    Gerar Relatório
                  </Button>
                  <Button variant='outline'>
                    <Download className='mr-2 h-4 w-4' />
                    Baixar PDF
                  </Button>
                  <Button variant='outline'>
                    <Printer className='mr-2 h-4 w-4' />
                    Imprimir
                  </Button>
                  <ShareReportDialog
                    reportType='financial'
                    reportTitle='Relatório Financeiro'
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
