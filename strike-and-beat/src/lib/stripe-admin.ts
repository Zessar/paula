import { stripe } from "./stripe";

/**
 * Crea o actualiza un producto en Stripe y asocia un precio.
 * Como en Stripe los precios no se pueden modificar, si el precio cambia,
 * se crea un nuevo precio y el anterior se puede archivar o dejar inactivo.
 * 
 * @param name Nombre del ticket (ej. "Entrada Pista")
 * @param description Descripción opcional
 * @param priceAmount Monto en euros (ej. 50.00)
 * @param existingProductId ID del producto de Stripe si ya existe en BDD
 * @returns { productId, priceId } Los IDs para guardar en la base de datos
 */
export async function syncTicketWithStripe(
  name: string,
  priceAmount: number,
  existingProductId?: string,
  description?: string
) {
  let productId = existingProductId;

  // 1. Crear o actualizar el Producto
  if (!productId) {
    const product = await stripe.products.create({
      name,
      description,
      metadata: {
        type: "ticket",
      },
    });
    productId = product.id;
  } else {
    // Si existe, actualizamos su nombre/descripción por si cambió en el Admin
    await stripe.products.update(productId, {
      name,
      description,
    });
  }

  // 2. Crear el nuevo Precio
  // Stripe trabaja en la moneda menor (céntimos), así que multiplicamos por 100
  const unitAmount = Math.round(priceAmount * 100);

  const newPrice = await stripe.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency: "eur",
  });

  return {
    productId,
    priceId: newPrice.id,
  };
}

/**
 * Desactiva un precio antiguo cuando el precio cambia
 * @param priceId El ID del precio a desactivar
 */
export async function deactivateStripePrice(priceId: string) {
  await stripe.prices.update(priceId, {
    active: false,
  });
}
