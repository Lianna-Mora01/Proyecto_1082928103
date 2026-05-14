// lib/types.ts
// Tipos compartidos para toda la aplicación

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  theme: 'light' | 'dark';
  budget_monthly: number | null;
  notifications_enabled: boolean;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  password_hash?: string;
}

export type SafeUser = Omit<User, 'password_hash'>;

export type AdminAction = 'suspend' | 'activate' | 'delete' | 'bootstrap';

export type AdminUserMetadata = SafeUser & {
  taskCount: number;
  expenseCount: number;
};

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'admin';
  iat?: number;
  exp?: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string; // ISO 8601
  user_id: string;
  user_email: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'register' | 'bootstrap' | 'admin';
  entity: 'user' | 'subject' | 'task' | 'expense' | 'system';
  entity_id?: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
  metadata?: Record<string, unknown>;
}

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserRequest = Partial<{
  name: string;
  theme: 'light' | 'dark';
  budget_monthly: number | null;
  notifications_enabled: boolean;
}>;

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

export type CreateSubjectRequest = {
  name: string;
  color?: string;
};

export type UpdateSubjectRequest = {
  name?: string;
  color?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  user?: SafeUser;
  error?: string;
};

export type Task = {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  priority: 'alta' | 'media' | 'baja';
  status: 'pendiente' | 'completada';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskWithSubject = Task & {
  subject_name?: string | null;
  subject_color?: string | null;
  isUrgent?: boolean; // Calculado: due_date < NOW() + 48h
};

export type CreateTaskRequest = {
  subject_id: string | null;
  title: string;
  description?: string | null;
  due_date: string; // ISO 8601, no puede ser pasado
  priority?: 'alta' | 'media' | 'baja';
};

export type UpdateTaskRequest = {
  subject_id?: string | null;
  title?: string;
  description?: string | null;
  due_date?: string;
  priority?: 'alta' | 'media' | 'baja';
};

export type Expense = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: 'Fotocopias' | 'Transporte' | 'Comida' | 'Materiales' | 'Otro';
  payment_method: 'Efectivo' | 'Tarjeta';
  expense_date: string;
  created_at: string;
  updated_at: string;
};

export type ExpenseSummary = {
  totalAmount: number;
  byCategory: Record<string, number>;
  byPaymentMethod: Record<string, number>;
  budgetPercentage: number | null; // null si no hay presupuesto definido
};

export const EXPENSE_CATEGORIES = [
  'Fotocopias',
  'Transporte',
  'Comida',
  'Materiales',
  'Otro'
] as const;

export const PAYMENT_METHODS = [
  'Efectivo',
  'Tarjeta'
] as const;

export type CreateExpenseRequest = {
  name: string;
  amount: number;
  category: typeof EXPENSE_CATEGORIES[number];
  payment_method: typeof PAYMENT_METHODS[number];
  expense_date: string; // ISO 8601
};

export type UpdateExpenseRequest = {
  name?: string;
  amount?: number;
  category?: typeof EXPENSE_CATEGORIES[number];
  payment_method?: typeof PAYMENT_METHODS[number];
  expense_date?: string;
};

export type SystemMode = 'seed' | 'live';
