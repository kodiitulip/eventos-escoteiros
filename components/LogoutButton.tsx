'use client';

import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const auth = getAuth(app);
    await signOut(auth);
    router.push('/login');
  }

  return (
    <button
      onClick={handleLogout}
      className='bg-red-600 text-white px-4 py-2 rounded'>
      Sair
    </button>
  );
}
