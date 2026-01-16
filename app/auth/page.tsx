'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScoutLogo } from '@/components/ScoutLogo';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Auth() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const token = await cred.user.getIdToken();

      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Houve um erro ao fazer login',
        description: 'Tente novamente mais tarde',
        variant: 'destructive'
      });
      router.push('/');
    } finally {
      setTimeout(() => {
        toast({
          title: 'Login realizado!',
          description: 'Bem-vindo ao sistema.'
        });
        router.push('/');
        setIsLoading(false);
      }, 1000);
    }

    // Mock login - would use real auth in implementation
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6 animate-fade-in'>
        <div className='flex flex-col items-center space-y-4'>
          <ScoutLogo className='h-20' />
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-foreground'>Sistema de Eventos</h1>
            <p className='text-muted-foreground'>14º GEABEG</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-center'>Entrar</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleLogin}
              className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='login-email'>E-mail</Label>
                <Input
                  id='login-email'
                  type='email'
                  placeholder='seu@email.com'
                  value={loginData.email}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='login-password'>Senha</Label>
                <div className='relative'>
                  <Input
                    id='login-password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={loginData.password}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                    required
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
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={isLoading}>
                {isLoading ?
                  'Entrando...'
                : <>
                    <LogIn className='mr-2 h-4 w-4' />
                    Entrar
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
