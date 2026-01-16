import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET() {
  const users = await adminAuth.listUsers(5);
  return NextResponse.json({
    success: true,
    users: users.users.map((u) => ({
      uid: u.uid,
      email: u.email
    }))
  });
}
