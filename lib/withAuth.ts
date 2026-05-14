// lib/withAuth.ts
// Middleware para proteger rutas privadas

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './auth';
import { getUserById } from './dataService';
import { JWTPayload } from './types';

const SESSION_COOKIE_NAME = 'campuszen_session';

/**
 * Middleware para validar sesión en API Routes
 * Agrega header Cache-Control: no-store y user al request.user
 */
export function withAuth(
  handler: (
    req: NextRequest,
    context: { params?: Record<string, string | string[]> }
  ) => Promise<NextResponse>
): (req: NextRequest, context: any) => Promise<Response> {
  return async (req: NextRequest, context: any) => {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value || null;

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado. Inicia sesión.' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Sesión expirada. Inicia sesión de nuevo.' },
        { status: 401 }
      );
    }

    const currentUser = await getUserById(payload.userId);
    if (!currentUser || !currentUser.is_active) {
      return NextResponse.json(
        { error: 'Sesión inválida o cuenta desactivada.' },
        { status: 401 }
      );
    }

    // Agregar user al contexto del request
    (req as any).user = payload;

    // Ejecutar handler y agregar headers no-cache
    const response = await handler(req, context);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    return response;
  };
}

/**
 * Obtiene el user autenticado del request
 * Debe usarse dentro de un handler protegido con withAuth
 */
export function getAuthUser(req: NextRequest): JWTPayload {
  return (req as any).user as JWTPayload;
}
