// app/api/expenses/[id]/route.ts
// Actualizar y eliminar gasto específico

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from '@/lib/withAuth';
import { updateExpense, deleteExpense } from '@/lib/dataService';
import { updateExpenseSchema } from '@/lib/schemas';

async function putHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const user = getAuthUser(req);
    const { id } = await params;
    const body = await req.json();

    // Validar con Zod
    const validation = updateExpenseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validación fallida',
          details: validation.error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const expense = await updateExpense(user.userId, user.email, id, validation.data);

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error en PUT /api/expenses/[id]:', error);

    if (error instanceof Error) {
      if (error.message.includes('no encontrado') || error.message.includes('no tienes permisos')) {
        return NextResponse.json(
          { error: 'Gasto no encontrado o no tienes permisos para modificarlo.' },
          { status: 404 }
        );
      }

      if (error.message === 'INVALID_AMOUNT') {
        return NextResponse.json(
          { 
            error: 'Monto inválido.',
            detail: 'El monto del gasto debe ser mayor a cero.'
          },
          { status: 400 }
        );
      }

      if (error.message.includes('modo seed')) {
        return NextResponse.json(
          { error: 'El sistema aún no está inicializado.' },
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

async function deleteHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const user = getAuthUser(req);
    const { id } = await params;

    await deleteExpense(user.userId, user.email, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en DELETE /api/expenses/[id]:', error);

    if (error instanceof Error) {
      if (error.message.includes('no encontrado') || error.message.includes('no tienes permisos')) {
        return NextResponse.json(
          { error: 'Gasto no encontrado o no tienes permisos para eliminarlo.' },
          { status: 404 }
        );
      }

      if (error.message.includes('modo seed')) {
        return NextResponse.json(
          { error: 'El sistema aún no está inicializado.' },
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
