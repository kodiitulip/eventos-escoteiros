import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

console.log('ADMIN ENV CHECK:', {
  projectId: process.env.FIREBASE_PROJECT_ID
});

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

const adminApp =
  getApps().length ?
    getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount),
      databaseURL: 'https://eventos-escoteiros-f5055-default-rtdb.firebaseio.com/'
    });

export const adminAuth = getAuth(adminApp);
export const adminDB = getDatabase(adminApp);
