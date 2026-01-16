import {
  createInscricao,
  removeInscricao,
  isEscoteiroInscrito,
  listParticipantesByEvento,
  listEventosByEscoteiro
} from '@/repositories/inscricao.repository';

import { getEventById, updateEventInDB } from '@/repositories/event.repository';
import { getScoutById } from '@/repositories/scout.repository';

export async function vincularEscoteiroAoEvento(escoteiroId: string, eventoId: string) {
  const escoteiro = await getScoutById(escoteiroId);
  if (!escoteiro) throw new Error('Escoteiro não encontrado.');

  const evento = await getEventById(eventoId);
  if (!evento || !evento.ativo) {
    throw new Error('Evento não encontrado ou inativo.');
  }

  if (evento.inscritosCount >= evento.limiteVagas) {
    throw new Error('Evento sem vagas disponíveis.');
  }

  const jaInscrito = await isEscoteiroInscrito(escoteiroId, eventoId);
  if (jaInscrito) {
    throw new Error('Escoteiro já inscrito neste evento.');
  }

  await createInscricao(escoteiroId, eventoId);

  await updateEventInDB(eventoId, {
    inscritosCount: evento.inscritosCount + 1
  });

  return {
    success: true,
    message: 'Escoteiro inscrito no evento com sucesso.'
  };
}

export async function desvincularEscoteiroDoEvento(escoteiroId: string, eventoId: string) {
  const evento = await getEventById(eventoId);
  if (!evento) throw new Error('Evento não encontrado.');

  const inscrito = await isEscoteiroInscrito(escoteiroId, eventoId);
  if (!inscrito) {
    throw new Error('Inscrição não encontrada.');
  }

  await removeInscricao(escoteiroId, eventoId);

  await updateEventInDB(eventoId, {
    inscritosCount: Math.max(0, evento.inscritosCount - 1)
  });

  return {
    success: true,
    message: 'Inscrição removida com sucesso.'
  };
}

export async function listarParticipantesDoEvento(eventoId: string) {
  const participantesIds = await listParticipantesByEvento(eventoId);

  return {
    success: true,
    total: participantesIds.length,
    participantes: participantesIds
  };
}


export async function listarEventosDoEscoteiro(escoteiroId: string) {
  const eventosIds = await listEventosByEscoteiro(escoteiroId);

  return {
    success: true,
    total: eventosIds.length,
    eventos: eventosIds
  };
}
