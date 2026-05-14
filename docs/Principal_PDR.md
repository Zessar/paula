PRD (Product Requirements Document): Plataforma "Strike & Beat" (Eventos de Combate y Urbano)

Este documento es la fuente de verdad absoluta para la arquitectura, el sistema de diseño y las reglas de negocio. Todos los agentes (Frontend, Backend, Stripe) deben consultar este archivo y el DESIGN.md antes de escribir código.

1. Reglas UI/UX (Frontend)

Idioma: Toda la interfaz de usuario, textos y placeholders DEBEN estar en castellano.

Geometría: border-radius: 0px en toda la web. Todo es cuadrado y crudo.

Componentes Críticos:

Navbar: Debe estar fijo arriba. DEBE contener siempre un enlace a "Entradas", el icono del carrito de compras, y un Avatar de perfil de usuario (dejando el hueco/placeholder para cuando se integre el login).

CTAs (Call To Action): Todos los botones de compra, reserva o acciones principales deben usar los colores de máximo contraste definidos en DESIGN.md (Terciario/Oro o Primario/Violeta).

Copy y Textos Base: El tono de la web es agresivo, callejero y directo.

2. Textos Legales, Soporte y FAQ

El backend y frontend deben prever rutas (/legal, /faq) para este contenido:

Términos de Uso y Privacidad: Preparar plantillas donde el cliente pueda añadir su CIF, razón social (Asociación Caminando / Strike & Beat), política de devoluciones de entradas y uso de datos personales.

FAQ Extenso (Acordeón): Debe incluir preguntas como:

¿A qué hora empieza el evento? (Apertura 17:15, Boxeo infantil 17:35).

¿Hay límite de edad?

¿Cómo puedo donar a la Asociación Caminando?

¿Dónde recojo mi pulsera / Entrada?

¿Puedo asistir a los pesajes? (Sí, 6 de junio por la mañana, pabellón Arroyo Vallejo, entrada gratuita).

3. Arquitectura y Validación de Datos (Zod)

El Agente Backend debe implementar estrictamente los siguientes esquemas de validación Zod.

A. Esquema de Checkout (Compra de Entradas)

Para poder generar una factura legal, el formulario de compra debe validar:

const CheckoutSchema = z.object({
  fullName: z.string().min(3, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  documentId: z.string().min(8, "DNI/NIF/NIE obligatorio para facturación"),
  address: z.object({
    street: z.string().min(5, "Dirección requerida"),
    city: z.string().min(2, "Ciudad requerida"),
    zipCode: z.string().min(4, "Código postal requerido"),
    country: z.string().default("España")
  }),
  items: z.array(z.object({
    ticketId: z.string(),
    quantity: z.number().min(1).max(10, "Máximo 10 entradas por compra")
  })).min(1, "Debes seleccionar al menos una entrada")
});


B. Esquemas de Administración (Admin Panel)

TicketSchema: name (Pista/Grada), price (número positivo), totalStock (ej. 233).

FighterArtistSchema: name, type (boxer/artist), imageUrl (opcional), socialLinks (URLs válidas).

EventInfoSchema: Validar fechas, horarios y ubicación.

4. Lógica de Negocio y Stripe

Cantidades: El usuario no compra "de 1 en 1". El flujo debe permitir añadir $X$ entradas de Grada y $Y$ entradas de Pista al carrito, sumar el total, y enviarlo a Stripe.

Sincronización Admin-Stripe: Si en el panel Admin se crea un nuevo tipo de entrada (Ej. "VIP - 50€"), el backend debe hacer la petición a la API de Stripe para crear ese Product y Price y guardar el price_id en la base de datos local.

Pruebas de Compra (Stripe Test Mode): * El sistema debe construirse inicialmente apuntando a las keys de prueba de Stripe (sk_test_..., pk_test_...).

El agente debe preparar un endpoint de Webhook (/api/webhooks/stripe) para escuchar eventos como checkout.session.completed e interactuar con la base de datos para restar el stock y marcar el Order como pagado.