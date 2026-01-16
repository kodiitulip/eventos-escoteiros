import { ref, push, set, get, remove, update } from 'firebase/database';
import { database } from '@/lib/firebase';

const INSCRICAO_PATH = 'escoteiro_evento';
const EVENTO_PARTICIPANTES = 'eventos_participantes';
const ESCOTEIRO_EVENTOS = 'escoteiro_eventos';

export async function createInscricao(escoteiroId: string, eventoId: string) {
  const refInscricao = push(ref(database, INSCRICAO_PATH));

  const payload = {
    escoteiroId,
    eventoId,
    dataInscricao: new Date().toISOString()
  };

  await set(refInscricao, payload);

  await update(ref(database), {
    [`${EVENTO_PARTICIPANTES}/${eventoId}/${escoteiroId}`]: true,
    [`${ESCOTEIRO_EVENTOS}/${escoteiroId}/${eventoId}`]: true
  });

  return refInscricao.key!;
}

export async function removeInscricao(escoteiroId: string, eventoId: string) {
  await update(ref(database), {
    [`${EVENTO_PARTICIPANTES}/${eventoId}/${escoteiroId}`]: null,
    [`${ESCOTEIRO_EVENTOS}/${escoteiroId}/${eventoId}`]: null
  });
}

export async function isEscoteiroInscrito(escoteiroId: string, eventoId: string): Promise<boolean> {
  const snapshot = await get(ref(database, `${EVENTO_PARTICIPANTES}/${eventoId}/${escoteiroId}`));

  return snapshot.exists();
}

export async function listParticipantesByEvento(eventoId: string) {
  const snapshot = await get(ref(database, `${EVENTO_PARTICIPANTES}/${eventoId}`));

  return snapshot.exists() ? Object.keys(snapshot.val()) : [];
}

export async function listEventosByEscoteiro(escoteiroId: string) {
  const snapshot = await get(ref(database, `${ESCOTEIRO_EVENTOS}/${escoteiroId}`));

  return snapshot.exists() ? Object.keys(snapshot.val()) : [];
}
