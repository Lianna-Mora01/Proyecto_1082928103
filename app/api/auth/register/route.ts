// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/schemas';
import { createUser, getUserByEmail } from '@/lib/dataService';
import { getSystemMode } from '@/lib/dataService';

export async function POST(req: NextRequest) {
  try {
    const mode = await getSystemMode();

    // En modo seed, no se permite crear nuevos usuarios
    if (mode === 'seed') {
      return NextResponse.json(
        { error: 'Sistema en modo inicialización. Intenta más tarde.' },
        { status: 503 }
      );
    }

    const body = await req.json();

    // Validar entrada con Zod
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Verificar que el email no existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      );
    }

    // Crear usuario
    const newUser = await createUser({ name, email, password });

    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
