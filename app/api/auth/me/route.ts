// app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from '@/lib/withAuth';
import { getUserById, updateUser } from '@/lib/dataService';
import { updateUserSchema } from '@/lib/schemas';

async function getHandler(req: NextRequest) {
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
    console.error('/api/auth/me GET error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function putHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((item) => item.message).join(', ') },
        { status: 400 }
      );
    }

    const user = getAuthUser(req);
    const updatedUser = await updateUser(user.userId, parsed.data);

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('/api/auth/me PUT error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler);
