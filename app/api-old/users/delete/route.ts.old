import { NextResponse } from 'next/server';
import { adminAuth, adminDB } from '@/lib/firebase-admin';
import { verifyAuth } from '@/lib/auth';

export async function DELETE(req: Request) {
  try {
    // Verifica se quem chamou é admin
    const decoded = await verifyAuth(req);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ message: 'UID obrigatório' }, { status: 400 });
    }

    // 1️⃣ Exclui usuário do Firebase Auth
    await adminAuth.deleteUser(uid);

    // 2️⃣ Remove usuário do Realtime Database
    await adminDB.ref(`users/${uid}`).remove();

    return NextResponse.json({ success: true, message: 'Usuário excluído com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Erro ao excluir usuário' }, { status: 500 });
  }
}
