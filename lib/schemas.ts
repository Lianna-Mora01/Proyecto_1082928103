// lib/schemas.ts
// Zod schemas para validación de entrada

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
    .max(100),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).optional(),
  theme: z.enum(['light', 'dark']).optional(),
  budget_monthly: z.number().positive().nullable().optional(),
  notifications_enabled: z.boolean().optional(),
});

export const bootstrapSecretSchema = z.object({
  secret: z.string().min(1, 'Secret requerido'),
});

export const auditEntrySchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  user_id: z.string().uuid(),
  user_email: z.string().email(),
  action: z.enum(['create', 'update', 'delete', 'login', 'logout', 'register', 'bootstrap', 'admin']),
  entity: z.enum(['user', 'subject', 'task', 'expense', 'system']),
  entity_id: z.string().optional(),
  changes: z.record(z.string(), z.object({ from: z.unknown(), to: z.unknown() })).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color debe ser un código hexadecimal válido').optional(),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color debe ser un código hexadecimal válido').optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
