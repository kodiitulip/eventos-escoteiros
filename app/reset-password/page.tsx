'use client';

import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');

    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      setMsg('Email de redefinição enviado.');
    } catch {
      setMsg('Erro ao enviar email.');
    }
  }

  return (
    <form
      onSubmit={handleReset}
      className='max-w-sm mx-auto mt-20 space-y-4'>
      <h1 className='text-xl font-bold'>Redefinir senha</h1>

      <input
        className='border p-2 w-full'
        placeholder='Seu email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {msg && <p>{msg}</p>}

      <button className='bg-blue-600 text-white p-2 w-full'>Enviar</button>
    </form>
  );
}
