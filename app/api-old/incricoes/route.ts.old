import { NextResponse } from 'next/server';
import {
  vincularEscoteiroAoEvento,
  desvincularEscoteiroDoEvento,
  listarParticipantesDoEvento,
  listarEventosDoEscoteiro
} from '@/services/inscricao.service';

export async function POST(req: Request) {
  const { escoteiroId, eventoId } = await req.json();
  const result = await vincularEscoteiroAoEvento(escoteiroId, eventoId);
  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const { escoteiroId, eventoId } = await req.json();
  const result = await desvincularEscoteiroDoEvento(escoteiroId, eventoId);
  return NextResponse.json(result);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const eventoId = searchParams.get('eventoId');
  const escoteiroId = searchParams.get('escoteiroId');

  if (eventoId) {
    return NextResponse.json(await listarParticipantesDoEvento(eventoId));
  }

  if (escoteiroId) {
    return NextResponse.json(await listarEventosDoEscoteiro(escoteiroId));
  }

  return NextResponse.json({ success: false, message: 'Parâmetros inválidos.' }, { status: 400 });
}
