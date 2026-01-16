import { adminAuth } from '@/lib/firebase-admin';

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token não fornecido');
  }

  const token = authHeader.replace('Bearer ', '');

  const decodedToken = await adminAuth.verifyIdToken(token);

  return decodedToken;
}
