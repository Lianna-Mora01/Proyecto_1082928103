// app/api/tasks/[id]/complete/route.ts
// POST: Marca una tarea como completada (acción irreversible)
// RN-05: Endpoint separado porque completar es una acción de negocio irreversible, no una edición

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from '@/lib/withAuth';
import { completeTask } from '@/lib/dataService';

async function postHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const user = getAuthUser(req);
    const { id: taskId } = await params;

    const task = await completeTask(user.userId, user.email, taskId);

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error('/api/tasks/[id]/complete POST error:', error);

    if (error instanceof Error) {
      if (error.message.includes('no tienes permisos')) {
        return NextResponse.json(
          { error: 'Tarea no encontrada o no tienes permisos' },
          { status: 403 }
        );
      }
      if (error.message.includes('ya está completada')) {
        return NextResponse.json(
          { error: 'Esta tarea ya está completada' },
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

export const POST = withAuth(postHandler);
