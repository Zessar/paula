-- ============================================================
-- MIGRACIÓN: Añadir numeración secuencial y campo VIP a ticket_entries
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Crear secuencia global para numerar entradas
CREATE SEQUENCE IF NOT EXISTS ticket_entry_number_seq START WITH 1;

-- 2. Añadir columnas nuevas a ticket_entries
ALTER TABLE public.ticket_entries 
  ADD COLUMN IF NOT EXISTS entry_number INTEGER UNIQUE DEFAULT nextval('ticket_entry_number_seq'),
  ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ticket_price NUMERIC(10,2) DEFAULT 0;

-- 3. Asignar números a entradas existentes (si las hay)
-- Esto es seguro: solo actualiza las que no tengan número
UPDATE public.ticket_entries 
SET entry_number = nextval('ticket_entry_number_seq')
WHERE entry_number IS NULL;

-- 4. Hacer el campo NOT NULL ahora que todas tienen valor
ALTER TABLE public.ticket_entries 
  ALTER COLUMN entry_number SET NOT NULL;
