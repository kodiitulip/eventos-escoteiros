import { database } from '@/lib/firebase';
import { get, ref } from '@firebase/database';
import { cache } from 'react';
import { EventFormData, ScoutData } from './escoteiro';

export type EventFormDataId = EventFormData & { id: string };
export type ScoutDataId = ScoutData & { id: string };

export const fetchAllEvents = cache(async (): Promise<EventFormDataId[]> => {
  const eventsRef = ref(database, 'events');
  const snap = await get(eventsRef);
  if (!snap.exists()) return [];
  const data = snap.val();
  return Object.entries(data).map(([id, events]) => ({ id, ...(events as EventFormData) }) as EventFormDataId);
});

export const fetchEventByID = cache(async (idToFind: string) => {
  const events = await fetchAllEvents();
  return events.find(({ id }) => id === idToFind);
});

export const fetchAllScouts = cache(async (): Promise<ScoutDataId[]> => {
  const scoutsRef = ref(database, 'escoteiros');
  const snap = await get(scoutsRef);
  if (!snap.exists()) return [];
  const data = snap.val();
  return Object.entries(data).map(([id, scouts]) => ({ id, ...(scouts as ScoutData) }));
});

export const fetchScoutByID = cache(async (idToFind: string) => {
  const scouts = await fetchAllScouts();
  return scouts.find(({ id }) => id === idToFind);
});

export const fetchScoutsByIDs = cache(async (idsToFind: string[]) => {
  const scouts = await fetchAllScouts();
  return scouts.filter(({ id }) => idsToFind.includes(id));
});
