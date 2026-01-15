import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const decoded = await adminAuth.verifyIdToken(token);

    return NextResponse.json({
      valid: true,
      uid: decoded.uid,
      email: decoded.email
    });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
