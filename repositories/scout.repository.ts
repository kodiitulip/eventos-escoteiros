import { ref, get, child } from 'firebase/database';
import { database } from '@/lib/firebase';

const SCOUTS_PATH = 'escoteiros';

export interface Scout {
  id: string;
  nome: string;
  ativo: boolean;
}

export async function getScoutById(id: string): Promise<Scout | null> {
  const snapshot = await get(child(ref(database), `${SCOUTS_PATH}/${id}`));

  if (!snapshot.exists()) return null;

  return {
    id,
    ...snapshot.val()
  };
}
