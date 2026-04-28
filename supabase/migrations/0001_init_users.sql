-- Migration 0001: Initialize users table and migrations tracking
-- Author: CampusZen
-- Date: 2026-04-28

CREATE TABLE IF NOT EXISTS _migrations (
  id          SERIAL       PRIMARY KEY,
  filename    VARCHAR(255) UNIQUE NOT NULL,
  applied_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id                    UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  name                  VARCHAR(100)  NOT NULL,
  email                 VARCHAR(255)  UNIQUE NOT NULL,
  password_hash         TEXT          NOT NULL,
  role                  VARCHAR(10)   DEFAULT 'student'
                        CHECK (role IN ('student', 'admin')),
  theme                 VARCHAR(10)   DEFAULT 'light'
                        CHECK (theme IN ('light', 'dark')),
  budget_monthly        DECIMAL(10,2),
  notifications_enabled BOOLEAN       DEFAULT true,
  is_active             BOOLEAN       DEFAULT true,
  last_login_at         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
