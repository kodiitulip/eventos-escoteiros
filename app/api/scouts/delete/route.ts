import { NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebase-admin';
import { verifyAuth } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const decoded = await verifyAuth(req);

    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const escoteiroId = params.id;

    if (!escoteiroId) {
      return NextResponse.json({ success: false, message: 'ID do escoteiro não informado' }, { status: 400 });
    }

    const ref = adminDB.ref(`escoteiros/${escoteiroId}`);
    const snapshot = await ref.once('value');

    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, message: 'Escoteiro não encontrado' }, { status: 404 });
    }

    await ref.update({
      ativo: false,
      removidoEm: Date.now()
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao remover escoteiro' },
      { status: 500 }
    );
  }
}
