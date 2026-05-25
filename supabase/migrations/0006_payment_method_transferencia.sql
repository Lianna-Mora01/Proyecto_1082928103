-- Migration: 0006_payment_method_transferencia.sql
-- Description: Agregar 'Transferencia' como metodo de pago.
-- La columna era VARCHAR(10) y solo permitia 'Efectivo' / 'Tarjeta', por lo que
-- ampliamos el tipo a VARCHAR(20) y reemplazamos el CHECK constraint.

-- 1. Ampliar columna para acomodar el valor mas largo ('Transferencia' = 13 chars)
ALTER TABLE expenses ALTER COLUMN payment_method TYPE VARCHAR(20);

-- 2. Eliminar el CHECK auto-generado (nombre estandar de Postgres)
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_payment_method_check;

-- 3. Recrear el CHECK con los 3 valores permitidos
ALTER TABLE expenses ADD CONSTRAINT expenses_payment_method_check
  CHECK (payment_method IN ('Efectivo', 'Tarjeta', 'Transferencia'));
