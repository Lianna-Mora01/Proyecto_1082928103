// lib/withRole.ts
// Middleware para validar roles (admin, student)

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from './withAuth';

/**
 * Middleware que valida que el usuario tenga un rol específico
 * Úsalo como: withRole(['admin'], handler)
 */
export function withRole(
  allowedRoles: string[],
  handler: (
    req: NextRequest,
    context: { params?: Record<string, string | string[]> }
  ) => Promise<NextResponse>
) {
  return withAuth(async (req: NextRequest, context) => {
    const user = getAuthUser(req);

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Acceso denegado. Rol insuficiente.' },
        { status: 403 }
      );
    }

    return handler(req, context);
  });
}
