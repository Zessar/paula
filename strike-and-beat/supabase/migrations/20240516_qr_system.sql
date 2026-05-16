-- Tabla para las entradas individuales generadas
CREATE TABLE IF NOT EXISTS public.ticket_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    
    -- Código único para el QR (UUID para que sea impredecible)
    qr_code UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    
    -- Datos del asistente (opcional, por si queremos entradas nominativas)
    holder_name TEXT,
    holder_email TEXT,
    
    -- Estado de la entrada
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'cancelled')),
    
    -- Información de validación
    validated_at TIMESTAMPTZ,
    validated_by UUID, -- ID del perfil del validador
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla para los perfiles de validadores (personal de puerta)
CREATE TABLE IF NOT EXISTS public.validator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    pin_code TEXT NOT NULL, -- PIN de 4-6 dígitos para acceso rápido en móvil
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_ticket_entries_qr_code ON public.ticket_entries(qr_code);
CREATE INDEX IF NOT EXISTS idx_ticket_entries_order_id ON public.ticket_entries(order_id);

-- Habilitar RLS
ALTER TABLE public.ticket_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validator_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (solo admin puede gestionar todo)
CREATE POLICY "Admins can do everything on ticket_entries" ON public.ticket_entries
    FOR ALL USING (auth.jwt() ->> 'email' = 'veladadeboxeobeneficaazuqueca@hotmail.com');

CREATE POLICY "Admins can do everything on validator_profiles" ON public.validator_profiles
    FOR ALL USING (auth.jwt() ->> 'email' = 'veladadeboxeobeneficaazuqueca@hotmail.com');

-- Permitir que los validadores vean y actualicen entradas si tienen un PIN válido (lógica manejada en RPC o Server Action para más seguridad)
