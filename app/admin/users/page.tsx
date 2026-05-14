'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/providers/ToastProvider';
import { AdminUserMetadata, SafeUser } from '@/lib/types';

export default function AdminUsersPage() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserMetadata[]>([]);
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (!meRes.ok) {
          router.push('/dashboard');
          return;
        }

        const meData = await meRes.json();
        if (meData.user?.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        setCurrentUser(meData.user);

        const usersRes = await fetch('/api/users', { credentials: 'include' });
        if (!usersRes.ok) {
          toast.addToast('No se pudieron cargar los usuarios', 'error');
          return;
        }

        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      } catch (error) {
        console.error('Admin users load error:', error);
        toast.addToast('Error al cargar la lista de usuarios', 'error');
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [router, toast]);

  const handleToggleActive = async (userId: string, currentState: boolean) => {
    setSavingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !currentState }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar usuario');
      }

      setUsers((prev) => prev.map((user) => (user.id === userId ? data.user : user)));
      toast.addToast('Estado de usuario actualizado', 'success');
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.addToast('No se pudo actualizar el usuario', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Confirmas eliminar esta cuenta de usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    setSavingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar usuario');
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.addToast('Usuario eliminado correctamente', 'success');
    } catch (error) {
      console.error('Delete user error:', error);
      toast.addToast('No se pudo eliminar el usuario', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const canDeleteSelf = useMemo(
    () => currentUser?.id ?? null,
    [currentUser]
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6">
          <p className="text-sm text-[--cs-text-secondary]">Cargando usuarios...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[--cs-text-primary] mb-2">Usuarios</h1>
          <p className="text-[--cs-text-secondary] max-w-2xl">
            Solo se muestran metadatos de cuentas. No se muestran tareas ni gastos.
          </p>
        </div>

        <Card className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[--cs-border]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[--cs-text-secondary]">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Activo</th>
                <th className="px-4 py-3">Último login</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3">Tareas</th>
                <th className="px-4 py-3">Gastos</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--cs-border]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[--cs-bg-primary] transition-colors">
                  <td className="px-4 py-4 text-sm text-[--cs-text-primary]">{user.name}</td>
                  <td className="px-4 py-4 text-sm text-[--cs-text-secondary]">{user.email}</td>
                  <td className="px-4 py-4 text-sm">{user.role}</td>
                  <td className="px-4 py-4 text-sm">{user.is_active ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-4 text-sm">{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Nunca'}</td>
                  <td className="px-4 py-4 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-sm">{user.taskCount}</td>
                  <td className="px-4 py-4 text-sm">{user.expenseCount}</td>
                  <td className="px-4 py-4 text-right space-x-2">
                    <button
                      disabled={savingId === user.id}
                      onClick={() => handleToggleActive(user.id, user.is_active)}
                      className="rounded-md border px-3 py-1 text-xs font-medium transition-colors hover:bg-[--cs-bg-primary] disabled:opacity-50"
                    >
                      {user.is_active ? 'Suspender' : 'Activar'}
                    </button>
                    <button
                      disabled={savingId === user.id || user.id === canDeleteSelf}
                      onClick={() => handleDelete(user.id)}
                      className="rounded-md border border-red-500 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AppLayout>
  );
}
