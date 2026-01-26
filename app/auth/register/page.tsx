'use client';

import Loading from '@/app/loading';
import { useAuth } from '@/app/providers/auth-provider';
import { ScoutLogoX256 } from '@/components/scout-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { RegisterData, RegisterDataInput, RegisterDataOutput, RegisterSchema } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff, UserPlus2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading, router]);

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<RegisterDataInput, unknown, RegisterDataOutput>({
    resolver: zodResolver(RegisterSchema),
  });

  const handleRegister = async (data: RegisterData) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Usuário Criado',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Houve um erro ao Registrar a conta',
        description: 'Error: ' + (error instanceof Error ? error.message : `${error}`),
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className='min-h-screen bg-linear-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6 animate-fade-in'>
        <div className='flex flex-col items-center space-y-4'>
          <ScoutLogoX256 className='size-20' />
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-foreground'>Sistema de Eventos</h1>
            <p className='text-muted-foreground'>14º GEABEG</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-center'>Registrar</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(handleRegister)}
              className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>E-mail</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='seu@email.com'
                  {...register('email', { required: true })}
                />
                {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Senha</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••'
                    {...register('password', { required: true })}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3'
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ?
                      <EyeOff className='h-4 w-4' />
                    : <Eye className='h-4 w-4' />}
                  </Button>
                </div>
                {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirm-password'>Senha</Label>
                <div className='relative'>
                  <Input
                    id='confirm-password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••'
                    {...register('confirmPassword', { required: true })}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3'
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ?
                      <EyeOff className='h-4 w-4' />
                    : <Eye className='h-4 w-4' />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={isLoading}>
                {isLoading ?
                  'Registrando...'
                : <>
                    <UserPlus2 className='mr-2 h-4 w-4' />
                    Registrar
                  </>
                }
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className='text-center text-sm text-muted-foreground'>© {new Date().getFullYear()} 14º GEABEG</p>
      </div>
    </div>
  );
}
