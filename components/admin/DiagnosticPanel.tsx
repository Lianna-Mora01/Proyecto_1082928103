"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

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
        const response = await fetch("/api/system/diagnose");
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
  }, []);

  if (loading) {
    return <div className="text-center py-8">Cargando diagnósticos...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-8">Error: {error}</div>;
  }

  if (!diagnostics) {
    return <div className="text-center py-8">Sin datos</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-(--cs-text-primary) mb-3">
            Supabase
          </h3>
          <Badge variant={diagnostics.supabase.connected ? "success" : "alert"}>
            {diagnostics.supabase.status}
          </Badge>
        </Card>

        <Card>
          <h3 className="font-semibold text-(--cs-text-primary) mb-3">
            Vercel Blob
          </h3>
          <Badge variant={diagnostics.blob.connected ? "success" : "alert"}>
            {diagnostics.blob.status}
          </Badge>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-(--cs-text-primary) mb-4">
          Migrations
        </h3>
        <div className="space-y-2">
          <p>
            <span className="text-(--cs-text-secondary)">Aplicadas:</span>{" "}
            <span className="font-medium">{diagnostics.migrations.applied}</span>
          </p>
          <p>
            <span className="text-(--cs-text-secondary)">Pendientes:</span>{" "}
            <span className="font-medium">{diagnostics.migrations.pending}</span>
          </p>
          <p>
            <span className="text-(--cs-text-secondary)">Total:</span>{" "}
            <span className="font-medium">{diagnostics.migrations.total}</span>
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-(--cs-text-primary) mb-4">
          Registros por tabla
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(diagnostics.tables).map(([table, count]) => (
            <div key={table}>
              <p className="text-sm text-(--cs-text-secondary) capitalize">
                {table}
              </p>
              <p className="text-lg font-bold text-[var(--cs-primary)]">
                {count}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-xs text-(--cs-text-secondary)">
        Última actualización: {new Date(diagnostics.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
