-- 1. Borrar las políticas peligrosas actuales
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en event_info" ON event_info;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en fights" ON fights;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en artists" ON artists;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en tickets" ON tickets;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en sponsors" ON sponsors;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en faqs" ON faqs;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en orders" ON orders;
DROP POLICY IF EXISTS "Permitir lectura y escritura pública en order_items" ON order_items;

-- 2. Crear políticas SEGURAS (Solo Lectura Pública)
CREATE POLICY "Lectura publica de event_info" ON event_info FOR SELECT USING (true);
CREATE POLICY "Lectura publica de fights" ON fights FOR SELECT USING (true);
CREATE POLICY "Lectura publica de artists" ON artists FOR SELECT USING (true);
CREATE POLICY "Lectura publica de tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Lectura publica de sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Lectura publica de faqs" ON faqs FOR SELECT USING (true);

-- 3. Los pedidos (orders) no pueden ser leídos por el público
CREATE POLICY "Lectura privada de orders" ON orders FOR SELECT USING (false);
CREATE POLICY "Lectura privada de order_items" ON order_items FOR SELECT USING (false);
