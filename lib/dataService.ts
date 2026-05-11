// lib/dataService.ts
// ÚNICO punto de acceso a datos
// Encapsula Supabase, Blob, seed en un API tipado

import { getSupabaseClient } from './supabase';
import { getSeedUserByEmail } from './seedReader';
import { appendAudit } from './blobAudit';
import { hashPassword } from './auth';
import { User, SafeUser, CreateUserRequest, UpdateUserRequest, AuditEntry, SystemMode } from './types';
import { randomUUID } from 'crypto';

let _systemMode: SystemMode | null = null;

/**
 * Determina el modo del sistema: 'seed' (antes del bootstrap) o 'live' (con Supabase)
 * Se cachea en memoria porque el modo cambia exactamente una vez
 */
export async function getSystemMode(): Promise<SystemMode> {
  if (_systemMode !== null) return _systemMode;

  try {
    const client = getSupabaseClient();
    // Intentar ejecutar una query simple a _migrations
    const { data } = await client
      .from('_migrations')
      .select('id')
      .limit(1);
    
    _systemMode = 'live';
  } catch {
    _systemMode = 'seed';
  }

  return _systemMode;
}

/**
 * Fuerza el cambio de modo (útil para testing)
 */
export function setSystemModeOverride(mode: SystemMode): void {
  _systemMode = mode;
}

/**
 * Registra una entrada de auditoría
 * Falla silenciosamente si Blob no está disponible
 */
async function recordAudit(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<void> {
  const auditEntry: AuditEntry = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  await appendAudit(auditEntry);
}

// ==================== AUTH & USERS ====================

/**
 * Obtiene un usuario por email
 * En modo seed: lee del seed.json
 * En modo live: lee de Supabase
 */
export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    return getSeedUserByEmail(email);
  }

  // Modo live: Supabase
  const client = getSupabaseClient();
  const { data } = await client
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  return data || null;
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(id: string): Promise<SafeUser | null> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    const seedUser = await getSeedUserByEmail('admin@campuszen.app');
    if (seedUser && seedUser.id === id) {
      // Retornar sin password_hash
      const { password_hash, ...safe } = seedUser;
      return safe as SafeUser;
    }
    return null;
  }

  const client = getSupabaseClient();
  const { data } = await client
    .from('users')
    .select('id, name, email, role, theme, budget_monthly, notifications_enabled, is_active, last_login_at, created_at')
    .eq('id', id)
    .single();

  return data || null;
}

/**
 * Crea un nuevo usuario
 * Solo permitido en modo live (después del bootstrap)
 */
export async function createUser(data: CreateUserRequest): Promise<SafeUser> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    throw new Error(
      'No se pueden crear usuarios en modo seed. Ejecuta el bootstrap primero.'
    );
  }

  // Hashear contraseña
  const passwordHash = await hashPassword(data.password);

  const client = getSupabaseClient();
  const { data: newUser, error } = await client
    .from('users')
    .insert({
      name: data.name,
      email: data.email,
      password_hash: passwordHash,
      role: 'student',
      theme: 'light',
      is_active: true,
    })
    .select(
      'id, name, email, role, theme, budget_monthly, notifications_enabled, is_active, last_login_at, created_at'
    )
    .single();

  if (error || !newUser) {
    throw new Error(error?.message || 'Error al crear usuario');
  }

  // Registrar en auditoría
  await recordAudit({
    user_id: newUser.id,
    user_email: newUser.email,
    action: 'register',
    entity: 'user',
    entity_id: newUser.id,
  });

  return newUser as SafeUser;
}

/**
 * Actualiza un usuario
 */
export async function updateUser(id: string, updates: UpdateUserRequest): Promise<SafeUser> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    throw new Error('No se pueden actualizar usuarios en modo seed.');
  }

  const client = getSupabaseClient();
  const { data: updated, error } = await client
    .from('users')
    .update(updates)
    .eq('id', id)
    .select(
      'id, name, email, role, theme, budget_monthly, notifications_enabled, is_active, last_login_at, created_at'
    )
    .single();

  if (error || !updated) {
    throw new Error(error?.message || 'Error al actualizar usuario');
  }

  // Registrar en auditoría
  await recordAudit({
    user_id: id,
    user_email: updated.email,
    action: 'update',
    entity: 'user',
    entity_id: id,
    changes: Object.entries(updates).reduce(
      (acc, [key, value]) => {
        acc[key] = { from: null, to: value };
        return acc;
      },
      {} as Record<string, { from: unknown; to: unknown }>
    ),
  });

  return updated as SafeUser;
}

/**
 * Registra un login en auditoría
 */
export async function recordLogin(userId: string, userEmail: string): Promise<void> {
  // Actualizar last_login_at
  const mode = await getSystemMode();
  if (mode === 'live') {
    const client = getSupabaseClient();
    await client
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId);
  }

  // Registrar en auditoría
  await recordAudit({
    user_id: userId,
    user_email: userEmail,
    action: 'login',
    entity: 'user',
  });
}

/**
 * Registra un logout en auditoría
 */
export async function recordLogout(userId: string, userEmail: string): Promise<void> {
  await recordAudit({
    user_id: userId,
    user_email: userEmail,
    action: 'logout',
    entity: 'user',
  });
}

// ==================== SUBJECTS ====================

import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from './types';

/**
 * Obtiene todas las materias activas de un usuario
 */
export async function getSubjectsByUser(userId: string): Promise<Subject[]> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    // En modo seed, retornar array vacío
    return [];
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from('subjects')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Crea una nueva materia
 */
export async function createSubject(userId: string, userEmail: string, data: CreateSubjectRequest): Promise<Subject> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    throw new Error('No se pueden crear materias en modo seed.');
  }

  const client = getSupabaseClient();
  const { data: newSubject, error } = await client
    .from('subjects')
    .insert({
      user_id: userId,
      name: data.name,
      color: data.color || '#40916C',
      is_active: true,
    })
    .select('*')
    .single();

  if (error || !newSubject) {
    throw new Error(error?.message || 'Error al crear materia');
  }

  // Registrar en auditoría
  await recordAudit({
    user_id: userId,
    user_email: userEmail,
    action: 'create',
    entity: 'subject',
    entity_id: newSubject.id,
    changes: {
      name: { from: null, to: data.name },
      color: { from: null, to: data.color || '#40916C' },
    },
  });

  return newSubject as Subject;
}

/**
 * Actualiza una materia
 */
export async function updateSubject(userId: string, userEmail: string, subjectId: string, updates: UpdateSubjectRequest): Promise<Subject> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    throw new Error('No se pueden actualizar materias en modo seed.');
  }

  const client = getSupabaseClient();

  // Verificar que la materia pertenece al usuario
  const { data: existing, error: checkError } = await client
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .eq('user_id', userId)
    .single();

  if (checkError || !existing) {
    throw new Error('Materia no encontrada o no tienes permisos');
  }

  const { data: updated, error } = await client
    .from('subjects')
    .update(updates)
    .eq('id', subjectId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error || !updated) {
    throw new Error(error?.message || 'Error al actualizar materia');
  }

  // Registrar en auditoría
  await recordAudit({
    user_id: userId,
    user_email: userEmail,
    action: 'update',
    entity: 'subject',
    entity_id: subjectId,
    changes: Object.entries(updates).reduce(
      (acc, [key, value]) => {
        acc[key] = { from: existing[key], to: value };
        return acc;
      },
      {} as Record<string, { from: unknown; to: unknown }>
    ),
  });

  return updated as Subject;
}

/**
 * Desactiva una materia (soft delete)
 */
export async function deactivateSubject(userId: string, userEmail: string, subjectId: string): Promise<void> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    throw new Error('No se pueden desactivar materias en modo seed.');
  }

  const client = getSupabaseClient();

  // Verificar que la materia pertenece al usuario
  const { data: existing, error: checkError } = await client
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .eq('user_id', userId)
    .single();

  if (checkError || !existing) {
    throw new Error('Materia no encontrada o no tienes permisos');
  }

  if (!existing.is_active) {
    throw new Error('La materia ya está desactivada');
  }

  const { error } = await client
    .from('subjects')
    .update({ is_active: false })
    .eq('id', subjectId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error?.message || 'Error al desactivar materia');
  }

  // Registrar en auditoría
  await recordAudit({
    user_id: userId,
    user_email: userEmail,
    action: 'delete',
    entity: 'subject',
    entity_id: subjectId,
    changes: {
      is_active: { from: true, to: false },
    },
  });
}
