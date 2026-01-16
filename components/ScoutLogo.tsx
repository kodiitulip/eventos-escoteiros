import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ScoutLogoProps {
  className?: string;
}

export function ScoutLogo({ className }: ScoutLogoProps) {
  return (
    <Image
      src='/logo-geabeg.jpg'
      alt='Logo 14º GEABEG - Grupo de Escoteiros do Ar Brigadeiro Eduardo Gomes'
      width={40}
      height={40}
      className={cn('h-10 w-auto object-contain', className)}
    />
  );
}
