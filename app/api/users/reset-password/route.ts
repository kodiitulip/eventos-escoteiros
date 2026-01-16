import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();
    const decoded = await verifyAuth(req);

    if (!uid) {
      return NextResponse.json({ message: 'UID obrigatório' }, { status: 400 });
    }

    const isSelf = decoded.uid === uid;
    const isAdmin = decoded.role === 'admin';

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const user = await adminAuth.getUser(uid);

    const link = await adminAuth.generatePasswordResetLink(user.email!);

    // TODO: enviar email
    console.log('RESET LINK:', link);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Erro ao resetar senha' }, { status: 500 });
  }
}
