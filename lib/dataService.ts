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

// ==================== TASKS ====================

import { Task, TaskWithSubject, CreateTaskRequest, UpdateTaskRequest } from './types';

/**
 * Calcula si una tarea es urgente (< 48h de vencimiento)
 * RN-11: isUrgent se calcula en el servidor
 */
function calculateIsUrgent(dueDate: string): boolean {
  const now = new Date();
  const due = new Date(dueDate);
  const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilDue < 48 && hoursUntilDue > 0;
}

/**
 * Obtiene todas las tareas de un usuario, con información de la materia
 * Ordenadas por fecha límite (ascendente = más urgentes primero)
 * Incluye campo calculado isUrgent
 */
export async function getTasks(userId: string, filters?: { status?: 'pendiente' | 'completada'; subject_id?: string }): Promise<TaskWithSubject[]> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    return [];
  }

  const client = getSupabaseClient();
  let query = client
    .from('tasks')
    .select(`
      *,
      subjects(name, color)
    `)
    .eq('user_id', userId);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.subject_id) {
    query = query.eq('subject_id', filters.subject_id);
  }

  const { data, error } = await query.order('due_date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  // Transformar resultados y calcular isUrgent
  return (data || []).map((task: any) => ({
    ...task,
    subject_name: task.subjects?.name || null,
    subject_color: task.subjects?.color || null,
    isUrgent: calculateIsUrgent(task.due_date),
    subjects: undefined, // Remover el objeto subjects para evitar duplicación
  })) as TaskWithSubject[];
}

/**
 * Obtiene las tareas urgentes de un usuario (< 48h)
 */
export async function getUrgentTasks(userId: string): Promise<TaskWithSubject[]> {
  const tasks = await getTasks(userId, { status: 'pendiente' });
  return tasks.filter((task) => task.isUrgent);
}

/**
 * Crea una nueva tarea
 * RN-02: Requiere materia, descripción y fecha límite
 * RN-03: Fecha límite no puede ser pasada (validado con Zod antes de llegar aquí)
 */
export async function createTask(userId: string, userEmail: string, data: CreateTaskRequest): Promise<TaskWithSubject> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    throw new Error('No se pueden crear tareas en modo seed.');
  }

  const client = getSupabaseClient();

  // Insertar tarea
  const { data: newTask, error } = await client
    .from('tasks')
    .insert({
      user_id: userId,
      subject_id: data.subject_id,
      title: data.title,
      description: data.description || null,
      due_date: data.due_date,
      priority: data.priority || 'media',
      status: 'pendiente',
    })
    .select(
      `
      *,
      subjects(name, color)
    `
    )
    .single();

  if (error || !newTask) {
    throw new Error(error?.message || 'Error al crear tarea');
  }

  const result: TaskWithSubject = {
    ...newTask,
    subject_name: newTask.subjects?.name || null,
    subject_color: newTask.subjects?.color || null,
    isUrgent: calculateIsUrgent(newTask.due_date),
  };

  // Registrar en auditoría
  await recordAudit({
    user_id: userId,
    user_email: userEmail,
    action: 'create',
    entity: 'task',
    entity_id: result.id,
    changes: {
      title: { from: null, to: data.title },
      due_date: { from: null, to: data.due_date },
      priority: { from: null, to: data.priority || 'media' },
    },
  });

  return result;
}

/**
 * Actualiza una tarea
 * RN-05: Una tarea completada NO puede modificarse
 */
export async function updateTask(userId: string, userEmail: string, taskId: string, updates: UpdateTaskRequest): Promise<TaskWithSubject> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    throw new Error('No se pueden actualizar tareas en modo seed.');
  }

  const client = getSupabaseClient();

  // Obtener la tarea actual
  const { data: existing, error: checkError } = await client
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .eq('user_id', userId)
    .single();

  if (checkError || !existing) {
    throw new Error('Tarea no encontrada o no tienes permisos');
  }

  // RN-05: Tarea completada es inmutable
  if (existing.status === 'completada') {
    throw new Error('No se puede modificar una tarea completada (400)');
  }

  // Actualizar
  const { data: updated, error } = await client
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', userId)
    .select(
      `
      *,
      subjects(name, color)
    `
    )
    .single();

  if (error || !updated) {
    throw new Error(error?.message || 'Error al actualizar tarea');
  }

  const result: TaskWithSubject = {
    ...updated,
    subject_name: updated.subjects?.name || null,
    subject_color: updated.subjects?.color || null,
    isUrgent: calculateIsUrgent(updated.due_date),
  };

  // Registrar en auditoría
  await recordAudit({
    user_id: userId,
    user_email: userEmail,
    action: 'update',
    entity: 'task',
    entity_id: taskId,
    changes: Object.entries(updates).reduce(
      (acc, [key, value]) => {
        acc[key] = { from: existing[key], to: value };
        return acc;
      },
      {} as Record<string, { from: unknown; to: unknown }>
    ),
  });

  return result;
}

/**
 * Marca una tarea como completada
 * Endpoint separado: POST /api/tasks/[id]/complete
 * RN-05: Acción irreversible, registra completed_at
 */
export async function completeTask(userId: string, userEmail: string, taskId: string): Promise<TaskWithSubject> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    throw new Error('No se pueden completar tareas en modo seed.');
  }

  const client = getSupabaseClient();

  // Verificar que existe y pertenece al usuario
  const { data: existing, error: checkError } = await client
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .eq('user_id', userId)
    .single();

  if (checkError || !existing) {
    throw new Error('Tarea no encontrada o no tienes permisos');
  }

  if (existing.status === 'completada') {
    throw new Error('Esta tarea ya está completada');
  }

  const completedAt = new Date().toISOString();

  // Actualizar status y completed_at
  const { data: completed, error } = await client
    .from('tasks')
    .update({
      status: 'completada',
      completed_at: completedAt,
      updated_at: completedAt,
    })
    .eq('id', taskId)
    .eq('user_id', userId)
    .select(
      `
      *,
      subjects(name, color)
    `
    )
    .single();

  if (error || !completed) {
    throw new Error(error?.message || 'Error al completar tarea');
  }

  const result: TaskWithSubject = {
    ...completed,
    subject_name: completed.subjects?.name || null,
    subject_color: completed.subjects?.color || null,
    isUrgent: calculateIsUrgent(completed.due_date),
  };

  // Registrar en auditoría
  await recordAudit({
    user_id: userId,
    user_email: userEmail,
    action: 'update',
    entity: 'task',
    entity_id: taskId,
    changes: {
      status: { from: 'pendiente', to: 'completada' },
      completed_at: { from: null, to: completedAt },
    },
  });

  return result;
}

/**
 * Elimina una tarea (físicamente, no soft delete)
 */
export async function deleteTask(userId: string, userEmail: string, taskId: string): Promise<void> {
  const mode = await getSystemMode();

  if (mode === 'seed') {
    throw new Error('No se pueden eliminar tareas en modo seed.');
  }

  const client = getSupabaseClient();

  // Verificar que existe y pertenece al usuario
  const { data: existing, error: checkError } = await client
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .eq('user_id', userId)
    .single();

  if (checkError || !existing) {
    throw new Error('Tarea no encontrada o no tienes permisos');
  }

  const { error } = await client
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error?.message || 'Error al eliminar tarea');
  }

  // Registrar en auditoría
  await recordAudit({
    user_id: userId,
    user_email: userEmail,
    action: 'delete',
    entity: 'task',
    entity_id: taskId,
    changes: {
      title: { from: existing.title, to: null },
    },
  });
}
