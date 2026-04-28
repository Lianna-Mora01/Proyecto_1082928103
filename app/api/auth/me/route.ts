// app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from '@/lib/withAuth';
import { getUserById } from '@/lib/dataService';

async function handler(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    const fullUser = await getUserById(user.userId);

    if (!fullUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: fullUser }, { status: 200 });
  } catch (error) {
    console.error('/api/auth/me error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
