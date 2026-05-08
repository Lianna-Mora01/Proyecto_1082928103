// app/api/dashboard/route.ts
// GET /api/dashboard - Retorna datos consolidados del dashboard

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { getSystemMode } from '@/lib/dataService';

export async function GET(req: NextRequest) {
  return withAuth(async (userId: string) => {
    try {
      const mode = await getSystemMode();

      // Estructura del dashboard
      const dashboard = {
        mode,
        user_id: userId,
        summary: {
          urgent_tasks_count: 0,
          pending_tasks_count: 0,
          completed_tasks_this_week: 0,
          subjects_count: 0,
        },
        finances: {
          total_month: 0,
          budget_monthly: null,
          budget_percentage: null,
          expenses_by_method: {
            efectivo: 0,
            tarjeta: 0,
          },
          expenses_by_category: [],
        },
        alerts: [],
        last_updated: new Date().toISOString(),
      };

      if (mode === 'seed') {
        // En modo seed, retornar estructura vacía
        return NextResponse.json(dashboard, { status: 200 });
      }

      // En modo live, los datos reales se poblarán en fases posteriores
      // Por ahora, retornar estructura vacía
      return NextResponse.json(dashboard, { status: 200 });
    } catch (error) {
      console.error('Dashboard error:', error);
      return NextResponse.json(
        { error: 'Error al obtener datos del dashboard' },
        { status: 500 }
      );
    }
  })(req);
}
