// app/dashboard/page.tsx
// Dashboard principal de CampusZen — Fase 2

"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import SeedModeBanner from "@/components/admin/SeedModeBanner";

interface DashboardData {
  mode: "seed" | "live";
  user: { id: string };
  tasks: any[];
  expenses: any[];
  urgentTasks: any[];
  monthlySummary: any;
  weeklyStats: any;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 text-center">Cargando dashboard...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-(--cs-text-primary) mb-8">
          Dashboard
        </h1>

        {/* Seed Mode Banner */}
        {dashboardData?.mode === "seed" && <SeedModeBanner />}

        {/* Grid de tarjetas resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-sm text-(--cs-text-secondary) mb-2">
              Tareas Pendientes
            </p>
            <p className="text-3xl font-bold text-(--cs-primary)">
              {dashboardData?.tasks.length || 0}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-(--cs-text-secondary) mb-2">
              Gastos del Mes
            </p>
            <p className="text-3xl font-bold text-(--cs-primary)">
              ${dashboardData?.monthlySummary?.totalExpenses?.toFixed(2) || "0.00"}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-(--cs-text-secondary) mb-2">
              Presupuesto
            </p>
            <p className="text-3xl font-bold text-(--cs-primary)">
              {dashboardData?.monthlySummary?.budgetPercentage
                ? `${dashboardData.monthlySummary.budgetPercentage}%`
                : "—"}
            </p>
          </Card>
        </div>

        {/* Alertas urgentes */}
        {dashboardData?.urgentTasks && dashboardData.urgentTasks.length > 0 && (
          <Card className="mb-8 border-l-4 border-(--cs-alert)">
            <p className="font-semibold text-(--cs-alert) mb-3">
              ⚠️ Tareas vencen en menos de 48 horas
            </p>
            <div className="space-y-2">
              {dashboardData.urgentTasks.map((task: any, idx: number) => (
                <div key={idx} className="text-sm text-(--cs-text-primary)">
                  • {task.title}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {dashboardData?.tasks.length === 0 &&
          dashboardData?.expenses.length === 0 && (
            <Card>
              <EmptyState
                icon="🚀"
                title="¡Bienvenido a CampusZen!"
                description="Comienza agregando tareas para tus materias o registra tus gastos. Tu espacio universitario en calma."
                action={
                  <div className="flex gap-2">
                    <a
                      href="/tasks"
                      className="px-4 py-2 bg-(--cs-primary) text-white rounded-lg hover:opacity-90 text-sm"
                    >
                      Ir a Tareas
                    </a>
                    <a
                      href="/expenses"
                      className="px-4 py-2 bg-(--cs-secondary) text-(--cs-text-primary) rounded-lg hover:opacity-90 text-sm"
                    >
                      Ir a Gastos
                    </a>
                  </div>
                }
              />
            </Card>
          )}

        {/* Resumen semanal */}
        {dashboardData?.weeklyStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <p className="text-sm text-(--cs-text-secondary) mb-2">
                Tareas Completadas (7 días)
              </p>
              <p className="text-2xl font-bold text-(--cs-success)">
                {dashboardData.weeklyStats.tasksCompleted}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-(--cs-text-secondary) mb-2">
                Gastos Registrados (7 días)
              </p>
              <p className="text-2xl font-bold text-(--cs-primary)">
                {dashboardData.weeklyStats.expensesRecorded}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-(--cs-text-secondary) mb-2">
                Tareas Creadas (7 días)
              </p>
              <p className="text-2xl font-bold text-(--cs-success)">
                {dashboardData.weeklyStats.tasksCreated}
              </p>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
