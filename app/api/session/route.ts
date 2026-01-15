import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias em ms

    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn
    });

    // Cria a resposta e seta o cookie nela
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn / 1000 // maxAge em segundos
    });

    return response;
  } catch (error: unknown) {
    let message = 'Unknown error';

    // Verifica se é um Error padrão
    if (error instanceof Error) {
      message = error.message;
    }

    console.error('SESSION ERROR:', message);

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
