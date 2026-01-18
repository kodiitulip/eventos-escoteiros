import { database } from '@/lib/firebase';
import { EventData } from '@/types/event.type';
import { get, ref } from '@firebase/database';
import { cache } from 'react';
import { ScoutData } from './escoteiro';

export const fetchAllEvents = cache(async (): Promise<EventData[]> => {
  const eventsRef = ref(database, 'events');
  const snap = await get(eventsRef);
  if (!snap.exists()) return [];
  const data = snap.val();
  return Object.entries(data).map(([id, events]) => ({ id, ...(events as EventData) }));
});

export const fetchEventByID = cache(async (idToFind: EventData['id']) => {
  const events = await fetchAllEvents();
  return events.find(({ id }) => id === idToFind);
});

export const fetchAllScouts = cache(async (): Promise<(ScoutData & { id: string })[]> => {
  const scoutsRef = ref(database, 'escoteiros');
  const snap = await get(scoutsRef);
  if (!snap.exists()) return [];
  const data = snap.val();
  return Object.entries(data).map(([id, scouts]) => ({ id, ...(scouts as ScoutData) }));
});
