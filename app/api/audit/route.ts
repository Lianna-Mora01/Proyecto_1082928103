import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import { readAuditMonth } from '@/lib/blobAudit';

function normalizeMonth(value: string): string | null {
  if (/^\d{4}-\d{2}$/.test(value)) {
    return value;
  }
  if (/^\d{6}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4)}`;
  }
  return null;
}

async function handler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const monthParam = url.searchParams.get('month') || '';
    const userId = url.searchParams.get('userId') || null;

    const month = normalizeMonth(monthParam);
    if (!month) {
      return NextResponse.json(
        { error: 'Parámetro month inválido. Formato YYYY-MM o YYYYMM.' },
        { status: 400 }
      );
    }

    const entries = await readAuditMonth(month.replace('-', ''));
    const filtered = userId ? entries.filter((entry) => entry.user_id === userId) : entries;

    return NextResponse.json({ entries: filtered }, { status: 200 });
  } catch (error) {
    console.error('/api/audit GET error:', error);
    return NextResponse.json(
      { error: 'Error al leer la auditoría' },
      { status: 500 }
    );
  }
}

export const GET = withRole(['admin'], handler);
