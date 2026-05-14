import { z } from 'zod';

export const CheckoutSchema = z.object({
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
    ticketId: z.string(), // ID local del ticket
    priceId: z.string(),  // Stripe price_id
    quantity: z.number().min(1).max(10, "Máximo 10 entradas por compra")
  })).min(1, "Debes seleccionar al menos una entrada")
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
