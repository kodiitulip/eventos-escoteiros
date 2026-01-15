import { Event } from '@/types/event.type';
import { validateEventData } from '@/validators/event.validator';
import {
  saveEvent,
  updateEventInDB,
  deleteEventFromDB,
  getEventById,
  findEventByNameAndDate
} from '@/repositories/event.repository';

async function validateUniqueEventName(nome: string, dataInicio: Date, eventId?: string) {
  const existing = await findEventByNameAndDate(nome, dataInicio);

  if (existing && existing.id !== eventId) {
    throw new Error('Já existe um evento com esse nome nessa data.');
  }
}

export async function createEvent(data: Event) {
  validateEventData(data);
  await validateUniqueEventName(data.nome, data.dataInicio);

  const newEvent: Event = {
    ...data,
    inscritosCount: 0,
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const id = await saveEvent(newEvent);

  return {
    success: true,
    message: 'Evento criado com sucesso.',
    eventId: id
  };
}

export async function updateEvent(eventId: string, data: Event) {
  const existingEvent = await getEventById(eventId);

  if (!existingEvent) {
    throw new Error('Evento não encontrado.');
  }

  validateEventData(data);
  await validateUniqueEventName(data.nome, data.dataInicio, eventId);

  if (existingEvent.inscritosCount > 0) {
    if (data.dataInicio.getTime() !== existingEvent.dataInicio.getTime()) {
      throw new Error('Não é possível alterar a data de um evento com inscritos.');
    }

    if (data.limiteVagas < existingEvent.limiteVagas) {
      throw new Error('Não é possível reduzir o limite de vagas com inscritos.');
    }
  }

  await updateEventInDB(eventId, {
    ...data,
    updatedAt: new Date()
  });

  return {
    success: true,
    message: 'Evento atualizado com sucesso.'
  };
}

export async function softDeleteEvent(eventId: string) {
  const event = await getEventById(eventId);

  if (!event) {
    throw new Error('Evento não encontrado.');
  }

  await updateEventInDB(eventId, {
    ativo: false,
    updatedAt: new Date()
  });

  return {
    success: true,
    message: 'Evento desativado com sucesso.'
  };
}
