'use server';

import { adminAuth } from '@/lib/firebase-admin';
import { cache } from 'react';

export const fetchAllAccess = cache(async () => {
  const result = await adminAuth.listUsers();

  return result.users.map(({ uid, email }) => ({ uid, email }));
});
