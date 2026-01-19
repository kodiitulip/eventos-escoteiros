import { database } from '@/lib/firebase';
import { update, ref, push, remove } from '@firebase/database';
import { EventFormData, ScoutData } from './escoteiro';

export const pushScout = async (data: ScoutData) => {
  const scoutRef = ref(database, 'escoteiros');
  const newRef = await push(scoutRef, data);
  return newRef.key;
};

export const updateScout = (id: string, data: Partial<ScoutData>) => {
  const scoutRef = ref(database, `escoteiros/${id}`);
  update(scoutRef, data);
};

export const removeScout = (id: string) => {
  const scoutRef = ref(database, `escoteiros/${id}`);
  remove(scoutRef);
};

export const pushEvent = async (data: EventFormData) => {
  const eventRef = ref(database, 'events');
  const newRef = await push(eventRef, data);
  return newRef.key;
};

export const updateEvent = (id: string, data: Partial<EventFormData>) => {
  const eventRef = ref(database, `events/${id}`);
  update(eventRef, data);
};

export const removeEvent = (id: string) => {
  const eventRef = ref(database, `events/${id}`);
  remove(eventRef);
};
