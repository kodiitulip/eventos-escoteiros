import { database } from '@/lib/firebase';
import { update, ref, push, remove } from '@firebase/database';
import { ScoutData } from './escoteiro';

export const pushScout = async (data: ScoutData) => {
  const scoutRef = ref(database, 'escoteiros');
  const newRef = await push(scoutRef, data);
  return newRef.key;
};

export const updateScout = (id: string, data: ScoutData) => {
  const scoutRef = ref(database, `escoteiros/${id}`);
  update(scoutRef, data);
};

export const removeScout = (id: string) => {
  const scoutRef = ref(database, `escoteiros/${id}`);
  remove(scoutRef);
};
