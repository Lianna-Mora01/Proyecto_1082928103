-- Migration: 0003_init_tasks.sql
-- Fase 4: Módulo de Tareas
-- Crea la tabla tasks con campos de estado, prioridad y fechas

CREATE TABLE IF NOT EXISTS tasks (
  id           UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID          REFERENCES users(id) ON DELETE CASCADE,
  subject_id   UUID          REFERENCES subjects(id) ON DELETE SET NULL,
  title        VARCHAR(200)  NOT NULL,
  description  TEXT,
  due_date     TIMESTAMPTZ   NOT NULL,
  priority     VARCHAR(10)   DEFAULT 'media'
               CHECK (priority IN ('alta', 'media', 'baja')),
  status       VARCHAR(15)   DEFAULT 'pendiente'
               CHECK (status IN ('pendiente', 'completada')),
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ   DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   DEFAULT NOW()
);

-- Índices para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON tasks(user_id, due_date ASC);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);

-- RLS: Los usuarios solo pueden ver sus propias tareas
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
