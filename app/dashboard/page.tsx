'use client'; // <--- MUITO IMPORTANTE

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const user = auth.currentUser;

      if (user) {
        const idToken = await user.getIdToken(true);
        setToken(idToken);
        console.log('TOKEN DO USUÁRIO:', idToken);
      } else {
        console.log('Nenhum usuário logado');
      }
    };

    const unsubscribe = auth.onAuthStateChanged(() => {
      getToken();
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Usuário autenticado 🎉</p>
      {token && (
        <div>
          <h2>Token JWT:</h2>
          <textarea
            value={token}
            readOnly
            style={{ width: '100%', height: '100px' }}
          />
        </div>
      )}
    </div>
  );
}
