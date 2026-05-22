// lib/supabase.ts
// Cliente Supabase para server (service role)
// NUNCA exportar esto desde componentes cliente

import { createClient, SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

// Soporta ambos formatos de variables: Vercel (SUPABASE_CAMPUSZEN_*) y estándar
const supabaseUrl = process.env.SUPABASE_CAMPUSZEN_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_CAMPUSZEN_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const hasCredentials = Boolean(supabaseUrl && supabaseServiceKey);

if (!hasCredentials) {
  console.warn(
    'Supabase credentials not found. System will run in seed mode until bootstrap.'
  );
}

export function getSupabaseClient(): SupabaseClientType {
  if (!hasCredentials) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function hasSupabaseCredentials(): boolean {
  return hasCredentials;
}

export type SupabaseClient = ReturnType<typeof getSupabaseClient>;
