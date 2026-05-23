// app/login/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "var(--cs-gradient-soft)" }}
    >
      {/* Decoraciones sutiles */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "var(--cs-secondary)" }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--cs-primary)" }}
      />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
        <div className="bg-[--cs-bg-card] border border-[--cs-border] rounded-3xl cs-shadow-elevated p-8 space-y-6">
          {/* Logo y branding */}
          <div className="text-center space-y-3">
            <CampusZenLogo />
            <h1 className="text-3xl font-bold" style={{ color: "var(--cs-title)" }}>
              CampusZen
            </h1>
            <p className="text-sm text-[--cs-text-secondary]">
              Tu espacio universitario, en calma. 🌿
            </p>
          </div>

          {/* Divisor */}
          <div className="h-px bg-[--cs-border-soft]"></div>

          {/* Formulario */}
          <LoginForm />

          {/* Footer */}
          <div className="text-center text-xs text-[--cs-text-secondary]">
            <p>
              Credenciales de demo: <strong>admin@campuszen.com</strong> / <strong>Admin123*</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
