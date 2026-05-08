// app/dashboard/page.tsx
// Dashboard de CampusZen - Fase 2

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { SeedModeBanner } from '@/components/admin/SeedModeBanner';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { LogOut, Home, FileText, Wallet, User, Settings } from 'lucide-react';
import { SafeUser } from '@/lib/types';

interface DashboardData {
  mode: 'seed' | 'live';
  user_id: string;
  summary: {
    urgent_tasks_count: number;
    pending_tasks_count: number;
    completed_tasks_this_week: number;
    subjects_count: number;
  };
  finances: {
    total_month: number;
    budget_monthly: number | null;
    budget_percentage: number | null;
    expenses_by_method: {
      efectivo: number;
      tarjeta: number;
    };
    expenses_by_category: Array<{ category: string; amount: number }>;
  };
  alerts: any[];
  last_updated: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Obtener usuario
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.user);

        // Obtener datos del dashboard
        const dashRes = await fetch('/api/dashboard');
        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setDashboard(dashData);
        }
      } catch (error) {
        console.error(error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: <Home size={20} /> },
    { label: 'Tareas', href: '/tasks', icon: <FileText size={20} /> },
    { label: 'Gastos', href: '/expenses', icon: <Wallet size={20} /> },
    { label: 'Perfil', href: '/profile', icon: <User size={20} /> },
    { label: 'Admin', href: '/admin/db-setup', icon: <Settings size={20} />, admin: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-300 dark:border-gray-700 border-t-green-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Seed Mode Banner */}
      {dashboard?.mode === 'seed' && user.role === 'admin' && (
        <SeedModeBanner />
      )}

      {/* Header with Theme Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            ¡Bienvenido, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Tareas Pendientes"
          value={dashboard?.summary.pending_tasks_count || 0}
          color="blue"
        />
        <SummaryCard
          title="Tareas Urgentes"
          value={dashboard?.summary.urgent_tasks_count || 0}
          color="red"
        />
        <SummaryCard
          title="Completadas esta Semana"
          value={dashboard?.summary.completed_tasks_this_week || 0}
          color="green"
        />
        <SummaryCard
          title="Materias"
          value={dashboard?.summary.subjects_count || 0}
          color="purple"
        />
      </div>

      {/* Finances Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Month */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wallet size={20} className="text-green-600" />
              Gastos del Mes
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
              ${(dashboard?.finances.total_month || 0).toFixed(2)}
            </p>
            {dashboard?.finances.budget_monthly ? (
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Presupuesto</span>
                  <span className="font-medium">
                    ${dashboard.finances.budget_monthly.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((dashboard.finances.budget_percentage || 0) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {(dashboard.finances.budget_percentage || 0) * 100}% utilizado
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sin presupuesto mensual definido
              </p>
            )}
          </CardBody>
        </Card>

        {/* Payment Method Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Por Medio de Pago</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Efectivo</span>
              <span className="text-xl font-bold">
                ${(dashboard?.finances.expenses_by_method.efectivo || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tarjeta</span>
              <span className="text-xl font-bold">
                ${(dashboard?.finances.expenses_by_method.tarjeta || 0).toFixed(2)}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Acerca de CampusZen</h3>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            ¡Bienvenido a tu espacio universitario! En CampusZen puedes:
          </p>
          <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Organizar tus tareas académicas por materia y urgencia</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Controlar tus gastos universitarios con categorización</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Ver resúmenes y exportar reportes en PDF y Excel</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Recibir alertas de tareas próximas a vencer</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <AppLayout navLinks={navLinks} userRole={user.role as 'student' | 'admin'}>
      <DashboardContent />
    </AppLayout>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  color: 'blue' | 'red' | 'green' | 'purple';
}

const SummaryCard = ({ title, value, color }: SummaryCardProps) => {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700',
    green:
      'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700',
    purple:
      'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700',
  };

  return (
    <Card className={`border ${colorMap[color]}`}>
      <CardBody>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          {title}
        </p>
        <p className={`text-3xl font-bold ${colorMap[color].split(' ')[2]}`}>
          {value}
        </p>
      </CardBody>
    </Card>
  );
};
