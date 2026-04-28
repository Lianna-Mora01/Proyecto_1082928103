// app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, getTokenFromCookie, verifyJWT } from '@/lib/auth';
import { recordLogout } from '@/lib/dataService';

export async function POST(req: NextRequest) {
  try {
    // Obtener el token actual para registrar en auditoría
    const token = await getTokenFromCookie();
    if (token) {
      const payload = await verifyJWT(token);
      if (payload) {
        await recordLogout(payload.userId, payload.email);
      }
    }

    // Limpiar cookie de sesión
    await clearSessionCookie();

    return NextResponse.json(
      { success: true, message: 'Sesión cerrada correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
