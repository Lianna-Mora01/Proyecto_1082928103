// app/dashboard/page.tsx
// Dashboard temporal para Fase 1
// Página completa se implementará en Fase 2

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Email: {user.email}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Rol: {user.role === 'admin' ? 'Administrador' : 'Estudiante'}
          </p>

          {user.role === 'admin' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded p-4 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                Eres administrador. Por favor ejecuta el bootstrap en Fase 2 para inicializar el sistema.
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Fase 1 completada ✅
          </h2>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>✓ Autenticación con JWT y bcrypt</li>
            <li>✓ Cookies HttpOnly, Secure y SameSite</li>
            <li>✓ dataService base implementado</li>
            <li>✓ Login y registro funcionales</li>
            <li>✓ Sistema de auditoría listo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
