// app/api/export/xlsx/route.ts
// Exportar gastos en Excel

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from '@/lib/withAuth';
import { getExpenses, getMonthlySummary } from '@/lib/dataService';
import { generateExcelBuffer } from '@/lib/exportService';

async function getHandler(req: NextRequest): Promise<NextResponse> {
  try {
    const user = getAuthUser(req);
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Parámetro month requerido en formato YYYY-MM' },
        { status: 400 }
      );
    }

    // Obtener gastos del mes
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);
    const expenses = await getExpenses(user.userId, {
      month,
    });

    // Verificar si hay gastos
    if (expenses.length === 0) {
      return NextResponse.json(
        {
          error: 'No hay gastos registrados para este período',
          month,
        },
        { status: 404 }
      );
    }

    // Obtener resumen
    const summary = await getMonthlySummary(user.userId, year, monthNum);

    // Generar Excel
    const excelBuffer = generateExcelBuffer({
      userId: user.userId,
      userName: user.email,
      expenses,
      summary,
      month,
    });

    // Headers para descarga
    const filename = `campuszen-gastos-${month}.xlsx`;

    return new NextResponse(new Blob([new Uint8Array(excelBuffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error en GET /api/export/xlsx:', error);
    return NextResponse.json(
      { error: 'Error al generar Excel' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
