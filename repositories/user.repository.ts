//repositories/user.repository.ts;
import { ref, set, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { User } from '@/types/user.type';

const USERS_PATH = 'users';

export async function saveUser(user: User) {
  await set(ref(database, `${USERS_PATH}/${user.uid}`), user);
}

export async function updateUser(uid: string, data: Partial<User>) {
  await update(ref(database, `${USERS_PATH}/${uid}`), data);
}
