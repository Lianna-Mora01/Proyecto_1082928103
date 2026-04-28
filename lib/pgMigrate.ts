// lib/pgMigrate.ts
// Aplica migrations de Supabase usando pg (node-postgres)
// Solo se usa en el endpoint de bootstrap

import pg from 'pg';
import * as fs from 'fs/promises';
import * as path from 'path';

const { Client } = pg;

interface MigrationRecord {
  filename: string;
}

/**
 * Obtiene la lista de migrations aplicadas desde la tabla _migrations
 */
async function getAppliedMigrations(client: pg.Client): Promise<Set<string>> {
  try {
    const result = await client.query('SELECT filename FROM _migrations ORDER BY applied_at ASC');
    return new Set(result.rows.map((r: MigrationRecord) => r.filename));
  } catch {
    // Tabla no existe aún
    return new Set();
  }
}

/**
 * Lee todos los archivos de migrations del directorio
 */
async function readMigrationFiles(): Promise<string[]> {
  try {
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = await fs.readdir(migrationsDir);
    return files.filter((f) => f.endsWith('.sql')).sort();
  } catch {
    return [];
  }
}

/**
 * Lee el contenido SQL de una migration
 */
async function readMigrationContent(filename: string): Promise<string> {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const filePath = path.join(migrationsDir, filename);
  return fs.readFile(filePath, 'utf-8');
}

/**
 * Registra una migration como aplicada
 */
async function recordMigration(client: pg.Client, filename: string): Promise<void> {
  await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [filename]);
}

export interface MigrationResult {
  success: boolean;
  appliedCount: number;
  pendingCount: number;
  migrations: {
    filename: string;
    status: 'applied' | 'pending' | 'error';
    error?: string;
  }[];
  error?: string;
}

/**
 * Aplica todas las migrations pendientes
 * Retorna un reporte detallado
 */
export async function applyMigrations(databaseUrl: string): Promise<MigrationResult> {
  const client = new Client({ connectionString: databaseUrl });
  const migrations: MigrationResult['migrations'] = [];
  let appliedCount = 0;

  try {
    await client.connect();

    // Obtener estado actual
    const applied = await getAppliedMigrations(client);
    const available = await readMigrationFiles();
    const pending = available.filter((f) => !applied.has(f));

    // Aplicar migrations pendientes en orden
    for (const filename of pending) {
      try {
        const content = await readMigrationContent(filename);
        await client.query(content);
        await recordMigration(client, filename);
        migrations.push({ filename, status: 'applied' });
        appliedCount++;
      } catch (error) {
        migrations.push({
          filename,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Registrar migrations ya aplicadas
    for (const filename of Array.from(applied)) {
      if (!migrations.some((m) => m.filename === filename)) {
        migrations.push({ filename, status: 'applied' });
      }
    }

    return {
      success: migrations.every((m) => m.status !== 'error'),
      appliedCount,
      pendingCount: pending.length,
      migrations: migrations.sort((a, b) => a.filename.localeCompare(b.filename)),
    };
  } catch (error) {
    return {
      success: false,
      appliedCount: 0,
      pendingCount: 0,
      migrations,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  } finally {
    await client.end();
  }
}
