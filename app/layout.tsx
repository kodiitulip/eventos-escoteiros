import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: '14º GEABEG - Sistema de Eventos',
  description: 'Sistema de gerenciamento de eventos do 14º Grupo de Escoteiros do Ar Brigadeiro Eduardo Gomes'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br'>
      <body className='antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
