-- Migration: 0004_init_expenses.sql
-- Description: Create expenses table with financial constraints
-- Date: 2026-05-13

CREATE TABLE IF NOT EXISTS expenses (
  id             UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID          REFERENCES users(id) ON DELETE CASCADE,
  name           VARCHAR(200)  NOT NULL,
  amount         DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  category       VARCHAR(20)   NOT NULL
                 CHECK (category IN ('Fotocopias','Transporte','Comida','Materiales','Otro')),
  payment_method VARCHAR(10)   NOT NULL
                 CHECK (payment_method IN ('Efectivo','Tarjeta')),
  expense_date   DATE          NOT NULL,
  created_at     TIMESTAMPTZ   DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, expense_date DESC);
-- idx_expenses_user_month removido: DATE_TRUNC no es IMMUTABLE, Postgres no lo acepta en indices.
-- Los queries mensuales (gte/lte sobre expense_date) ya estan cubiertos por idx_expenses_user_date.