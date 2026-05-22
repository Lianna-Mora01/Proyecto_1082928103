import { withRole } from "@/lib/withRole";
import { getSystemMode } from "@/lib/dataService";
import { getSupabaseClient, hasSupabaseCredentials } from "@/lib/supabase";
import { NextResponse, NextRequest } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

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

/**
 * Ejecuta el bootstrap completo del sistema:
 * 1. Verifica modo actual
 * 2. Ejecuta todas las migrations
 * 3. Carga el seed inicial
 * 4. Cambia el modo de seed a live
 */
async function handler(req: NextRequest) {
  try {
    // Validar que sea desarrollo
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Bootstrap no permitido en producción" },
        { status: 403 }
      );
    }

    // Obtener modo actual
    const mode = await getSystemMode();
    
    if (mode === "live") {
      return NextResponse.json(
        { error: "Sistema ya está en modo live. No se puede ejecutar bootstrap nuevamente." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const results = {
      migrationsApplied: [] as string[],
      migrationsSkipped: [] as string[],
      seedInserted: false,
      errors: [] as string[],
      warnings: [] as string[],
      timestamp: new Date().toISOString(),
    };

    // Paso 1: Ejecutar migrations
    console.log("[Bootstrap] Iniciando migrations...");
    
    // Leer lista de migrations
    const migrationsDir = join(process.cwd(), "supabase", "migrations");
    let migrationFiles: string[] = [];

    try {
      // En Next.js App Router es mejor usar readdir
      const fs = await import("fs").then(m => m.promises);
      const files = await fs.readdir(migrationsDir);
      migrationFiles = files
        .filter(f => f.endsWith(".sql"))
        .sort();
    } catch (err) {
      results.warnings.push("No se pudo leer el directorio de migrations");
      console.warn("[Bootstrap] Directorio de migrations no encontrado:", err);
    }

    // Ejecutar cada migration
    for (const migFile of migrationFiles) {
      try {
        const migPath = join(migrationsDir, migFile);
        
        if (!existsSync(migPath)) {
          results.migrationsSkipped.push(migFile);
          continue;
        }

        const sql = readFileSync(migPath, "utf-8");
        
        // Ejecutar SQL usando client directo
        const { error } = await supabase.rpc("exec_sql", { sql });

        if (error) {
          results.errors.push(`Migration ${migFile}: ${error.message}`);
          console.error(`[Bootstrap] Error en migration ${migFile}:`, error);
        } else {
          results.migrationsApplied.push(migFile);
          console.log(`[Bootstrap] Migration ${migFile} ejecutada`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        results.errors.push(`Migration ${migFile}: ${message}`);
        console.error(`[Bootstrap] Error procesando migration ${migFile}:`, err);
      }
    }

    // Paso 2: Cargar seed
    console.log("[Bootstrap] Insertando seed...");
    
    try {
      const seedPath = join(process.cwd(), "data", "seed.json");
      const seedData = JSON.parse(readFileSync(seedPath, "utf-8"));

      if (seedData.users && Array.isArray(seedData.users)) {
        for (const user of seedData.users) {
          const { error } = await supabase
            .from("users")
            .insert([
              {
                id: user.id,
                name: user.name,
                email: user.email,
                password_hash: user.password_hash,
                role: user.role,
                theme: user.theme,
                budget_monthly: user.budget_monthly,
                notifications_enabled: user.notifications_enabled,
                is_active: user.is_active,
                created_at: user.created_at,
              },
            ]);

          if (error) {
            // Si el usuario ya existe, ignorar
            if (error.code !== "23505") {
              results.warnings.push(`Usuario ${user.email}: ${error.message}`);
            }
          } else {
            results.seedInserted = true;
            console.log(`[Bootstrap] Usuario ${user.email} insertado`);
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.errors.push(`Seed: ${message}`);
      console.error("[Bootstrap] Error cargando seed:", err);
    }

    // Paso 3: Cambiar modo de seed a live
    console.log("[Bootstrap] Cambiando modo a live...");
    
    try {
      const { error } = await supabase
        .from("system_config")
        .update({ mode: "live", updated_at: new Date().toISOString() })
        .eq("id", "system_mode");

      if (error) {
        results.errors.push(`Cambio de modo: ${error.message}`);
        console.error("[Bootstrap] Error cambiando modo:", error);
      } else {
        console.log("[Bootstrap] Modo cambiado a live");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.errors.push(`Cambio de modo: ${message}`);
    }

    // Retornar resultados
    const status = results.errors.length === 0 ? 200 : 206; // 206 = Partial Content
    
    return NextResponse.json(results, {
      status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[Bootstrap] Error fatal:", error);
    return NextResponse.json(
      { 
        error: "Error fatal en bootstrap",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Permitir acceso sin auth en modo seed o cuando no hay usuarios admin
export async function POST(req: NextRequest) {
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
