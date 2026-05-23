// app/dashboard/page.tsx
// Dashboard principal de CampusZen — Fase 2 + Fase 7

"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import SeedModeBanner from "@/components/admin/SeedModeBanner";
import { AlertBanner } from "@/components/tasks/AlertBanner";
import ExpenseChart from "@/components/charts/ExpenseChart";
import BudgetBar from "@/components/expenses/BudgetBar";
import { ExpenseSummary } from "@/lib/types";
import { formatCOP } from "@/lib/format";
import { useRouter } from "next/navigation";
import { ListTodo, Wallet, Target } from "lucide-react";

interface DashboardData {
  mode: "seed" | "live";
  user: { id: string };
  tasks: any[];
  expenses: any[];
  urgentTasks: any[];
  monthlySummary: any;
  weeklyStats: any;
  expenseSummary: ExpenseSummary | null;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashboardRes, meRes] = await Promise.all([
          fetch("/api/dashboard", { credentials: "include" }),
          fetch("/api/auth/me", { credentials: "include" }),
        ]);
        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          setDashboardData(data);
        }
        if (meRes.ok) {
          const me = await meRes.json();
          const fullName = me?.user?.name || "";
          setUserName(fullName.split(" ")[0] || fullName);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
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
        <header className="mb-8">
          <p className="text-sm text-[--cs-text-secondary] mb-1">
            {new Date().toLocaleDateString("es", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 className="text-3xl font-bold" style={{ color: "var(--cs-title)" }}>
            Tú puedes con todo{userName ? `, ${userName}` : ""} <span aria-hidden>🌿</span>
          </h1>
        </header>

        {/* Seed Mode Banner */}
        {dashboardData?.mode === "seed" && <SeedModeBanner />}

        {/* Banner de alertas urgentes (Fase 5) */}
        {dashboardData?.urgentTasks && dashboardData.urgentTasks.length > 0 && (
          <div className="mb-8">
            <AlertBanner
              urgentTasks={dashboardData.urgentTasks}
              onViewTasks={() => {
                window.location.href = '/tasks?status=pendiente';
              }}
            />
          </div>
        )}

        {/* Grid de stat cards premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Tareas Pendientes",
              value: String(dashboardData?.tasks.length || 0),
              Icon: ListTodo,
              accentFrom: "#7BAE7F",
              accentTo: "#A8D5A2",
            },
            {
              label: "Gastos del Mes",
              value: formatCOP(dashboardData?.expenseSummary?.totalAmount),
              Icon: Wallet,
              accentFrom: "#5D9763",
              accentTo: "#7BAE7F",
            },
            {
              label: "Presupuesto Usado",
              value:
                dashboardData?.expenseSummary?.budgetPercentage !== null &&
                dashboardData?.expenseSummary?.budgetPercentage !== undefined
                  ? `${dashboardData.expenseSummary.budgetPercentage}%`
                  : "—",
              Icon: Target,
              accentFrom: "#A8D5A2",
              accentTo: "#C2E2BD",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-3xl border border-[--cs-border] bg-[--cs-bg-card] p-6 cs-shadow-card hover:cs-shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Burbuja decorativa */}
              <div
                aria-hidden
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 blur-2xl pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${stat.accentFrom}, ${stat.accentTo})` }}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[--cs-text-secondary] mb-3">
                    {stat.label}
                  </p>
                  <p
                    className="text-4xl font-bold tracking-tight leading-none"
                    style={{ color: "var(--cs-title)" }}
                  >
                    {stat.value}
                  </p>
                </div>

                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${stat.accentFrom}, ${stat.accentTo})`,
                    boxShadow: `0 8px 20px ${stat.accentFrom}40`,
                  }}
                >
                  <stat.Icon size={22} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* BudgetBar y gráfica de gastos (Fase 7) */}
        {dashboardData?.expenseSummary && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <BudgetBar
                totalAmount={dashboardData.expenseSummary.totalAmount}
                budgetPercentage={dashboardData.expenseSummary.budgetPercentage}
              />
            </div>
            <div className="lg:col-span-2">
              <ExpenseChart data={dashboardData.expenseSummary.byCategory} />
            </div>
          </div>
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
                      className="px-4 py-2 bg-[--cs-primary] text-white rounded-lg hover:opacity-90 text-sm"
                    >
                      Ir a Tareas
                    </a>
                    <a
                      href="/expenses"
                      className="px-4 py-2 bg-[--cs-secondary] text-[--cs-text-primary] rounded-lg hover:opacity-90 text-sm"
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
              <p className="text-sm text-[--cs-text-secondary] mb-2">
                Tareas Completadas (7 días)
              </p>
              <p className="text-2xl font-bold text-[--cs-success]">
                {dashboardData.weeklyStats.tasksCompleted}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-[--cs-text-secondary] mb-2">
                Gastos Registrados (7 días)
              </p>
              <p className="text-2xl font-bold text-[--cs-primary]">
                {dashboardData.weeklyStats.expensesRecorded}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-[--cs-text-secondary] mb-2">
                Tareas Creadas (7 días)
              </p>
              <p className="text-2xl font-bold text-[--cs-success]">
                {dashboardData.weeklyStats.tasksCreated}
              </p>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
