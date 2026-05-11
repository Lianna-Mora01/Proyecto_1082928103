// Script temporal para aplicar la migration de subjects
// Ejecutar con: node scripts/apply-subjects-migration.js

import pg from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const { Client } = pg;

async function applySubjectsMigration() {
  console.log('Environment variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const password = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !password) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  // Construir database URL para Supabase
  const url = new URL(supabaseUrl);
  const host = url.hostname;
  const projectRef = host.split('.')[0];
  const databaseUrl = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;

  const client = new Client({ connectionString: databaseUrl });

  try {
    console.log('Connecting to database...');
    await client.connect();

    console.log('Reading migration file...');
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '0002_init_subjects.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Applying migration...');
    await client.query(migrationSQL);

    console.log('Migration applied successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applySubjectsMigration();