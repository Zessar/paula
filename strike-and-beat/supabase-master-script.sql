-- ==========================================
-- SCRIPT MAESTRO DE SUPABASE: STRIKE & BEAT
-- ==========================================

-- 1. Eliminar tablas si existen (por si acaso)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS sponsors;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS fights;
DROP TABLE IF EXISTS event_info;

-- ==========================================
-- CREACIÓN DE TABLAS
-- ==========================================

-- Tabla: event_info
CREATE TABLE event_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    location_name TEXT NOT NULL,
    location_address TEXT NOT NULL,
    hero_image TEXT,
    about_title TEXT,
    about_text TEXT,
    about_secondary_text TEXT,
    about_image TEXT,
    doors_open_time TEXT,
    location_logistics TEXT,
    weigh_in_date TEXT,
    weigh_in_doors TEXT,
    weigh_in_time TEXT,
    weigh_in_is_free BOOLEAN DEFAULT true,
    total_fights INTEGER DEFAULT 10,
    total_artists INTEGER DEFAULT 3,
    has_bars BOOLEAN DEFAULT true,
    break_times TEXT,
    first_fight_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: fights
CREATE TABLE fights (
    id TEXT PRIMARY KEY,
    name_a TEXT NOT NULL,
    image_a TEXT,
    alias_a TEXT,
    name_b TEXT NOT NULL,
    image_b TEXT,
    alias_b TEXT,
    category TEXT NOT NULL,
    rounds TEXT NOT NULL,
    rules TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: artists
CREATE TABLE artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    genre TEXT NOT NULL,
    image TEXT,
    profile_link TEXT,
    instagram_url TEXT,
    spotify_url TEXT,
    youtube_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: tickets
CREATE TABLE tickets (
    id TEXT PRIMARY KEY,
    stripe_price_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    available_stock INTEGER,
    management_fees NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: sponsors
CREATE TABLE sponsors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    opacity INTEGER DEFAULT 100,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: faqs
CREATE TABLE faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    customer_dni TEXT,
    stripe_session_id TEXT UNIQUE NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    marketing_consent BOOLEAN DEFAULT false
);

-- Tabla: order_items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    ticket_id TEXT REFERENCES tickets(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC NOT NULL
);

-- ==========================================
-- POLÍTICAS RLS (Row Level Security)
-- ==========================================
-- Habilitamos RLS en todas las tablas
ALTER TABLE event_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE fights ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas temporales para PERMITIR TODO (Lectura/Escritura pública)
-- IMPORTANTE: Cambiar en producción para proteger inserciones
CREATE POLICY "Permitir lectura y escritura pública en event_info" ON event_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir lectura y escritura pública en fights" ON fights FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir lectura y escritura pública en artists" ON artists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir lectura y escritura pública en tickets" ON tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir lectura y escritura pública en sponsors" ON sponsors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir lectura y escritura pública en faqs" ON faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir lectura y escritura pública en orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir lectura y escritura pública en order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- DATOS INICIALES (MOCK DATA)
-- ==========================================

-- Insertar evento info
INSERT INTO event_info (
    title, event_date, location_name, location_address, hero_image, 
    about_title, about_text, about_secondary_text, about_image, 
    doors_open_time, weigh_in_date, weigh_in_doors, weigh_in_time, weigh_in_is_free,
    total_fights, total_artists, has_bars, break_times, first_fight_time, location_logistics
) VALUES (
    'STRIKE & BEAT',
    '15 JUNIO 2024',
    'Pabellón Arroyo Vallejo',
    'Calle de la Victoria, 12, 28005 Madrid.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBg0VWvA2skJ8W53npl0ev84Xq3QCI-sPfymiVDGbJET27co9VH3ORf3TyRp8MaGs9b59qUggy4so5n2v51cQgc42oJrjbTwBIGDJ82zGwtd9xhSMSyLqe2NktaVEa6pJoF_OCtzKrXGt6pkTPpcXYXVoTyY5feqG9-G-aGhBTTzI4dtgerVL2_Iwx7bI-AuRyVnLZjqotnQi9UzOw6kJAtkawwm_aIzK36GvjLm2rK6m9CRSIly_mO5OT-ha_fkuhhvk8MrHsF6uo',
    'El Evento',
    'STRIKE & BEAT no es solo un espectáculo; es un golpe contra la exclusión. Todo lo recaudado será destinado a la Asociación Caminando, apoyando proyectos de integración social y deportiva en barrios vulnerables.',
    'Unimos la energía del ring con la potencia del escenario urbano para crear una noche de pura resistencia y solidaridad.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBfE-HPZlwJMUKaBeFgU-FM3Q4pwTNO2eMNKcpXLDIObs1ELhtXyeILqNg0qaeseqpbWS6bJ1XFfva585kgsz4hs3MzoASjwYw2PIez7rUgs16bizskOVhCOmJT5Q4n_eqJeNH_CcAc2fjeRwpCI3_qsmYVY-SNGJl_jHUT9S1CKKWtJXHPgKnYd2u6FHo8A7xatMhnjITNeSJaTlvzrML-5AsnR4EKbiupKkr4LgnTBSEoPKGTto1J-kKkaX4152zEskKHVdDp1b8',
    '18:00 hrs',
    '14 JUNIO 2024',
    '10:00 AM',
    '11:00 AM',
    true,
    10,
    3,
    true,
    '02',
    '17:35H',
    'AFORO: 2,500 ESPECTADORES
COMIDA Y BEBIDA: 2 BARRAS COMPLETAS + SNACKS
INSTALACIONES: ASEOS + PUESTOS DE MERCH
PARKING: APARCAMIENTO PÚBLICO ADYACENTE'
);

-- Insertar combates
INSERT INTO fights (id, name_a, image_a, alias_a, name_b, image_b, alias_b, category, rounds, rules, is_featured, sort_order) VALUES
('fight-1', 'R. EL LOBO', 'https://lh3.googleusercontent.com/aida-public/AB6AXuASjEWn-loHuq2yTE5pPsyYiySj17FIj097qgeTdosqCeIBA5zQ25W578ObeMsoeQ1hWOIrJhiyUhLz6hgbq94Wf4uapg_Y6uTY8HEOh5dNJjoS0_hcPn2w9uszlSoUSZqDnRUgNnNGN9Ih3qFYgRkJX37NEx2wl6CNr5QkH7dHU00EhbTqMwgOFH-FLH942Oz3Sr_q3he0vkbUlAfPqwwZrHJaAWzAEc7KV-BpJylczH2C9FQEONDwmmVtz7Y2_coNjiJLPtkZ7NQ', 'EL LOBO', 'MARC THE TANK', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvJ2fRR9b9OuYmgXdB2tEU_kHo8NqLh6DTRIZJ56WQLKtXeDSYMytqG0eb9WHc_k8rkhC45MBEZAeC3cZbEeA0zxQxRLdgL_iSAkVvpQC9JfLkkKwrHTUWNtv-goffK_t0DAbZRF-5GEPAhy3iiO2XW2-mRxTSl7WwNj6qlN8wnis_qyfnPw_Im4TXbAgMHHrPG74Mj24-F1cLC4DUSppqpeudSKM1ULD2iAAjWSS2rf-XFT-Zq848hhBeAgQhBy2gUieCLBgIzpg', 'THE TANK', 'PESO PESADO', '5 ROUNDS', 'BOXEO PRO', true, 1),
('fight-2', 'SARAY LA JEFA', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5nkwc3uPf56OqvVhy5dPZSnL3_O2nAW7Byf5z8Y05UdcZuwyT0UY1NWEUeXP0ihxmswsHNH9ptnqQyaJQZRpl70kd0p0udwaG44rx8xgJ9rhyScLpLInOqeYYNC8qZXSNXhdatckKJRExz3ynhGcIbyAJmYCOCYtjGU1aLOCSqvlPRcgyMHl5-TaUSMi_ZErFdx3KDwz5kRNtf04UCSQI6hLMwixhxIDJKRR1Y_UIWA5X0q78YO3sU9IpRW20Hl21z6XdKX6uA-I', 'LA JEFA', 'LUNA X', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrJcO7EjTupvjQrLEKESCNcJYUu2ovQ9Ju-wFdWO4tuBsL7GrsM0VnIWg6oMrJuwRevxaPu93PKVgdXKvtLTRpeq4VZz2FfKAktdGlCaxl-7aCodB3ETwH61a7WCKWs5l51_6NqVAe6YIOALQ8Xu9QPLeIx1wOyJQSniwNX3WM0hynkquP-3H_EpONzuO8KgwW-QhP02X8xXPjuYpTuP5SL8c-qdINUxSLfoVQ5vls5345NG0gfYYjKJggILwrD5Shkxs6SKMftx0', 'X', 'PESO PLUMA', '3 ROUNDS', 'BOXEO AMATEUR', true, 2);

-- Insertar artistas
INSERT INTO artists (id, name, genre, image, profile_link, sort_order) VALUES
('artist-1', 'MC VOLTAJE', 'RAP / HARDCORE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3CW79rAfa6ah19NmGAui9oCk6_aK5Y5sDgge4Ew5i-5WWnm4f1ayKBOQWTY6ahFX0iWwozySk8YNEl_O1JFFLJiJalkHaOu6V6iwhDHnamfxQsEoJnsiB4vkGPSzgSYWNMmBswXCRJAmRp32othrThMgYh0mjU6o5xmcvwXVEOQi3mGsGxtd8g2Oosicbyet5-9rMx8XwlAnaT3zTruNJo3wHU2hP0E4Avp_iiJi8JmkT6wyBAz8w6AAG7R-476up7VgEXz9ab2U', '/artistas', 1),
('artist-2', 'K-OS URBANO', 'DRILL / TRAP', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC25J-6cQCBtUtVembf3DrSldvCxk7vo-7221amGSPWZFkGk81hVfgDOXsbMrqStJwLWW9c3wmBh6gENOKCM7FloD5M0LD6n1v286x3hdU-iqQUUB-p8n5Px0TOkMKCcGoSPzg_-ykpOvpchYvA7kCSFqoH-cQZqnCKrOhtK2_xk0scIVPEqk1oVK6xsqv42hDVz7fyZDBw7lAMeBKoLgMTu4dzybHXEoR8RZvkODE6qAjzJ1XV8SXqIYqf15XLP7k22YxeMastDpQ', '/artistas', 2),
('artist-3', 'NEBULOSA', 'R&B / SOUL', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDed1o9V-Vh_arOZ2ByoC8Xv1-uzIe4KAPQwN9gUFmWidwogSF_3750X9ilEFpuZGYs5e7KH6EYq3nhcLtoV0WFUHJwzlwprh3W-Wf9MqNFG8Bo_q3Ne3uQWQ-OprcKBUWDnPQSSKuVZTLNTnMqw4w0OjQrAATPt4oxI2kOm-xfz_k24ul4CuU5NulYqyixm1OJuIYsmWCAbTM1Feqko1kFykRGaFDrWo2EZdLEwuRBOY91Cw5bb-k9_rP8wPldNW2tOXsuayzIKqk', '/artistas', 3);

-- Insertar tickets
INSERT INTO tickets (id, stripe_price_id, name, description, price, available_stock, management_fees) VALUES
('ticket-pista', 'price_pista_placeholder', 'Entrada Pista', 'Acceso directo a pie de ring. Vive la vibracion de cada golpe.', 15, null, 2.5),
('ticket-grada', 'price_grada_placeholder', 'Entrada Grada', 'Vision panoramica del octagono y el escenario principal.', 20, 233, 2.5);

-- Insertar sponsors
INSERT INTO sponsors (id, name, opacity, sort_order) VALUES
('sp-1', 'SPONSOR_01', 50, 1),
('sp-2', 'SPONSOR_02', 50, 2),
('sp-3', 'SPONSOR_03', 50, 3),
('sp-4', 'SPONSOR_04', 50, 4);

-- Insertar faqs
INSERT INTO faqs (id, question, answer, sort_order) VALUES
('faq-1', '¿A qué hora abren las puertas?', 'Las puertas abren a las 18:00 hrs. Te recomendamos llegar temprano para evitar filas y disfrutar del pre-show.', 1),
('faq-2', '¿Hay límite de edad?', 'El evento es apto para mayores de 18 años. Se requerirá identificación oficial con fotografía en la entrada.', 2),
('faq-3', '¿Qué incluye la entrada VIP?', 'La entrada VIP incluye acceso preferencial sin filas, zona exclusiva cerca del octágono/escenario, barra libre premium y acceso al after-party oficial.', 3);
