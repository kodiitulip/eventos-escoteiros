import { NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebase-admin';

export async function GET() {
  await adminDB.ref('testes/admin').set({
    status: 'ok',
    timestamp: Date.now()
  });

  return NextResponse.json({ success: true });
}
