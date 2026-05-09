import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

// Rutas protegidas que requieren autenticación
const protectedRoutes = [
  "/dashboard",
  "/tasks",
  "/expenses",
  "/profile",
  "/admin",
  "/api/dashboard",
  "/api/tasks",
  "/api/expenses",
  "/api/subjects",
  "/api/users",
  "/api/audit",
];

// Rutas públicas
const publicRoutes = ["/", "/login", "/register", "/api/auth"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Permitir rutas públicas y API de auth y system
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Para rutas protegidas, verificar JWT
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    const token = request.cookies.get("sessionToken")?.value;

    if (!token) {
      // Redirigir a login si no hay token
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = verifyJWT(token);
      if (!payload) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // Token válido, continuar
      return NextResponse.next();
    } catch (error) {
      // Token inválido, redirigir a login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Configurar qué rutas usar middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
