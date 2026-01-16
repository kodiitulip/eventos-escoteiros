import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { adminDB } from '@/lib/firebase-admin';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const decoded = await verifyAuth(req);

    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { nome, email, senha, cargo } = await req.json();

    if (!email || !senha) {
      return NextResponse.json({ success: false, message: 'Dados inválidos' }, { status: 400 });
    }

    const user = await adminAuth.createUser({
      email,
      password: senha,
      displayName: nome,
      emailVerified: false
    });

    await adminDB.ref(`users/${user.uid}`).set({
      nome,
      email,
      cargo,
      ativo: true,
      criadoEm: Date.now()
    });

    return NextResponse.json({ success: true, uid: user.uid });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Erro ao criar usuário' }, { status: 500 });
  }
}
