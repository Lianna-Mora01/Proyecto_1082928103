// app/api/expenses/route.ts
// CRUD para gastos

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/withAuth';
import { getExpenses, createExpense } from '@/lib/dataService';
import { createExpenseSchema } from '@/lib/schemas';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const user = getAuthUser(req);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const payment_method = searchParams.get('payment_method') || undefined;
    const month = searchParams.get('month') || undefined; // YYYY-MM

    const expenses = await getExpenses(user.userId, { category, payment_method, month });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error en GET /api/expenses:', error);
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

    // Validar con Zod (RN-01: monto debe ser > 0)
    const validation = createExpenseSchema.safeParse(body);
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

    const expense = await createExpense(user.userId, user.email, validation.data);

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/expenses:', error);

    // RN-15: Anti-duplicado → 409 Conflict
    if (error instanceof Error) {
      if (error.message === 'DUPLICATE_EXPENSE') {
        return NextResponse.json(
          { 
            error: 'Este gasto ya fue registrado hace poco.',
            detail: 'Un gasto idéntico (mismo nombre, monto, categoría y fecha) fue registrado en el último minuto. Por favor espera antes de intentar nuevamente.'
          },
          { status: 409 }
        );
      }
      
      // RN-01: Monto inválido → 400
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
          { error: 'El sistema aún no está inicializado. Por favor ejecuta el bootstrap desde Configuración del sistema.' },
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