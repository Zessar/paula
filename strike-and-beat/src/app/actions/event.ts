"use server";

import { createServerSupabaseClient, assertAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { EventInfoSchema, type EventInfoInput } from "@/lib/validations/admin";

export async function updateEventInfo(data: EventInfoInput) {
  await assertAdmin();
  const result = EventInfoSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const supabase: any = await createServerSupabaseClient();

  // Si no hay ID, intentamos buscar el primero existente para no crear duplicados
  let targetId = result.data.id;
  if (!targetId) {
    const { data: firstEvent } = await supabase
      .from("event_info")
      .select("id")
      .limit(1)
      .single();
    if (firstEvent) targetId = firstEvent.id;
  }

  const { error } = await supabase
    .from("event_info")
    .upsert({
      ...(targetId ? { id: targetId } : {}),
      title: result.data.title,
      event_date: result.data.event_date,
      doors_open_time: result.data.doors_open_time,
      location_name: result.data.location_name,
      location_address: result.data.location_address,
      location_logistics: result.data.location_logistics || null,
      hero_image: result.data.hero_image,
      about_title: result.data.about_title,
      about_text: result.data.about_text,
      about_secondary_text: result.data.about_secondary_text || null,
      about_image: result.data.about_image || null,
      weigh_in_date: result.data.weigh_in_date || null,
      weigh_in_doors: result.data.weigh_in_doors || null,
      weigh_in_time: result.data.weigh_in_time || null,
      weigh_in_is_free: result.data.weigh_in_is_free ?? true,
      weigh_in_title: result.data.weigh_in_title || 'Pesaje Oficial',
      weigh_in_text: result.data.weigh_in_text || null,
      weigh_in_notice: result.data.weigh_in_notice || null,
      info_image: result.data.info_image || null,
      location_logistics_title: result.data.location_logistics_title || 'Logística del recinto',
      total_fights: result.data.total_fights || null,
      total_artists: result.data.total_artists || null,
      total_bars: result.data.total_bars || 0,
      has_bars: result.data.has_bars ?? true,
      break_times: result.data.break_times || null,
      total_breaks: result.data.total_breaks || 0,
      first_fight_time: result.data.first_fight_time || null,
      // Mapeo campos contacto
      contact_title: result.data.contact_title || 'Contacta Con Nosotros',
      contact_subtitle: result.data.contact_subtitle || 'Información De Enlace',
      contact_description: result.data.contact_description || null,
      contact_email: result.data.contact_email || null,
      contact_phone: result.data.contact_phone || null,
      contact_hours: result.data.contact_hours || 'L-V: 10:00 - 18:00',
      contact_association_title: result.data.contact_association_title || 'Caminando Juntos',
      contact_association_text: result.data.contact_association_text || null,
      artists_title: result.data.artists_title || 'Artistas',
      artists_description: result.data.artists_description || null,
      fights_title: result.data.fights_title || 'Combates',
      fights_description: result.data.fights_description || null,
      card_fights_text: result.data.card_fights_text || null,
      card_artists_text: result.data.card_artists_text || null,
      card_bars_text: result.data.card_bars_text || null,
      theme_primary_color: result.data.theme_primary_color || '#cfbdff',
      theme_neon_color: result.data.theme_neon_color || '#facc15',
      marquee_speed: result.data.marquee_speed ?? 50,
      contact_hero_image: result.data.contact_hero_image || null,
      tickets_hero_image: result.data.tickets_hero_image || null,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error updating event info:", error);
    return { success: false, error: "Error al actualizar la información en la base de datos" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
