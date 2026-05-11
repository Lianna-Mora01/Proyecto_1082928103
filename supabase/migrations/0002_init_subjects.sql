-- Migration: 0002_init_subjects.sql
-- Fase 3: Módulo de Materias
-- Crea la tabla subjects con soft delete (is_active)

CREATE TABLE IF NOT EXISTS subjects (
  id         UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID          REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100)  NOT NULL,
  color      VARCHAR(7)    DEFAULT '#40916C',
  is_active  BOOLEAN       DEFAULT true,
  created_at TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subjects_user ON subjects(user_id);

-- RLS: Los usuarios solo pueden ver sus propias materias
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subjects" ON subjects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subjects" ON subjects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subjects" ON subjects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subjects" ON subjects
  FOR DELETE USING (auth.uid() = user_id);