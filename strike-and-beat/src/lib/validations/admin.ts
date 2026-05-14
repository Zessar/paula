import { z } from "zod";

export const FighterSchema = z.object({
  id: z.string().optional(),
  name_a: z.string().min(1, "El nombre del primer luchador es obligatorio"),
  image_a: z.string().optional().nullable(),
  alias_a: z.string().optional(),
  name_b: z.string().min(1, "El nombre del segundo luchador es obligatorio"),
  image_b: z.string().optional().nullable(),
  alias_b: z.string().optional(),
  category: z.string().min(1, "La categoría / peso es obligatoria"),
  rounds: z.string().min(1, "El número de rondas es obligatorio"),
  rules: z.string().min(1, "Las reglas son obligatorias"),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
  description_a: z.string().optional().nullable(),
  description_b: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
});

export type FighterInput = z.infer<typeof FighterSchema>;

export const ArtistSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  genre: z.string().min(1, "El género musical es obligatorio"),
  image: z.string().optional().nullable(),
  profile_link: z.string().optional().nullable(),
  instagram_url: z.string().optional().nullable(),
  spotify_url: z.string().optional().nullable(),
  youtube_url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  hero_image: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().default(0),
});

export type ArtistInput = z.infer<typeof ArtistSchema>;

export const EventInfoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es obligatorio"),
  event_date: z.string().min(1, "La fecha es obligatoria"),
  doors_open_time: z.string().min(1, "La hora es obligatoria"),
  location_name: z.string().min(1, "El nombre de la ubicación es obligatorio"),
  location_address: z.string().min(1, "La dirección de la ubicación es obligatoria"),
  location_logistics: z.string().optional(),
  hero_image: z.string().optional().nullable(),
  about_title: z.string().min(1, "El título de 'Acerca de' es obligatorio"),
  about_text: z.string().min(1, "El texto de 'Acerca de' es obligatorio"),
  about_secondary_text: z.string().optional(),
  about_image: z.string().optional().nullable(),
  weigh_in_date: z.string().optional(),
  weigh_in_doors: z.string().optional(),
  weigh_in_time: z.string().optional(),
  weigh_in_is_free: z.boolean().default(true),
  weigh_in_title: z.string().optional(),
  weigh_in_text: z.string().optional(),
  weigh_in_notice: z.string().optional(),
  info_image: z.string().optional().nullable(),
  location_logistics_title: z.string().optional(),
  total_fights: z.coerce.number().int().nonnegative().optional(),
  total_artists: z.coerce.number().int().nonnegative().optional(),
  total_bars: z.coerce.number().int().nonnegative().optional(),
  has_bars: z.boolean().default(true),
  break_times: z.string().optional(),
  first_fight_time: z.string().optional(),
  // Campos de Contacto
  contact_title: z.string().optional(),
  contact_subtitle: z.string().optional(),
  contact_description: z.string().optional(),
  contact_email: z.string().email("Email inválido").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  contact_hours: z.string().optional(),
  contact_association_title: z.string().optional(),
  contact_association_text: z.string().optional(),
});

export type EventInfoInput = z.infer<typeof EventInfoSchema>;

export const TicketSchema = z.object({
  id: z.string(),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  management_fees: z.coerce.number().nonnegative("Los gastos no pueden ser negativos"),
  available_stock: z.coerce.number().int().nonnegative("El stock no puede ser negativo").optional(),
});

export type TicketInput = z.infer<typeof TicketSchema>;

export const SponsorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  logo_url: z.string().optional().nullable(),
  opacity: z.coerce.number().int().min(0).max(100).default(100),
  sort_order: z.coerce.number().int().default(0),
});

export type SponsorInput = z.infer<typeof SponsorSchema>;
