import { withRole } from "@/lib/withRole";
import { getSystemMode } from "@/lib/dataService";
import { NextResponse, NextRequest } from "next/server";

async function handler(req: NextRequest) {
  try {
    const mode = await getSystemMode();

    // Datos básicos de diagnóstico (simulado)
    const diagnosticData = {
      mode,
      timestamp: new Date().toISOString(),
      supabase: {
        connected: mode === "live",
        status: mode === "live" ? "✅ Conectado" : "⏳ Esperando bootstrap",
      },
      blob: {
        connected: true, // Asumir disponible por ahora
        status: "✅ Disponible",
      },
      migrations: {
        applied: mode === "live" ? 4 : 0,
        pending: mode === "seed" ? 4 : 0,
        total: 4,
      },
      tables: {
        users: mode === "live" ? 1 : 0,
        subjects: mode === "live" ? 0 : 0,
        tasks: mode === "live" ? 0 : 0,
        expenses: mode === "live" ? 0 : 0,
      },
    };

    return NextResponse.json(diagnosticData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error en diagnóstico:", error);
    return NextResponse.json(
      { error: "Error al diagnosticar el sistema" },
      { status: 500 }
    );
  }
}

export const GET = withRole(["admin"], handler);
