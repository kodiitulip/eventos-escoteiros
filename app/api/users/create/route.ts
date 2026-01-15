//app/api/users/route.ts
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { adminDB } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
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
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
