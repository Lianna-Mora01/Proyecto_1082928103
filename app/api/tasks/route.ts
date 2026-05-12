// app/api/tasks/route.ts
// GET: Lista todas las tareas del usuario (filtrable por estado y materia)
// POST: Crea una nueva tarea

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/withAuth';
import { getTasks, createTask } from '@/lib/dataService';
import { createTaskSchema } from '@/lib/schemas';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const user = getAuthUser(req);

    // Filtros opcionales: ?status=pendiente&subject_id=...
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as 'pendiente' | 'completada' | null;
    const subject_id = searchParams.get('subject_id');

    const filters: any = {};
    if (status) filters.status = status;
    if (subject_id) filters.subject_id = subject_id;

    const tasks = await getTasks(user.userId, filters);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('/api/tasks GET error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const user = getAuthUser(req);
    const body = await req.json();

    // Validar entrada con Zod
    // RN-02: Requiere title, due_date
    // RN-03: Fecha límite no puede ser pasada (validado en schema)
    // RN-14: subject_id puede ser null
    const validation = createTaskSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.issues },
        { status: 400 }
      );
    }

    const task = await createTask(user.userId, user.email, validation.data);

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('/api/tasks POST error:', error);

    if (error instanceof Error) {
      if (error.message.includes('No se pueden crear')) {
        return NextResponse.json(
          { error: 'Sistema no inicializado. Ejecuta el bootstrap primero.' },
          { status: 503 }
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
