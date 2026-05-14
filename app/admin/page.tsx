'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';

export default function AdminHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function verifyAdmin() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          router.push('/dashboard');
          return;
        }

        const data = await res.json();
        if (data.user?.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);
      } catch {
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }

    verifyAdmin();
  }, [router]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6">
          <p className="text-sm text-[--cs-text-secondary]">Verificando permisos...</p>
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[--cs-text-primary] mb-2">Panel de Administración</h1>
          <p className="text-[--cs-text-secondary] max-w-2xl">
            Gestión segura de usuarios y auditoría. Solo para administradores.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/users">
            <Card className="cursor-pointer hover:border-[--cs-primary] transition-colors">
              <h2 className="text-xl font-semibold text-[--cs-text-primary] mb-2">Usuarios</h2>
              <p className="text-[--cs-text-secondary]">
                Ver cuentas, activar/suspender usuarios y ejecutar acciones administrativas.
              </p>
            </Card>
          </Link>

          <Link href="/admin/audit">
            <Card className="cursor-pointer hover:border-[--cs-primary] transition-colors">
              <h2 className="text-xl font-semibold text-[--cs-text-primary] mb-2">Auditoría</h2>
              <p className="text-[--cs-text-secondary]">
                Consultar el historial de auditoría almacenado en Vercel Blob por mes y usuario.
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
