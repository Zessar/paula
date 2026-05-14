import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CheckoutSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validación de Zod
    const parsedData = CheckoutSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Datos de facturación inválidos", details: parsedData.error.issues },
        { status: 400 }
      );
    }

    const { fullName, email, documentId, address, items } = parsedData.data;

    // 1. Buscar o crear el Cliente en Stripe
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    let customerId = existingCustomers.data[0]?.id;

    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        email,
        name: fullName,
        address: {
          line1: address.street,
          city: address.city,
          postal_code: address.zipCode,
          country: "ES", // Podría derivarse de address.country pero forzamos ISO code
        },
        metadata: {
          documentId, // Guardamos el DNI/NIF/NIE en metadata
        },
      });
      customerId = newCustomer.id;
    } else {
      // Actualizamos los datos del cliente si ya existe
      await stripe.customers.update(customerId, {
        name: fullName,
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

    // 2. Preparar los Line Items para la Sesión de Checkout
    const lineItems = items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    // 3. Crear la Sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        // Guardar metadata de la orden
        documentId,
        orderType: "tickets",
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
