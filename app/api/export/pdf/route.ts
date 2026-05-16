// app/api/export/pdf/route.ts
// Exportar gastos en PDF

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from '@/lib/withAuth';
import { getExpenses, getMonthlySummary } from '@/lib/dataService';
import { generatePDFBuffer } from '@/lib/exportService';

async function getHandler(req: NextRequest): Promise<Response> {
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

    // Generar PDF
    const pdfBuffer = generatePDFBuffer({
      userId: user.userId,
      userName: user.email,
      expenses,
      summary,
      month,
    });

    // Headers para descarga
    const filename = `campuszen-gastos-${month}.pdf`;

    return new NextResponse(new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' }), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error en GET /api/export/pdf:', error);
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
