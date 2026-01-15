// app/api/users/reset-password/route.ts
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email obrigatório' }, { status: 400 });
    }

    const link = await adminAuth.generatePasswordResetLink(email);

    // por enquanto só log
    console.log('RESET LINK:', link);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
