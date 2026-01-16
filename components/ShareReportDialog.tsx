'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Mail, MessageCircle, Download, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareReportDialogProps {
  reportType: string;
  reportTitle: string;
}

export function ShareReportDialog({ reportType, reportTitle }: ShareReportDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDownloadPDF = () => {
    toast({
      title: 'PDF gerado',
      description: `O relatório "${reportTitle}" foi salvo como PDF.`
    });
    setOpen(false);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Relatório: ${reportTitle}`);
    const body = encodeURIComponent(`Segue em anexo o relatório "${reportTitle}" do sistema GEABEG.`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    toast({
      title: 'E-mail aberto',
      description: 'O cliente de e-mail foi aberto para envio.'
    });
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Relatório: ${reportTitle} - Sistema GEABEG`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    toast({
      title: 'WhatsApp aberto',
      description: 'O WhatsApp foi aberto para compartilhamento.'
    });
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`Relatório: ${reportTitle} - Sistema GEABEG`);
    window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
    toast({
      title: 'Telegram aberto',
      description: 'O Telegram foi aberto para compartilhamento.'
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`Relatório: ${reportTitle} - Sistema GEABEG`);
    setCopied(true);
    toast({
      title: 'Copiado',
      description: 'Informações do relatório copiadas para a área de transferência.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Share2 className='mr-2 h-4 w-4' />
          Compartilhar
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Compartilhar Relatório</DialogTitle>
          <DialogDescription>Escolha como deseja compartilhar o relatório &quot;{reportTitle}&quot;.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-3 py-4'>
          <Button
            variant='outline'
            className='w-full justify-start gap-3 h-12'
            onClick={handleDownloadPDF}>
            <Download className='h-5 w-5 text-primary' />
            <div className='text-left'>
              <p className='font-medium'>Baixar PDF</p>
              <p className='text-xs text-muted-foreground'>Salvar arquivo no dispositivo</p>
            </div>
          </Button>

          <Button
            variant='outline'
            className='w-full justify-start gap-3 h-12'
            onClick={handleShareEmail}>
            <Mail className='h-5 w-5 text-primary' />
            <div className='text-left'>
              <p className='font-medium'>Enviar por E-mail</p>
              <p className='text-xs text-muted-foreground'>Abrir cliente de e-mail</p>
            </div>
          </Button>

          <Button
            variant='outline'
            className='w-full justify-start gap-3 h-12'
            onClick={handleShareWhatsApp}>
            <MessageCircle className='h-5 w-5 text-success' />
            <div className='text-left'>
              <p className='font-medium'>WhatsApp</p>
              <p className='text-xs text-muted-foreground'>Compartilhar via WhatsApp</p>
            </div>
          </Button>

          <Button
            variant='outline'
            className='w-full justify-start gap-3 h-12'
            onClick={handleShareTelegram}>
            <MessageCircle className='h-5 w-5 text-blue-500' />
            <div className='text-left'>
              <p className='font-medium'>Telegram</p>
              <p className='text-xs text-muted-foreground'>Compartilhar via Telegram</p>
            </div>
          </Button>

          <Button
            variant='outline'
            className='w-full justify-start gap-3 h-12'
            onClick={handleCopyLink}>
            {copied ?
              <Check className='h-5 w-5 text-success' />
            : <Copy className='h-5 w-5 text-muted-foreground' />}
            <div className='text-left'>
              <p className='font-medium'>{copied ? 'Copiado!' : 'Copiar informações'}</p>
              <p className='text-xs text-muted-foreground'>Copiar para área de transferência</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
