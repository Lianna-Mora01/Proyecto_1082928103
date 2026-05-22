import { withRole } from "@/lib/withRole";
import { getSystemMode } from "@/lib/dataService";
import { getSupabaseClient, hasSupabaseCredentials } from "@/lib/supabase";
import { NextResponse, NextRequest } from "next/server";

// Verificar si hay usuarios admin en el sistema
async function hasAdminUsers(): Promise<boolean> {
  if (!hasSupabaseCredentials()) return false;
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1);
    return !error && data && data.length > 0;
  } catch {
    return false;
  }
}

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

// Permitir acceso sin auth en modo seed o cuando no hay usuarios admin
export async function GET(req: NextRequest) {
  const mode = await getSystemMode();
  // Permitir en modo seed
  if (mode === "seed") {
    return handler(req);
  }
  // Permitir si no hay usuarios admin (bootstrap no completado)
  const hasAdmins = await hasAdminUsers();
  if (!hasAdmins) {
    return handler(req);
  }
  return withRole(["admin"], handler)(req, {});
}
