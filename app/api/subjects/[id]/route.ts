// app/api/subjects/[id]/route.ts
// PUT: Actualiza una materia
// DELETE: Desactiva una materia (soft delete)

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/withAuth';
import { updateSubject, deactivateSubject } from '@/lib/dataService';
import { updateSubjectSchema } from '@/lib/schemas';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const user = getAuthUser(req);
    const { id } = await params;
    const body = await req.json();

    // Validar entrada
    const validation = updateSubjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.issues },
        { status: 400 }
      );
    }

    const subject = await updateSubject(user.userId, user.email, id, validation.data);

    return NextResponse.json({ subject }, { status: 200 });
  } catch (error) {
    console.error('/api/subjects/[id] PUT error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Materia no encontrada')) {
        return NextResponse.json(
          { error: 'Materia no encontrada o no tienes permisos' },
          { status: 404 }
        );
      }
      if (error.message.includes('No se pueden actualizar')) {
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

export async function DELETE(req: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const user = getAuthUser(req);
    const { id } = await params;

    await deactivateSubject(user.userId, user.email, id);

    return NextResponse.json(
      { message: 'Materia desactivada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('/api/subjects/[id] DELETE error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Materia no encontrada')) {
        return NextResponse.json(
          { error: 'Materia no encontrada o no tienes permisos' },
          { status: 404 }
        );
      }
      if (error.message.includes('ya está desactivada')) {
        return NextResponse.json(
          { error: 'La materia ya está desactivada' },
          { status: 409 }
        );
      }
      if (error.message.includes('No se pueden desactivar')) {
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