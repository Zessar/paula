import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";

// Necesitamos el Supabase Admin Client para saltarnos las reglas RLS e insertar las compras
function getAdminSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Usar la SERVICE ROLE KEY para permisos absolutos (webhook)
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {}
      }
    }
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("Falta STRIPE_WEBHOOK_SECRET. Verifica el archivo .env.local");
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Manejar el evento de pago completado
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    console.log("💰 ¡Pago recibido exitosamente!", session.id);

    try {
      const supabase = getAdminSupabase();

      // 1. Extraer los datos del carrito de la metadata de la sesión
      const cartData = JSON.parse(session.metadata?.cartData || "[]");
      const customerDni = session.metadata?.documentId || "No proporcionado";
      const customerName = session.customer_details?.name || "Desconocido";
      const customerEmail = session.customer_details?.email || "Sin email";
      const totalAmount = session.amount_total ? session.amount_total / 100 : 0; // Stripe devuelve céntimos
      const marketingConsent = session.metadata?.marketingConsent === "true";

      if (cartData.length === 0) {
        console.warn("⚠️  Sesión sin datos de carrito en la metadata.");
        return NextResponse.json({ received: true });
      }

      // 2. Insertar el Pedido (Order)
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_email: customerEmail,
          customer_name: customerName,
          customer_dni: customerDni,
          stripe_session_id: session.id,
          total_amount: totalAmount,
          status: "completed",
          marketing_consent: marketingConsent
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error("Error al insertar el pedido en BD:", orderError);
        throw new Error("No se pudo crear el pedido");
      }

      // 3. Preparar los Order Items
      const orderItems = cartData.map((item: any) => ({
        order_id: order.id,
        ticket_id: item.id,
        quantity: item.q,
        price_at_purchase: item.p
      }));

      // 4. Insertar los Order Items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error al insertar los items del pedido:", itemsError);
        throw new Error("No se pudieron crear los order items");
      }

      // 5. Actualizar el inventario (Restar stock)
      for (const item of cartData) {
        // Ejecutamos una llamada RPC (función de base de datos) o hacemos lectura + escritura.
        // Lo más seguro es usar un RPC para evitar condiciones de carrera, pero como somos admin:
        const { data: ticketData } = await supabase
          .from("tickets")
          .select("available_stock")
          .eq("id", item.id)
          .single();

        if (ticketData && ticketData.available_stock !== null) {
          const newStock = Math.max(0, ticketData.available_stock - item.q);
          await supabase
            .from("tickets")
            .update({ available_stock: newStock })
            .eq("id", item.id);
        }
      }

      console.log("✅ Pedido creado y stock actualizado correctamente.");

      // Forzar revalidación de la caché para que el badge de stock se actualice en la web
      try {
        const { revalidatePath } = await import("next/cache");
        revalidatePath("/entradas");
        revalidatePath("/", "layout");
      } catch (e) {
        console.error("Error revalidating path in webhook:", e);
      }

      // NOTA: Aquí en el futuro puedes integrar el envío del email con las entradas usando SendGrid

    } catch (err) {
      console.error("Error procesando checkout.session.completed:", err);
      // Stripe reintentará si devolvemos error 500
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  // Devolver un 200 OK para que Stripe sepa que hemos recibido el evento
  return NextResponse.json({ received: true });
}
