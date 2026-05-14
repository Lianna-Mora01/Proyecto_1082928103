import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import { getAdminUsers } from '@/lib/dataService';

async function handler(req: NextRequest) {
  try {
    const users = await getAdminUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('/api/users GET error:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export const GET = withRole(['admin'], handler);
