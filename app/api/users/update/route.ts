import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { adminDB } from '@/lib/firebase-admin';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    const { uid, nome, email } = await req.json();
    const decoded = await verifyAuth(req);

    if (decoded.role != 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    if (!uid) {
      return NextResponse.json({ success: false, message: 'UID obrigatório' }, { status: 400 });
    }

    // 1. Atualiza no Auth
    await adminAuth.updateUser(uid, {
      ...(nome && { displayName: nome }),
      ...(email && { email })
    });

    // 2. Atualiza no Database
    await adminDB.ref(`users/${uid}`).update({
      ...(nome && { nome }),
      ...(email && { email }),
      atualizadoEm: Date.now()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Unauthorized' }, { status: 401 });
  }
}
