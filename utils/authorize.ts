import { get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { ref } from 'firebase/database';

export async function authorize(uid: string, cargosPermitidos: string[]) {
  const snapshot = await get(ref(database, `users/${uid}`));

  if (!snapshot.exists()) {
    throw new Error('Usuário não encontrado');
  }

  const user = snapshot.val();

  if (!user.ativo) {
    throw new Error('Usuário inativo');
  }

  if (!cargosPermitidos.includes(user.cargo)) {
    throw new Error('Sem permissão');
  }

  return user;
}
