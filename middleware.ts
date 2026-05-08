// middleware.ts
// Protege rutas privadas y valida sesión

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { JWTPayload } from '@/lib/types';

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
  '/dashboard',
  '/tasks',
  '/expenses',
  '/profile',
  '/admin',
];

// Rutas que requieren rol admin
const ADMIN_ROUTES = ['/admin'];

// Rutas públicas que redirigen al dashboard si hay sesión
const PUBLIC_AUTH_ROUTES = ['/login', '/register'];

function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET debe estar configurado con mínimo 32 caracteres');
  }
  return new TextEncoder().encode(secret);
}

async function verifyJWTInMiddleware(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getJWTSecret();
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Obtener token de la cookie
  const sessionCookie = req.cookies.get('campuszen_session')?.value;

  let userId: string | null = null;
  let userRole: string | null = null;

  // Verificar token si existe
  if (sessionCookie) {
    try {
      const payload = await verifyJWTInMiddleware(sessionCookie);
      if (payload) {
        userId = payload.userId;
        userRole = payload.role;
      }
    } catch (error) {
      // Token inválido
      userId = null;
      userRole = null;
    }
  }

  // Redirigir rutas públicas si hay sesión
  if (PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (userId) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Proteger rutas privadas
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    // Requerir autenticación
    if (!userId) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Requerir rol admin para rutas admin
    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  // Agregar headers de no-cache a todas las respuestas
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');

  return response;
}

export const config = {
  matcher: [
    // Proteger todas las rutas excepto API y archivos estáticos
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
