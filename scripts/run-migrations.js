#!/usr/bin/env node
/**
 * Aplica todas las migraciones SQL de /supabase/migrations contra la DB indicada
 * por DATABASE_URL. Crea la tabla _migrations si no existe y solo aplica los
 * .sql que aún no han corrido.
 *
 * Uso:
 *   DATABASE_URL=postgres://... node scripts/run-migrations.js
 *   (o define DATABASE_URL en .env.local y corre con `npx dotenv-cli ...` o `node --env-file=.env.local ...`)
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Falta DATABASE_URL en el entorno.');
  console.error('   Obtenlo en Supabase → Settings → Database → Connection string → URI');
  console.error('   y agrégalo a .env.local. Después corre:');
  console.error('   node --env-file=.env.local scripts/run-migrations.js');
  process.exit(1);
}

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

async function getApplied(client) {
  const result = await client.query('SELECT filename FROM _migrations');
  return new Set(result.rows.map((r) => r.filename));
}

function readMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Directorio no encontrado: ${migrationsDir}`);
    process.exit(1);
  }
  return fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function applyMigration(client, filename) {
  const sql = fs.readFileSync(path.join(migrationsDir, filename), 'utf-8');
  await client.query(sql);
  await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [filename]);
}

async function main() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('✅ Conectado a PostgreSQL');

  await ensureMigrationsTable(client);
  const applied = await getApplied(client);
  const available = readMigrationFiles();
  const pending = available.filter((f) => !applied.has(f));

  if (pending.length === 0) {
    console.log(`✅ Sin migraciones pendientes (${applied.size} ya aplicadas)`);
  } else {
    console.log(`📦 ${pending.length} migración(es) pendiente(s):`);
    for (const filename of pending) {
      try {
        await applyMigration(client, filename);
        console.log(`   ✅ ${filename}`);
      } catch (err) {
        console.error(`   ❌ ${filename} — ${err.message}`);
        await client.end();
        process.exit(1);
      }
    }
  }

  await client.end();
  console.log('✅ Migraciones completadas');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
