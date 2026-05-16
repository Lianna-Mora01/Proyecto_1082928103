// app/api/tasks/[id]/route.ts
// GET: Obtiene una tarea específica
// PUT: Actualiza una tarea (campos editables)
// DELETE: Elimina una tarea

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from '@/lib/withAuth';
import { getTasks, updateTask, deleteTask } from '@/lib/dataService';
import { updateTaskSchema } from '@/lib/schemas';

async function getHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const user = getAuthUser(req);
    const { id: taskId } = await params;

    // Obtener todas las tareas y filtrar por ID
    const tasks = await getTasks(user.userId);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      return NextResponse.json(
        { error: 'Tarea no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error('/api/tasks/[id] GET error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function putHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const user = getAuthUser(req);
    const { id: taskId } = await params;
    const body = await req.json();

    // Validar entrada
    const validation = updateTaskSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.issues },
        { status: 400 }
      );
    }

    // RN-05: Si la tarea está completada, no se puede editar
    const task = await updateTask(user.userId, user.email, taskId, validation.data);

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error('/api/tasks/[id] PUT error:', error);

    if (error instanceof Error) {
      if (error.message.includes('no tienes permisos')) {
        return NextResponse.json(
          { error: 'Tarea no encontrada o no tienes permisos' },
          { status: 403 }
        );
      }
      // RN-05: Tarea completada no se puede modificar
      if (error.message.includes('No se puede modificar una tarea completada')) {
        return NextResponse.json(
          { error: 'No se puede modificar una tarea completada' },
          { status: 400 }
        );
      }
      if (error.message.includes('fecha límite no puede')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
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
    const { id: taskId } = await params;

    await deleteTask(user.userId, user.email, taskId);

    return NextResponse.json({ message: 'Tarea eliminada' }, { status: 200 });
  } catch (error) {
    console.error('/api/tasks/[id] DELETE error:', error);

    if (error instanceof Error) {
      if (error.message.includes('no tienes permisos')) {
        return NextResponse.json(
          { error: 'Tarea no encontrada o no tienes permisos' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
