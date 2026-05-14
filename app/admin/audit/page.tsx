'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/providers/ToastProvider';
import { AdminUserMetadata } from '@/lib/types';

interface AuditEntry {
  id: string;
  timestamp: string;
  user_id: string;
  user_email: string;
  action: string;
  entity: string;
  entity_id?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export default function AdminAuditPage() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserMetadata[]>([]);
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [currentUserRoleVerified, setCurrentUserRoleVerified] = useState(false);

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

        setCurrentUserRoleVerified(true);

        const [usersRes, auditRes] = await Promise.all([
          fetch('/api/users', { credentials: 'include' }),
          fetch(`/api/audit?month=${month.replace('-', '')}`, { credentials: 'include' }),
        ]);

        if (!usersRes.ok) {
          toast.addToast('No se pudieron cargar los usuarios para filtros', 'error');
          return;
        }

        if (!auditRes.ok) {
          toast.addToast('No se pudo cargar la auditoría', 'error');
          return;
        }

        const usersData = await usersRes.json();
        const auditData = await auditRes.json();
        setUsers(usersData.users || []);
        setEntries(auditData.entries || []);
      } catch (error) {
        console.error('Admin audit load error:', error);
        toast.addToast('Error al cargar auditoría', 'error');
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [month, router, toast]);

  const handleFetchAudit = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams({
        month: month.replace('-', ''),
        ...(selectedUserId ? { userId: selectedUserId } : {}),
      });
      const res = await fetch(`/api/audit?${queryString.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al obtener auditoría');
      }

      const data = await res.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Fetch audit error:', error);
      toast.addToast('No se pudo actualizar la auditoría', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6">
          <p className="text-sm text-[--cs-text-secondary]">Cargando auditoría...</p>
        </div>
      </AppLayout>
    );
  }

  if (!currentUserRoleVerified) {
    return null;
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[--cs-text-primary] mb-2">Auditoría</h1>
          <p className="text-[--cs-text-secondary] max-w-2xl">
            Busca acciones administrativas por mes y usuario. Los registros se almacenan en Vercel Blob.
          </p>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-[--cs-text-secondary]">
                Mes
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full rounded-lg border border-[--cs-border] bg-[--cs-bg-primary] px-3 py-2 text-sm text-[--cs-text-primary]"
                />
              </label>

              <label className="space-y-2 text-sm text-[--cs-text-secondary]">
                Usuario
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-lg border border-[--cs-border] bg-[--cs-bg-primary] px-3 py-2 text-sm text-[--cs-text-primary]"
                >
                  <option value="">Todos</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}> 
                      {user.email}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              onClick={handleFetchAudit}
              className="rounded-lg bg-[--cs-primary] px-4 py-2 text-sm font-medium text-white hover:bg-[--cs-primary-dark] transition-colors"
            >
              Actualizar
            </button>
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[--cs-border]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[--cs-text-secondary]">
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Acción</th>
                  <th className="px-4 py-3">Entidad</th>
                  <th className="px-4 py-3">ID entidad</th>
                  <th className="px-4 py-3">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--cs-border]">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[--cs-bg-primary] transition-colors">
                    <td className="px-4 py-4 text-sm">{new Date(entry.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm">{entry.user_email}</td>
                    <td className="px-4 py-4 text-sm">{entry.action}</td>
                    <td className="px-4 py-4 text-sm">{entry.entity}</td>
                    <td className="px-4 py-4 text-sm">{entry.entity_id || '-'}</td>
                    <td className="px-4 py-4 text-sm break-words max-w-xs">
                      <pre className="whitespace-pre-wrap text-[--cs-text-secondary] text-xs">
                        {JSON.stringify(entry.metadata || entry.changes || {}, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
