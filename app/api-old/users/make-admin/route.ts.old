import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();
    const decoded = await verifyAuth(req);

    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    if (!uid) {
      return NextResponse.json({ message: 'UID obrigatório' }, { status: 400 });
    }

    await adminAuth.setCustomUserClaims(uid, {
      role: 'admin'
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Erro ao tornar admin' }, { status: 500 });
  }
}
