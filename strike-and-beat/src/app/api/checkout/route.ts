import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CheckoutSchema } from "@/lib/validations/eventos";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validación de Zod
    const parsedData = CheckoutSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Datos de facturación inválidos", details: parsedData.error.issues },
        { status: 400 }
      );
    }

    const { fullName, email, documentId, address, items, phone } = parsedData.data;

    // 2. Obtener precios reales desde Supabase (Seguridad)
    const supabase = await createServerSupabaseClient();
    const { data: dbTickets, error: dbError } = await supabase
      .from("tickets")
      .select("*")
      .in("id", items.map(i => i.ticketId));

    if (dbError || !dbTickets || dbTickets.length === 0) {
      return NextResponse.json({ error: "Error al recuperar las entradas" }, { status: 400 });
    }

    // 3. Buscar o crear el Cliente en Stripe
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    let customerId = existingCustomers.data[0]?.id;

    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        email,
        name: fullName,
        phone: phone || undefined,
        address: {
          line1: address.street,
          city: address.city,
          postal_code: address.zipCode,
          country: "ES", 
        },
        metadata: {
          documentId,
        },
      });
      customerId = newCustomer.id;
    } else {
      await stripe.customers.update(customerId, {
        name: fullName,
        phone: phone || undefined,
        address: {
          line1: address.street,
          city: address.city,
          postal_code: address.zipCode,
          country: "ES",
        },
        metadata: {
          documentId,
        },
      });
    }

    // 4. Preparar los Line Items para la Sesión de Checkout
    const lineItems: any[] = [];
    let managementFeeAdded = false;
    let managementFeeAmount = 2.5; // Default

    // Preparar cartData con precios para el webhook
    const cartDataForWebhook: any[] = [];
    const ticketsArray = (dbTickets || []) as any[];

    items.forEach((item: any) => {
      const dbTicket = ticketsArray.find(t => t.id === item.ticketId);
      if (dbTicket) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: dbTicket.name,
              description: dbTicket.description || `Entrada para el evento`,
              metadata: {
                ticketId: dbTicket.id
              }
            },
            unit_amount: Math.round(Number(dbTicket.price) * 100), // Stripe usa céntimos
          },
          quantity: item.quantity,
        });

        cartDataForWebhook.push({
          id: dbTicket.id,
          q: item.quantity,
          p: Number(dbTicket.price)
        });

        if (!managementFeeAdded) {
          managementFeeAmount = Number(dbTicket.management_fees) || 2.5;
          managementFeeAdded = true;
        }
      }
    });

    // Agregar Gastos de Gestión como un item separado
    if (managementFeeAdded) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Gastos de Gestión",
            description: "Tarifa de servicio",
          },
          unit_amount: Math.round(managementFeeAmount * 100), // céntimos
        },
        quantity: 1,
      });
    }

    // 5. Crear la Sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/entradas?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/entradas`,
      metadata: {
        documentId,
        orderType: "tickets",
        marketingConsent: String(parsedData.data.marketingConsent),
        // Guardamos el carrito en texto para que el webhook sepa exactamente qué compraron
        cartData: JSON.stringify(cartDataForWebhook),
      },
      customer_update: {
        address: "auto",
        name: "auto"
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
