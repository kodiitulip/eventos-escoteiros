import { createUserWithEmailAndPassword, sendEmailVerification, getAuth } from 'firebase/auth';

import { validateUserCreate } from '@/validators/user.validator';
import { saveUser, updateUser } from '@/repositories/user.repository';
import { User } from '@/types/user.type';
import { app } from '@/lib/firebase';
import { adminAuth } from '@/lib/firebase-admin';

export async function createUser(data: { nome: string; email: string; senha: string; cargo: 'ADMIN' | 'ASSISTENTE' }) {
  validateUserCreate(data);

  const auth = getAuth(app);

  // 🔐 cria usuário no Auth
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.senha);

  const uid = userCredential.user.uid;

  // 📧 envia email de confirmação
  await sendEmailVerification(userCredential.user);

  const now = new Date().toISOString();

  const user: User = {
    uid,
    nome: data.nome,
    email: data.email,
    cargo: data.cargo,
    ativo: true,
    createdAt: now,
    updatedAt: now
  };

  await saveUser(user);

  return {
    success: true,
    message: 'Usuário criado. Verifique o email.',
    uid
  };
}

export async function deactivateUser(uid: string) {
  await updateUser(uid, {
    ativo: false,
    updatedAt: new Date().toISOString()
  });
}

export async function makeUserAdmin(uid: string) {
  if (!uid) {
    throw new Error('UID é obrigatório');
  }

  // Define o role como admin
  await adminAuth.setCustomUserClaims(uid, {
    role: 'admin'
  });

  return { success: true };
}
