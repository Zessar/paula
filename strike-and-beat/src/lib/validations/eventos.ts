import { z } from "zod";

// A. Esquema de Checkout (Compra de Entradas)
export const CheckoutSchema = z.object({
  fullName: z.string().min(3, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  documentId: z.string().min(8, "DNI/NIF/NIE obligatorio para facturación"),
  address: z.object({
    street: z.string().min(5, "Dirección requerida"),
    city: z.string().min(2, "Ciudad requerida"),
    zipCode: z.string().min(4, "Código postal requerido"),
    country: z.string()
  }),
  phone: z.string().default(""),
  marketingConsent: z.boolean().default(false),
  acceptTerms: z.boolean().refine(val => val === true, "Debes aceptar los Términos de Uso y la Política de Privacidad"),
  items: z.array(z.object({
    ticketId: z.string(),
    priceId: z.string().optional(), // ID de precio de Stripe
    quantity: z.number().min(1).max(10, "Máximo 10 entradas por compra")
  })).min(1, "Debes seleccionar al menos una entrada")
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

// B. Esquemas de Administración (Admin Panel)

export const TicketSchema = z.object({
  name: z.string().min(2, "El nombre de la entrada es obligatorio"),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser un número positivo"),
  totalStock: z.number().int().nonnegative("El stock no puede ser negativo"),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
});

export type TicketInput = z.infer<typeof TicketSchema>;

export const FighterArtistSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  type: z.enum(["boxer", "artist"], {
    error: "El tipo debe ser boxer o artist"
  }),
  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  socialLinks: z.object({
    instagram: z.string().url("URL inválida").optional().or(z.literal("")),
    twitter: z.string().url("URL inválida").optional().or(z.literal("")),
    tiktok: z.string().url("URL inválida").optional().or(z.literal(""))
  }).optional(),
});

export type FighterArtistInput = z.infer<typeof FighterArtistSchema>;

export const SponsorSchema = z.object({
  name: z.string().min(2, "El nombre del patrocinador es obligatorio"),
  logoUrl: z.string().url("Debe ser una URL válida"),
  websiteUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  tier: z.enum(["gold", "silver", "bronze"]).default("bronze"),
});

export type SponsorInput = z.infer<typeof SponsorSchema>;

export const EventInfoSchema = z.object({
  title: z.string().min(5, "El título es obligatorio"),
  description: z.string().min(10, "La descripción es obligatoria"),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Debe ser una fecha válida"
  }),
  doorsOpenTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora HH:MM"),
  locationName: z.string().min(2, "Nombre de la ubicación requerido"),
  locationAddress: z.string().min(5, "Dirección requerida"),
});

export type EventInfoInput = z.infer<typeof EventInfoSchema>;
