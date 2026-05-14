-- Migration: 0005_init_admin_logs.sql
-- Tabla de control para operaciones administrativas
-- Nota: La auditoría principal se persiste en Vercel Blob
-- Esta tabla es de referencia rápida para operaciones frecuentes del admin

CREATE TABLE IF NOT EXISTS admin_logs (
  id                    UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id              UUID          NOT NULL REFERENCES users(id),
  admin_email           VARCHAR(255)  NOT NULL,
  action                VARCHAR(50)   NOT NULL
                        CHECK (action IN ('suspend', 'activate', 'delete', 'bootstrap')),
  target_user_id        UUID          REFERENCES users(id),
  target_user_email     VARCHAR(255),
  details               JSONB         DEFAULT '{}',
  created_at            TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target_user_id ON admin_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
