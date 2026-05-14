"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

interface DiagnosticData {
  mode: "seed" | "live";
  timestamp: string;
  supabase: { connected: boolean; status: string };
  blob: { connected: boolean; status: string };
  migrations: { applied: number; pending: number; total: number };
  tables: { users: number; subjects: number; tasks: number; expenses: number };
}

export default function DiagnosticPanel() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const response = await fetch("/api/system/diagnose", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Error al obtener diagnósticos");
        const data = await response.json();
        setDiagnostics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnostics();
    // Recargar cada 5 segundos
    const interval = setInterval(fetchDiagnostics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[--cs-bg-secondary] rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[--cs-error]/10 border border-[--cs-error]/30 rounded-lg p-4">
        <p className="text-[--cs-error] font-medium">❌ Error</p>
        <p className="text-sm text-[--cs-text-secondary]">{error}</p>
      </div>
    );
  }

  if (!diagnostics) {
    return (
      <div className="text-center py-8 text-[--cs-text-secondary]">
        Sin datos disponibles
      </div>
    );
  }

  // Helper para badge de estado
  const StatusBadge = ({
    connected,
    status,
  }: {
    connected: boolean;
    status: string;
  }) => (
    <div
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
        connected
          ? "bg-[--cs-success]/20 text-[--cs-success]"
          : "bg-[--cs-alert]/20 text-[--cs-alert]"
      }`}
    >
      {status}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Modo del Sistema */}
      <Card className="border-2 border-[--cs-primary]/20 bg-gradient-to-r from-[--cs-primary]/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[--cs-text-secondary] mb-2">
              Modo del Sistema
            </h3>
            <p className="text-2xl font-bold text-[--cs-text-primary]">
              {diagnostics.mode === "live" ? "🟢 LIVE" : "🟡 SEED"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[--cs-text-secondary]">Última verificación</p>
            <p className="text-sm text-[--cs-text-primary]">
              {new Date(diagnostics.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Supabase y Vercel Blob */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-[--cs-text-secondary] mb-3">
            🗄️ Supabase
          </h3>
          <StatusBadge
            connected={diagnostics.supabase.connected}
            status={diagnostics.supabase.status}
          />
          <div className="mt-3 text-sm">
            <p className="text-[--cs-text-secondary]">
              {diagnostics.supabase.connected
                ? "✅ Base de datos conectada y operativa"
                : "⏳ Base de datos no disponible"}
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[--cs-text-secondary] mb-3">
            ☁️ Vercel Blob
          </h3>
          <StatusBadge
            connected={diagnostics.blob.connected}
            status={diagnostics.blob.status}
          />
          <div className="mt-3 text-sm">
            <p className="text-[--cs-text-secondary]">
              {diagnostics.blob.connected
                ? "✅ Storage disponible"
                : "❌ Storage no disponible"}
            </p>
          </div>
        </Card>
      </div>

      {/* Migraciones */}
      <Card>
        <h3 className="text-sm font-semibold text-[--cs-text-secondary] mb-4">
          📋 Migraciones
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[--cs-text-secondary]">Progreso</span>
            <span className="font-bold text-[--cs-primary]">
              {diagnostics.migrations.applied}/{diagnostics.migrations.total}
            </span>
          </div>
          <div className="w-full bg-[--cs-bg-secondary] rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[--cs-primary] to-[--cs-success] h-3 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round(
                  (diagnostics.migrations.applied / diagnostics.migrations.total) * 100
                )}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="bg-[--cs-success]/10 rounded p-2 text-center">
              <p className="text-xs text-[--cs-text-secondary]">Aplicadas</p>
              <p className="text-lg font-bold text-[--cs-success]">
                {diagnostics.migrations.applied}
              </p>
            </div>
            <div className="bg-[--cs-alert]/10 rounded p-2 text-center">
              <p className="text-xs text-[--cs-text-secondary]">Pendientes</p>
              <p className="text-lg font-bold text-[--cs-alert]">
                {diagnostics.migrations.pending}
              </p>
            </div>
            <div className="bg-[--cs-primary]/10 rounded p-2 text-center">
              <p className="text-xs text-[--cs-text-secondary]">Total</p>
              <p className="text-lg font-bold text-[--cs-primary]">
                {diagnostics.migrations.total}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tablas */}
      <Card>
        <h3 className="text-sm font-semibold text-[--cs-text-secondary] mb-4">
          📊 Tablas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(diagnostics.tables).map(([tableName, count]) => (
            <div
              key={tableName}
              className="bg-[--cs-bg-secondary] rounded-lg p-3 text-center hover:bg-[--cs-bg-secondary]/80 transition-colors"
            >
              <p className="text-xs text-[--cs-text-secondary] capitalize mb-1">
                {tableName}
              </p>
              <p className="text-2xl font-bold text-[--cs-primary]">{count}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Info */}
      <p className="text-xs text-[--cs-text-secondary] text-center">
        Los datos se actualizan automáticamente cada 5 segundos
      </p>
    </div>
  );
}
