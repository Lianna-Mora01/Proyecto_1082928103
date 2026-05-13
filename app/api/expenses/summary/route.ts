// app/api/expenses/summary/route.ts
// Resumen mensual de gastos
// RN-12: Si presupuesto es null, budgetPercentage es null

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/withAuth';
import { getMonthlySummary } from '@/lib/dataService';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const user = getAuthUser(req);
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    // Validar parámetros
    if (year < 2020 || year > 2030 || month < 1 || month > 12) {
      return NextResponse.json(
        { 
          error: 'Parámetros de fecha inválidos',
          detail: 'El año debe estar entre 2020 y 2030, y el mes entre 1 y 12.'
        },
        { status: 400 }
      );
    }

    const summary = await getMonthlySummary(user.userId, year, month);

    // RN-12: El cliente debe validar que budgetPercentage puede ser null
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error en GET /api/expenses/summary:', error);

    if (error instanceof Error && error.message.includes('modo seed')) {
      return NextResponse.json(
        { 
          totalAmount: 0,
          byCategory: {},
          byPaymentMethod: {},
          budgetPercentage: null
        }
      );
    }

    return NextResponse.json(
      { error: 'Error al obtener resumen de gastos' },
      { status: 500 }
    );
  }
}