import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/withRole';
import { getAuthUser } from '@/lib/withAuth';
import { setUserActiveState, deleteUserById } from '@/lib/dataService';

async function handler(req: NextRequest, context: { params?: Record<string, string | string[]> }) {
  const targetId = context.params?.id;
  if (!targetId || Array.isArray(targetId)) {
    return NextResponse.json(
      { error: 'ID de usuario inválido' },
      { status: 400 }
    );
  }

  const authUser = getAuthUser(req);

  if (req.method === 'PUT') {
    try {
      const body = await req.json();
      if (typeof body.is_active !== 'boolean') {
        return NextResponse.json(
          { error: 'Payload inválido' },
          { status: 400 }
        );
      }

      if (authUser.userId === targetId && body.is_active === false) {
        return NextResponse.json(
          { error: 'No puedes desactivar tu propia cuenta' },
          { status: 403 }
        );
      }

      const updated = await setUserActiveState(
        authUser.userId,
        authUser.email,
        targetId,
        body.is_active
      );

      return NextResponse.json({ user: updated }, { status: 200 });
    } catch (error) {
      console.error('/api/users/[id] PUT error:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el usuario' },
        { status: 500 }
      );
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (authUser.userId === targetId) {
        return NextResponse.json(
          { error: 'No puedes eliminar tu propia cuenta' },
          { status: 403 }
        );
      }

      await deleteUserById(authUser.userId, authUser.email, targetId);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error('/api/users/[id] DELETE error:', error);
      return NextResponse.json(
        { error: 'Error al eliminar el usuario' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  );
}

export const PUT = withRole(['admin'], handler);
export const DELETE = withRole(['admin'], handler);
