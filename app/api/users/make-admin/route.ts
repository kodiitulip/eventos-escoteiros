import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { makeUserAdmin } from '@/services/user.service';

export async function POST(req: Request) {
  try {
    const decoded = await verifyAuth(req);

    if (decoded.role != 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ message: 'UID obrigatório' }, { status: 400 });
    }

    await makeUserAdmin(uid);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Unauthorized' }, { status: 401 });
  }
}
