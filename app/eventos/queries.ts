import { database } from '@/lib/firebase';
import { Event } from '@/types/event.type';
import { get, ref } from '@firebase/database';
import { cache } from 'react';

export const fetchAllEvents = cache(async (): Promise<Event[]> => {
  const eventsRef = ref(database, 'events');
  const snap = await get(eventsRef);
  if (!snap.exists()) return [];
  const data = snap.val();
  return Object.entries(data).map(([id, events]) => ({ id, ...(events as Event) }));
});

export const fetchEventByID = cache(async (idToFind: Event['id']) => {
  const events = await fetchAllEvents();
  return events.find(({ id }) => id === idToFind);
});
