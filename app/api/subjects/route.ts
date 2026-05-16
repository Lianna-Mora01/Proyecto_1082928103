// app/api/subjects/route.ts
// GET: Lista todas las materias activas del usuario
// POST: Crea una nueva materia

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from '@/lib/withAuth';
import { getSubjectsByUser, createSubject } from '@/lib/dataService';
import { createSubjectSchema } from '@/lib/schemas';

async function getHandler(req: NextRequest): Promise<Response> {
  try {
    const user = getAuthUser(req);
    const subjects = await getSubjectsByUser(user.userId);

    return NextResponse.json({ subjects }, { status: 200 });
  } catch (error) {
    console.error('/api/subjects GET error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);

async function postHandler(req: NextRequest): Promise<Response> {
  try {
    const user = getAuthUser(req);
    const body = await req.json();

    // Validar entrada
    const validation = createSubjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.issues },
        { status: 400 }
      );
    }

    const subject = await createSubject(user.userId, user.email, validation.data);

    return NextResponse.json({ subject }, { status: 201 });
  } catch (error) {
    console.error('/api/subjects POST error:', error);

    if (error instanceof Error) {
      if (error.message.includes('No se pueden crear')) {
        return NextResponse.json(
          { error: 'Sistema no inicializado. Ejecuta el bootstrap primero.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}