'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const cred = await signInWithEmailAndPassword(auth, email, senha);
      const token = await cred.user.getIdToken();

      // envia token para backend
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      router.replace('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erro no login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder='Senha'
        type='password'
        onChange={(e) => setSenha(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </div>
  );
}
