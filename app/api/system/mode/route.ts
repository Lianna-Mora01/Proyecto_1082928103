// app/api/system/mode/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSystemMode } from '@/lib/dataService';

export async function GET(req: NextRequest) {
  try {
    const mode = await getSystemMode();
    return NextResponse.json({ mode }, { status: 200 });
  } catch (error) {
    console.error('System mode error:', error);
    return NextResponse.json(
      { error: 'Error al determinar el modo del sistema' },
      { status: 500 }
    );
  }
}
