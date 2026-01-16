import { EventData, EventType } from '@/types/event.type';
import { validateEventData } from '@/validators/event.validator';
import { saveEvent, updateEventInDB, getEventById, findEventByNameAndDate } from '@/repositories/event.repository';

import { listAllEvents } from '@/repositories/event.repository';
import { applyEventFilters } from './event.filter';
import { mapEventListItem } from './event.mapper';

async function validateUniqueEventName(nome: string, dataInicio: Date | string, eventId?: string) {
  if (typeof dataInicio === 'string') dataInicio = new Date(dataInicio);
  const existing = await findEventByNameAndDate(nome, dataInicio.toISOString());

  if (existing && existing.id !== eventId) {
    throw new Error('Já existe um evento com esse nome nessa data.');
  }
}

export async function createEvent(data: EventData) {
  validateEventData(data);
  await validateUniqueEventName(data.nome, data.dataInicio);

  const newEvent: EventData = {
    ...data,
    inscritosCount: 0,
    ativo: true,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString()
  };

  const id = await saveEvent(newEvent);

  return {
    success: true,
    message: 'Evento criado com sucesso.',
    eventId: id
  };
}

export async function updateEvent(eventId: string, data: EventData) {
  const existingEvent = await getEventById(eventId);

  if (!existingEvent) {
    throw new Error('Evento não encontrado.');
  }

  validateEventData(data);
  await validateUniqueEventName(data.nome, data.dataInicio, eventId);
  const [dataIn, existingDataIn] = [new Date(data.dataInicio), new Date(existingEvent.dataInicio)];

  if (existingEvent.inscritosCount > 0) {
    if (dataIn.getTime() !== existingDataIn.getTime()) {
      throw new Error('Não é possível alterar a data de um evento com inscritos.');
    }

    if (data.limiteVagas < existingEvent.limiteVagas) {
      throw new Error('Não é possível reduzir o limite de vagas com inscritos.');
    }
  }

  await updateEventInDB(eventId, {
    ...data,
    updatedAt: new Date().toString()
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
    updatedAt: new Date().toString()
  });

  return {
    success: true,
    message: 'Evento desativado com sucesso.'
  };
}

export async function listEvents(searchParams: URLSearchParams) {
  const filters = {
    nome: searchParams.get('nome') || undefined,
    local: searchParams.get('local') || undefined,

    ativo: searchParams.get('ativo') ? searchParams.get('ativo') === 'true' : undefined,

    dataInicio: searchParams.get('dataInicio') ? new Date(searchParams.get('dataInicio')!) : undefined,

    dataFim: searchParams.get('dataFim') ? new Date(searchParams.get('dataFim')!) : undefined,

    valorMin: searchParams.get('valorMin') ? Number(searchParams.get('valorMin')) : undefined,

    valorMax: searchParams.get('valorMax') ? Number(searchParams.get('valorMax')) : undefined,

    tipo: searchParams.get('tipo') ? (searchParams.get('tipo') as EventType) : undefined,

    ordenarPor: (searchParams.get('ordenarPor') as keyof EventData) || 'dataInicio',
    ordem: (searchParams.get('ordem') === 'desc' ? 'desc' : 'asc') as 'desc' | 'asc',

    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 10)
  };

  let events = await listAllEvents();

  events = applyEventFilters(events, filters);

  const total = events.length;
  const offset = (filters.page - 1) * filters.limit;

  const data = events.slice(offset, offset + filters.limit).map(mapEventListItem);

  if (data.length === 0) {
    return {
      success: true,
      message: 'Nenhum evento encontrado.',
      data: [],
      total
    };
  }

  return {
    success: true,
    page: filters.page,
    limit: filters.limit,
    total,
    data
  };
}
