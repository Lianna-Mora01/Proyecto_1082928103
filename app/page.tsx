// app/page.tsx
// Redirecciona a /dashboard si hay sesión, a /login si no

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAndRedirect() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (res.ok) {
          // Hay sesión válida
          router.push('/dashboard');
        } else {
          // Sin sesión
          router.push('/login');
        }
      } catch {
        // Error de conexión, redirigir a login
        router.push('/login');
      }
    }

    checkAndRedirect();
  }, [router]);

  // No mostrar nada mientras se redirige
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
}
