import { AppLayout } from '@/components/layout/AppLayout';
import { LoaderIcon } from 'lucide-react';

const LoadingPage = () => (
  <AppLayout>
    <div className='flex h-full items-center justify-center'>
      <LoaderIcon
        className='animate-spin'
        size={40}
      />
      <span className='sr-only'>Carregando</span>
    </div>
  </AppLayout>
);

export default LoadingPage;
