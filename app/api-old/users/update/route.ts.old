import { NextResponse } from 'next/server';
import { adminAuth, adminDB } from '@/lib/firebase-admin';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    const { uid, nome, email } = await req.json();
    const decoded = await verifyAuth(req);

    if (!uid) {
      return NextResponse.json({ message: 'UID obrigatório' }, { status: 400 });
    }

    const isSelf = decoded.uid === uid;
    const isAdmin = decoded.role === 'admin';

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Atualiza no Auth
    await adminAuth.updateUser(uid, {
      ...(nome && { displayName: nome }),
      ...(email && { email })
    });

    // Atualiza no DB
    await adminDB.ref(`users/${uid}`).update({
      ...(nome && { nome }),
      ...(email && { email }),
      atualizadoEm: Date.now()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Erro ao atualizar usuário' }, { status: 500 });
  }
}
