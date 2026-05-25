'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, LogIn, UserPlus } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!cancelled && res.ok) {
          router.push('/dashboard');
          return;
        }
      } catch {
        // sin sesion / sin red, mostramos landing
      }
      if (!cancelled) setCheckingSession(false);
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Pantalla neutra mientras verifica para evitar flash de landing
  if (checkingSession) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--cs-gradient-soft)' }} />
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: 'var(--cs-gradient-soft)' }}
    >
      {/* Decoraciones difusas */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'var(--cs-secondary)' }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'var(--cs-primary)' }}
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'var(--cs-primary)' }}
      />

      <main className="relative max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo grande */}
        <div className="flex justify-center">
          <span
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl text-white cs-shadow-lg"
            style={{
              background: 'var(--cs-gradient-primary)',
              boxShadow: '0 20px 50px rgba(45, 80, 22, 0.25)',
            }}
            aria-hidden
          >
            <Leaf size={44} strokeWidth={2.2} />
          </span>
        </div>

        {/* Nombre */}
        <h1
          className="text-6xl sm:text-7xl font-bold tracking-tight leading-none"
          style={{ color: 'var(--cs-title)' }}
        >
          CampusZen
        </h1>

        {/* Slogan */}
        <p
          className="text-xl sm:text-2xl font-medium"
          style={{ color: 'var(--cs-primary-darker)' }}
        >
          Tu espacio de calma universitaria <span aria-hidden>🌿</span>
        </p>

        {/* Descripción corta */}
        <p className="text-base sm:text-lg text-[--cs-text-primary] max-w-lg mx-auto leading-relaxed">
          Organiza tus tareas académicas, lleva el control de tus gastos universitarios
          y mantén tu bienestar estudiantil — todo en un solo lugar.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/login"
            className="cs-gradient text-white inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-medium shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <LogIn size={18} />
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-medium bg-[--cs-bg-card] border border-[--cs-primary]/40 text-[--cs-primary-darker] cs-shadow-soft hover:bg-[--cs-bg-soft] hover:border-[--cs-primary] hover:cs-shadow-card hover:-translate-y-0.5 transition-all duration-200"
          >
            <UserPlus size={18} />
            Registrarse
          </Link>
        </div>

        {/* Footer minimalista */}
        <p className="pt-6 text-xs text-[--cs-text-secondary] tracking-wide">
          Hecho con calma para estudiantes universitarios
        </p>
      </main>
    </div>
  );
}
