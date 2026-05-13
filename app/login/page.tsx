// app/login/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import CampusZenLogo from '@/components/auth/CampusZenLogo';

export default function LoginPage() {
  const router = useRouter();

  // Verificar si ya hay sesión
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (res.ok) {
          router.push('/dashboard');
        }
      } catch {
        // Sin sesión, continuar mostrando login
      }
    }
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 relative overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 transform rotate-45">
          <path
            d="M24 8C24 8 16 16 16 24C16 32 20 40 24 40C28 40 32 32 32 24C32 16 24 8 24 8Z"
            fill="#40916C"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
          {/* Logo y branding */}
          <div className="text-center space-y-3">
            <CampusZenLogo />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              CampusZen
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tu espacio universitario, en calma.
            </p>
          </div>

          {/* Divisor */}
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

          {/* Formulario */}
          <LoginForm />

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              Credenciales de demo: <strong>admin@campuszen.app</strong> / <strong>admin123</strong>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
