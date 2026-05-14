import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Falta la firma de Stripe" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Error verificando Webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejar los eventos
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Pago completado para la sesion:", session.id);
      
      // 1. Obtener los line_items detallados de Stripe
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      
      // 2. Preparar el cliente de Supabase (usamos el admin o el server client)
      // Nota: Idealmente usar una Service Role Key si RLS es estricto, 
      // pero segun el master-script, RLS permite escritura publica temporalmente.
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // 3. Insertar la Orden en Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: session.customer_details?.name || "Cliente Desconocido",
          customer_email: session.customer_details?.email || "",
          customer_dni: session.metadata?.documentId || "S/D",
          stripe_session_id: session.id,
          total_amount: (session.amount_total || 0) / 100, // Stripe usa centimos
          status: "completado"
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error al crear la orden en Supabase:", orderError);
        return NextResponse.json({ error: "Error interno al registrar la orden" }, { status: 500 });
      }

      // 4. Registrar los items y actualizar stock
      for (const item of lineItems.data) {
        // Buscamos el ticket por su stripe_price_id
        const { data: ticket } = await supabase
          .from("tickets")
          .select("id, available_stock")
          .eq("stripe_price_id", item.price?.id)
          .single();

        if (ticket) {
          // Insertar en order_items
          await supabase.from("order_items").insert({
            order_id: order.id,
            ticket_id: ticket.id,
            quantity: item.quantity || 1,
            price_at_purchase: (item.price?.unit_amount || 0) / 100
          });

          // Restar stock
          if (ticket.available_stock !== null) {
            const newStock = Math.max(0, ticket.available_stock - (item.quantity || 1));
            await supabase
              .from("tickets")
              .update({ available_stock: newStock })
              .eq("id", ticket.id);
          }
        }
      }
      
      break;
    }
    
    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
