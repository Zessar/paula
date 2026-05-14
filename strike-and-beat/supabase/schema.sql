-- ============================================================================
-- MIGRACION: Strike & Beat - Esquema completo para mockData
-- Adapta el esquema original para encajar con los datos de mockData.ts
-- ============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: event_info (Informacion General del Evento)
-- Ampliada con campos de hero, about section, etc.
CREATE TABLE IF NOT EXISTS event_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    event_date VARCHAR(100) NOT NULL,
    doors_open_time VARCHAR(20) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    location_address TEXT NOT NULL,
    hero_image TEXT,
    about_title VARCHAR(255),
    about_text TEXT,
    about_secondary_text TEXT,
    about_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA: tickets (Tipos de Entradas)
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES event_info(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    total_stock INT NOT NULL DEFAULT 0,
    available_stock INT NOT NULL DEFAULT 0,
    management_fees DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stripe_product_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA: fights (Combates - antes fighters_artists)
-- Rediseñada para encajar con la estructura VS del mockData
CREATE TABLE IF NOT EXISTS fights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES event_info(id) ON DELETE CASCADE,
    name_a VARCHAR(255) NOT NULL,
    image_a TEXT,
    alias_a VARCHAR(100),
    name_b VARCHAR(255) NOT NULL,
    image_b TEXT,
    alias_b VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    rounds VARCHAR(50) NOT NULL,
    rules VARCHAR(100) NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA: artists (Artistas musicales)
CREATE TABLE IF NOT EXISTS artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES event_info(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    image TEXT,
    profile_link TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA: sponsors (Patrocinadores)
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES event_info(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    tier VARCHAR(20) DEFAULT 'bronze',
    opacity INT DEFAULT 50,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA: faqs (Preguntas Frecuentes)
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES event_info(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLA: orders (Pedidos / Compras)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_full_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_document_id VARCHAR(50) NOT NULL,
    address_street TEXT NOT NULL,
    address_city VARCHAR(100) NOT NULL,
    address_zip_code VARCHAR(20) NOT NULL,
    address_country VARCHAR(100) DEFAULT 'España',
    stripe_checkout_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABLA: order_items (Lineas de pedido)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE event_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE fights ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Lectura publica para elementos visibles en la web
CREATE POLICY "Lectura publica de evento" ON event_info FOR SELECT USING (true);
CREATE POLICY "Lectura publica de tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Lectura publica de combates" ON fights FOR SELECT USING (true);
CREATE POLICY "Lectura publica de artistas" ON artists FOR SELECT USING (true);
CREATE POLICY "Lectura publica de sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Lectura publica de faqs" ON faqs FOR SELECT USING (true);

-- Insercion publica temporal para seeding (en produccion se restringe al service_role)
CREATE POLICY "Insercion temporal para seed" ON event_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Insercion temporal tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Insercion temporal combates" ON fights FOR INSERT WITH CHECK (true);
CREATE POLICY "Insercion temporal artistas" ON artists FOR INSERT WITH CHECK (true);
CREATE POLICY "Insercion temporal sponsors" ON sponsors FOR INSERT WITH CHECK (true);
CREATE POLICY "Insercion temporal faqs" ON faqs FOR INSERT WITH CHECK (true);

-- Eliminacion temporal para reset del seed
CREATE POLICY "Eliminacion temporal evento" ON event_info FOR DELETE USING (true);
CREATE POLICY "Eliminacion temporal tickets" ON tickets FOR DELETE USING (true);
CREATE POLICY "Eliminacion temporal combates" ON fights FOR DELETE USING (true);
CREATE POLICY "Eliminacion temporal artistas" ON artists FOR DELETE USING (true);
CREATE POLICY "Eliminacion temporal sponsors" ON sponsors FOR DELETE USING (true);
CREATE POLICY "Eliminacion temporal faqs" ON faqs FOR DELETE USING (true);
