import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getAuthUser } from '@/lib/withAuth';
import { changePasswordSchema } from '@/lib/schemas';
import { getUserByEmail, updateUserPassword } from '@/lib/dataService';
import { verifyPassword } from '@/lib/auth';

async function handler(req: NextRequest) {
  try {
    const data = await req.json();
    const parsed = changePasswordSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((item) => item.message).join(', ') },
        { status: 400 }
      );
    }

    const authUser = getAuthUser(req);
    const user = await getUserByEmail(authUser.email);

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const passwordValid = await verifyPassword(parsed.data.currentPassword, user.password_hash);
    if (!passwordValid) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 });
    }

    await updateUserPassword(authUser.userId, parsed.data.newPassword);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('/api/auth/change-password error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export const POST = withAuth(handler);
