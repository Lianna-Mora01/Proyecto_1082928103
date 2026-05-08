// app/api/system/diagnose/route.ts
// GET /api/system/diagnose - Retorna diagnóstico del sistema

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole } from '@/lib/withAuth';
import { getSystemMode } from '@/lib/dataService';
import { getSupabaseClient } from '@/lib/supabase';
import * as fs from 'fs/promises';
import * as path from 'path';

async function readMigrationFiles(): Promise<string[]> {
  try {
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = await fs.readdir(migrationsDir);
    return files.filter((f) => f.endsWith('.sql')).sort();
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  return withRole('admin')(async () => {
    try {
      const mode = await getSystemMode();

      // Intentar conectar a Supabase
      let supabaseConnected = false;
      let supabaseMessage = 'Desconectado';

      try {
        const client = getSupabaseClient();
        const { error } = await client.from('_migrations').select('id').limit(1);
        if (!error) {
          supabaseConnected = true;
          supabaseMessage = 'Conectado correctamente';
        } else {
          supabaseMessage = 'Tabla _migrations no existe aún';
        }
      } catch (error) {
        supabaseMessage = 'Error de conexión a Supabase';
      }

      // Intentar conectar a Blob
      let blobConnected = false;
      let blobMessage = 'No configurado';

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        blobConnected = true;
        blobMessage = 'Conectado correctamente';
      } else {
        blobMessage = 'BLOB_READ_WRITE_TOKEN no configurado';
      }

      // Obtener migrations
      const allMigrations = await readMigrationFiles();
      let appliedMigrations: string[] = [];

      try {
        const client = getSupabaseClient();
        const { data } = await client
          .from('_migrations')
          .select('filename')
          .order('applied_at', { ascending: true });

        if (data) {
          appliedMigrations = (data as any[]).map((row) => row.filename);
        }
      } catch {
        // Tabla aún no existe
      }

      const pendingMigrations = allMigrations.filter(
        (f) => !appliedMigrations.includes(f)
      );

      // Obtener conteos de tablas
      const database = {
        users: 0,
        subjects: 0,
        tasks: 0,
        expenses: 0,
      };

      if (supabaseConnected) {
        try {
          const client = getSupabaseClient();

          // Contar usuarios
          const { count: usersCount } = await client
            .from('users')
            .select('*', { count: 'exact', head: true });
          if (usersCount !== null) database.users = usersCount;

          // Otras tablas pueden no existir aún
        } catch {
          // Tablas no existen
        }
      }

      return NextResponse.json({
        mode,
        supabase: {
          connected: supabaseConnected,
          message: supabaseMessage,
        },
        blob: {
          connected: blobConnected,
          message: blobMessage,
        },
        migrations: {
          applied: appliedMigrations,
          pending: pendingMigrations,
        },
        database,
      });
    } catch (error) {
      console.error('Diagnose error:', error);
      return NextResponse.json(
        { error: 'Error al diagnosticar sistema' },
        { status: 500 }
      );
    }
  })(req);
}
