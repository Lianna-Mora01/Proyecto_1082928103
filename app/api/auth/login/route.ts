// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/schemas';
import { getUserByEmail, recordLogin } from '@/lib/dataService';
import { verifyPassword, createJWT, setSessionCookie } from '@/lib/auth';
import { SafeUser } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar entrada con Zod
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Buscar usuario
    const user = await getUserByEmail(email);
    if (!user) {
      // Error genérico: nunca especificar si falló email o password
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordValid = await verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      // Error genérico
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar que el usuario está activo
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Cuenta desactivada' },
        { status: 403 }
      );
    }

    // Crear JWT
    const token = await createJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Establecer cookie de sesión
    await setSessionCookie(token);

    // Registrar login en auditoría
    await recordLogin(user.id, user.email);

    // Retornar usuario sin password_hash
    const safeUser: SafeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      theme: user.theme,
      budget_monthly: user.budget_monthly,
      notifications_enabled: user.notifications_enabled,
      is_active: user.is_active,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
    };

    return NextResponse.json(
      { success: true, user: safeUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
