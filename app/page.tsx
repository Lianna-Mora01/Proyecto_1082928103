'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Leaf,
  BookOpen,
  CheckSquare,
  Wallet,
  Sparkles,
  Target,
  BarChart3,
  ListTodo,
} from 'lucide-react';

const jakartaStyle = { fontFamily: 'var(--font-jakarta), Inter, system-ui, sans-serif' };

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
        // sin sesion, seguir mostrando landing
      }
      if (!cancelled) setCheckingSession(false);
    }
    checkSession();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen" style={{ background: '#F8FAF7' }} />
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#F8FAF7', ...jakartaStyle }}>
      <BackgroundDecor />

      <Navbar />

      <main className="relative">
        <Hero />
        <Features />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Decoraciones de fondo: blobs difusos + grid de puntos sutil       */
/* ------------------------------------------------------------------ */

function BackgroundDecor() {
  return (
    <>
      {/* Patron de puntos sutil */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #C2E2BD 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Blobs difusos */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: '#A8D5A2' }}
      />
      <div
        aria-hidden
        className="absolute top-[40%] -left-32 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: '#7BAE7F' }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: '#C2E2BD' }}
      />

      {/* Wave SVG sutil al fondo del hero */}
      <svg
        aria-hidden
        className="absolute top-[85vh] left-0 right-0 w-full h-32 pointer-events-none opacity-40"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
          fill="#EEF6EC"
        />
      </svg>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                             */
/* ------------------------------------------------------------------ */

function Navbar() {
  return (
    <header className="relative z-30">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl text-white transition-transform duration-200 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7BAE7F, #A8D5A2)',
              boxShadow: '0 8px 16px rgba(45, 80, 22, 0.18)',
            }}
            aria-hidden
          >
            <Leaf size={20} />
          </span>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: '#2D5016', ...jakartaStyle }}
          >
            CampusZen
          </span>
        </Link>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border border-[#7BAE7F]/40 text-[#2D5016] bg-white hover:bg-[#EEF6EC] hover:border-[#7BAE7F] transition-all duration-200"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #2D5016, #5D9763)',
              boxShadow: '0 6px 16px rgba(45, 80, 22, 0.25)',
            }}
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 lg:pt-20 lg:pb-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center lg:text-left"
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
            style={{
              background: '#EEF6EC',
              color: '#2D5016',
            }}
          >
            <Sparkles size={12} />
            Hecho con calma para estudiantes
          </span>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
            style={jakartaStyle}
          >
            <span style={{ color: '#2D5016' }}>Organiza tu vida universitaria,</span>
            <br />
            <span style={{ color: '#7BAE7F' }}>
              con calma y enfoque <span aria-hidden>🌿</span>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
            CampusZen reúne tus materias, tareas y gastos en un solo lugar.
            Diseñado para que tu semestre sea más ligero y tu mente más libre.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #2D5016, #5D9763)',
                boxShadow: '0 12px 28px rgba(45, 80, 22, 0.28)',
              }}
            >
              Comenzar gratis →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-medium bg-white border border-[#7BAE7F]/40 text-[#2D5016] hover:bg-[#EEF6EC] hover:border-[#7BAE7F] hover:-translate-y-0.5 transition-all duration-200"
              style={{ boxShadow: '0 4px 12px rgba(45, 80, 22, 0.08)' }}
            >
              Ver demo
            </Link>
          </div>

          {/* Stat trust strip */}
          <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start text-xs text-[#718096]">
            <div>
              <span className="block font-bold text-lg" style={{ color: '#2D5016', ...jakartaStyle }}>
                3 módulos
              </span>
              en un solo lugar
            </div>
            <div className="w-px h-8 bg-[#DCE9D7]" />
            <div>
              <span className="block font-bold text-lg" style={{ color: '#2D5016', ...jakartaStyle }}>
                100%
              </span>
              gratis para empezar
            </div>
            <div className="w-px h-8 bg-[#DCE9D7] hidden sm:block" />
            <div className="hidden sm:block">
              <span className="block font-bold text-lg" style={{ color: '#2D5016', ...jakartaStyle }}>
                🌿
              </span>
              calma garantizada
            </div>
          </div>
        </motion.div>

        {/* Mockup preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="relative"
        >
          <AppMockup />

          {/* Floating badge: gasto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -left-6 sm:-left-10 top-1/3 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 hidden md:flex"
            style={{ boxShadow: '0 16px 40px rgba(45, 80, 22, 0.18)' }}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl bg-amber-100">
              🍕
            </span>
            <div>
              <p className="text-xs text-[#718096]">Comida</p>
              <p className="text-sm font-bold" style={{ color: '#2D5016', ...jakartaStyle }}>
                $ 15.000
              </p>
            </div>
          </motion.div>

          {/* Floating badge: tarea */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute -right-4 sm:-right-8 bottom-12 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 hidden md:flex"
            style={{ boxShadow: '0 16px 40px rgba(45, 80, 22, 0.18)' }}
          >
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white"
              style={{ background: 'linear-gradient(135deg, #7BAE7F, #A8D5A2)' }}
            >
              <CheckSquare size={18} />
            </span>
            <div>
              <p className="text-xs text-[#718096]">3 tareas hoy</p>
              <p className="text-sm font-bold" style={{ color: '#2D5016', ...jakartaStyle }}>
                Todo bajo control
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* Mockup del dashboard */
function AppMockup() {
  return (
    <div
      className="relative rounded-3xl bg-white border border-[#DCE9D7] overflow-hidden"
      style={{
        boxShadow: '0 30px 80px rgba(45, 80, 22, 0.22), 0 12px 30px rgba(45, 80, 22, 0.12)',
      }}
    >
      {/* Mock toolbar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#EDF5EB] bg-[#F8FAF7]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F4A261]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#A8D5A2]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#7BAE7F]" />
        <span className="ml-3 text-[10px] text-[#718096] font-mono">campuszen.app/dashboard</span>
      </div>

      <div className="p-5 sm:p-6">
        {/* Saludo */}
        <p className="text-xs text-[#718096] mb-1">Lunes, 15 de septiembre</p>
        <h3
          className="text-lg sm:text-xl font-bold mb-5"
          style={{ color: '#2D5016', ...jakartaStyle }}
        >
          Tú puedes con todo, Ana <span aria-hidden>🌿</span>
        </h3>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <MockStat label="Tareas" value="3" Icon={ListTodo} accent="#7BAE7F" />
          <MockStat label="Mes" value="$ 124K" Icon={Wallet} accent="#5D9763" />
          <MockStat label="Presup." value="65%" Icon={Target} accent="#A8D5A2" />
        </div>

        {/* Mini chart */}
        <div className="rounded-2xl border border-[#EDF5EB] p-4 bg-[#F8FAF7]">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white"
              style={{ background: 'linear-gradient(135deg, #7BAE7F, #A8D5A2)' }}
            >
              <BarChart3 size={14} />
            </span>
            <span className="text-xs font-semibold" style={{ color: '#2D5016' }}>
              Gastos por categoría
            </span>
          </div>
          <div className="flex items-end gap-2 h-20">
            {[60, 90, 40, 70, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(180deg, #7BAE7F 0%, #A8D5A2 100%)`,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockStat({
  label,
  value,
  Icon,
  accent,
}: {
  label: string;
  value: string;
  Icon: typeof ListTodo;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#EDF5EB] bg-white p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-[#718096]">{label}</p>
          <p className="text-lg font-bold leading-none mt-1" style={{ color: '#2D5016', ...jakartaStyle }}>
            {value}
          </p>
        </div>
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-white shrink-0"
          style={{ background: accent }}
        >
          <Icon size={14} />
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                           */
/* ------------------------------------------------------------------ */

function Features() {
  const features = [
    {
      Icon: BookOpen,
      title: 'Materias',
      desc: 'Crea tus asignaturas con color propio y mantén organizadas tus tareas por cada una.',
      accent: '#7BAE7F',
    },
    {
      Icon: CheckSquare,
      title: 'Tareas',
      desc: 'Lleva el control de entregas, prioridades y fechas límite. Marca y celebra cada avance.',
      accent: '#5D9763',
    },
    {
      Icon: Wallet,
      title: 'Gastos',
      desc: 'Registra gastos en pesos colombianos, mira tendencias y respeta tu presupuesto mensual.',
      accent: '#A8D5A2',
    },
  ];

  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: '#EEF6EC', color: '#2D5016' }}
          >
            Tres pilares
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: '#2D5016', ...jakartaStyle }}
          >
            Todo lo que necesitas para tu semestre
          </h2>
          <p className="text-base text-[#4A5568]">
            Sin distracciones, sin notificaciones invasivas. Solo lo esencial,
            siempre a la mano.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-[#DCE9D7] p-7 hover:-translate-y-2 transition-all duration-300"
              style={{ boxShadow: '0 8px 24px rgba(45, 80, 22, 0.08)' }}
            >
              <div
                aria-hidden
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-15 blur-xl pointer-events-none transition-opacity duration-300 group-hover:opacity-25"
                style={{ background: f.accent }}
              />

              <span
                className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white mb-5"
                style={{
                  background: `linear-gradient(135deg, ${f.accent}, ${f.accent}CC)`,
                  boxShadow: `0 12px 24px ${f.accent}40`,
                }}
              >
                <f.Icon size={26} />
              </span>

              <h3
                className="relative text-xl font-bold mb-2"
                style={{ color: '#2D5016', ...jakartaStyle }}
              >
                {f.title}
              </h3>
              <p className="relative text-sm text-[#4A5568] leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      Icon: UserPlusIcon,
      title: 'Crea tu cuenta',
      desc: 'Regístrate en menos de un minuto. Solo necesitas tu correo institucional o personal.',
    },
    {
      Icon: BookOpen,
      title: 'Configura tus materias',
      desc: 'Agrega las asignaturas del semestre. Personalízalas con un color que las identifique.',
    },
    {
      Icon: Sparkles,
      title: 'Disfruta la calma',
      desc: 'Registra tareas y gastos. CampusZen te muestra el panorama claro, sin abrumarte.',
    },
  ];

  return (
    <section className="relative py-20 sm:py-28">
      {/* Banda crema oscura sutil */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 bottom-0 -mx-12 rounded-[60px] pointer-events-none"
        style={{ background: '#EEF6EC', opacity: 0.55 }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: '#FFFFFF', color: '#2D5016', border: '1px solid #DCE9D7' }}
          >
            En tres pasos
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: '#2D5016', ...jakartaStyle }}
          >
            Cómo funciona
          </h2>
          <p className="text-base text-[#4A5568]">
            Empieza a sentir el alivio de tener todo organizado, paso a paso.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative bg-white rounded-3xl border border-[#DCE9D7] p-7 hover:-translate-y-1 transition-all duration-300"
              style={{ boxShadow: '0 8px 24px rgba(45, 80, 22, 0.08)' }}
            >
              {/* Numero gigante decorativo */}
              <span
                aria-hidden
                className="absolute top-4 right-5 text-7xl font-extrabold leading-none opacity-10 select-none"
                style={{ color: '#7BAE7F', ...jakartaStyle }}
              >
                {i + 1}
              </span>

              <span
                className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white mb-5"
                style={{ background: 'linear-gradient(135deg, #7BAE7F, #A8D5A2)' }}
              >
                <s.Icon size={22} />
              </span>

              <h3
                className="relative text-lg font-bold mb-2"
                style={{ color: '#2D5016', ...jakartaStyle }}
              >
                {s.title}
              </h3>
              <p className="relative text-sm text-[#4A5568] leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mt-14"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #2D5016, #5D9763)',
              boxShadow: '0 16px 40px rgba(45, 80, 22, 0.30)',
            }}
          >
            Empieza tu calma ahora <span aria-hidden>🌿</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* Icono custom para "Crear cuenta" en steps (lucide UserPlus) */
function UserPlusIcon(props: { size?: number; className?: string }) {
  return (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="relative border-t border-[#DCE9D7] bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg, #7BAE7F, #A8D5A2)' }}
            aria-hidden
          >
            <Leaf size={18} />
          </span>
          <div>
            <p className="text-sm font-bold" style={{ color: '#2D5016', ...jakartaStyle }}>
              CampusZen
            </p>
            <p className="text-xs text-[#718096]">Tu espacio de calma universitaria</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-[#4A5568]">
          <Link href="/login" className="hover:text-[#2D5016] transition-colors">
            Iniciar sesión
          </Link>
          <Link href="/register" className="hover:text-[#2D5016] transition-colors">
            Crear cuenta
          </Link>
          <a
            href="mailto:hola@campuszen.app"
            className="hover:text-[#2D5016] transition-colors hidden sm:inline"
          >
            Contacto
          </a>
        </div>

        <p className="text-xs text-[#718096]">
          © {new Date().getFullYear()} CampusZen · Hecho con calma 🌿
        </p>
      </div>
    </footer>
  );
}
