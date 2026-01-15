import { ref, push, set, get, update, child } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Event } from '@/types/event.type';

const EVENTS_PATH = 'events';

export async function saveEvent(event: Event): Promise<string> {
  const newRef = push(ref(database, EVENTS_PATH));
  await set(newRef, event);
  return newRef.key!;
}

export async function getEventById(id: string): Promise<Event | null> {
  const snapshot = await get(child(ref(database), `${EVENTS_PATH}/${id}`));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function updateEventInDB(id: string, data: Partial<Event>) {
  await update(ref(database, `${EVENTS_PATH}/${id}`), data);
}

export async function deleteEventFromDB(id: string) {
  await set(ref(database, `${EVENTS_PATH}/${id}`), null);
}

export async function findEventByNameAndDate(nome: string, dataInicio: string): Promise<Event | null> {
  const snapshot = await get(ref(database, EVENTS_PATH));
  if (!snapshot.exists()) return null;

  const events = snapshot.val();

  for (const id in events) {
    const event = events[id];
    if (event.nome === nome && event.dataInicio === dataInicio && event.ativo) {
      return { ...event, id };
    }
  }

  return null;
}
