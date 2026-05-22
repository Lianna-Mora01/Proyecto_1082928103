import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = 'campuszen_session';

// Rutas protegidas que requieren autenticación
const protectedRoutes = [
  "/dashboard",
  "/tasks",
  "/expenses",
  "/profile",
  "/admin",
];

// Rutas públicas (incluyendo db-setup para bootstrap inicial)
const publicRoutes = ["/", "/login", "/register", "/api/auth", "/db-setup"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Permitir rutas públicas
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Para rutas protegidas (solo páginas, no API)
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      // Redirigir a login si no hay token
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Token existe, continuar (validación completa en API routes con withAuth)
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configurar qué rutas usar middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
