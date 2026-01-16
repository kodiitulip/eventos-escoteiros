import { NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebase-admin';
import { verifyAuth } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const decoded = await verifyAuth(req);

    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const escoteiroId = params.id;
    const dados = await req.json();

    if (!escoteiroId) {
      return NextResponse.json({ success: false, message: 'ID do escoteiro não informado' }, { status: 400 });
    }

    const ref = adminDB.ref(`escoteiros/${escoteiroId}`);
    const snapshot = await ref.once('value');

    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, message: 'Escoteiro não encontrado' }, { status: 404 });
    }

    if (dados.nome || dados.dataNascimento) {
      const checkSnap = await adminDB.ref('escoteiros').orderByChild('nome').equalTo(dados.nome).once('value');

      if (checkSnap.exists()) {
        const escoteiros = checkSnap.val();

        const duplicado = Object.entries(escoteiros).some(
          ([id, e]: any) => id !== escoteiroId && e.dataNascimento === dados.dataNascimento
        );

        if (duplicado) {
          return NextResponse.json(
            { success: false, message: 'Já existe um escoteiro com esses dados' },
            { status: 409 }
          );
        }
      }
    }

    const updateData = {
      ...dados,
      atualizadoEm: Date.now()
    };

    await ref.update(updateData);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao atualizar escoteiro' },
      { status: 500 }
    );
  }
}
