import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Migration not allowed in production' }, { status: 403 });
    }

    // Leer el archivo de migration
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '0002_init_subjects.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Ejecutar la migration usando Supabase
    const supabase = getSupabaseClient();

    // Ejecutar el SQL directamente
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.error('Migration error:', error);
      return NextResponse.json({ error: 'Migration failed', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subjects migration applied successfully' });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}