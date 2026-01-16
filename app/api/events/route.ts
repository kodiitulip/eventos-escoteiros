import { NextResponse } from 'next/server';
import { createEvent, updateEvent, softDeleteEvent, listEvents } from '@/services/event.service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await createEvent(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: 'Erro inesperado.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json();
    const result = await updateEvent(id, data);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: 'Erro inesperado.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const result = await softDeleteEvent(id);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: 'Erro inesperado.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    console.log('getting events');
    const result = await listEvents(new URL(req.url).searchParams);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: 'Erro inesperado.' }, { status: 500 });
  }
}
