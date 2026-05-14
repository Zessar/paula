"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  eventData,
  fighters,
  artists,
  tickets,
  sponsors,
  faqs,
} from "@/lib/mockData";

export async function seedDatabase() {
  const supabase: any = await createServerSupabaseClient();
  const results = {
    success: true,
    message: "Proceso de seeding completado",
    details: {} as any,
  };

  try {
    // 1. Insertar Event Info
    const { error: eventError } = await supabase.from("event_info").insert([{
      title: eventData.title,
      description: "Información base del evento",
      event_date: eventData.date,
      doors_open_time: eventData.doorsOpen,
      location_name: eventData.locationName,
      location_address: eventData.locationAddress,
      hero_image: eventData.heroImage,
      about_title: eventData.aboutTitle,
      about_text: eventData.aboutText,
      about_secondary_text: eventData.aboutSecondaryText,
      about_image: eventData.aboutImage,
    } as any]);
    results.details.event = eventError ? eventError.message : "OK";

    // Obtener el ID del evento (asumiendo que solo hay uno)
    const { data: eventResult } = await supabase
      .from("event_info")
      .select("id")
      .limit(1)
      .single();
      
    const eventId = eventResult?.id;

    // 2. Insertar Tickets
    if (eventId) {
      const ticketsToInsert = tickets.map((t) => ({
        event_id: eventId,
        name: t.name,
        description: t.description,
        price: t.price,
        available_stock: t.stock || 1000, // Por defecto 1000 si es null
        management_fees: t.managementFees,
        stripe_price_id: t.priceId,
      }));
      const { error: ticketsError } = await supabase
        .from("tickets")
        .insert(ticketsToInsert);
      results.details.tickets = ticketsError ? ticketsError.message : "OK";

      // 3. Insertar Fights
      const fightsToInsert = fighters.map((f, i) => ({
        event_id: eventId,
        name_a: f.nameA,
        image_a: f.imageA,
        alias_a: f.aliasA,
        name_b: f.nameB,
        image_b: f.imageB,
        alias_b: f.aliasB,
        category: f.category,
        rounds: f.rounds,
        rules: f.rules,
        is_featured: f.isFeatured,
        sort_order: i,
      }));
      const { error: fightsError } = await supabase
        .from("fights")
        .insert(fightsToInsert);
      results.details.fights = fightsError ? fightsError.message : "OK";

      // 4. Insertar Artists
      const artistsToInsert = artists.map((a, i) => ({
        event_id: eventId,
        name: a.name,
        genre: a.genre,
        image: a.image,
        profile_link: a.profileLink,
        sort_order: i,
      }));
      const { error: artistsError } = await supabase
        .from("artists")
        .insert(artistsToInsert);
      results.details.artists = artistsError ? artistsError.message : "OK";

      // 5. Insertar Sponsors
      const sponsorsToInsert = sponsors.map((s, i) => ({
        event_id: eventId,
        name: s.name,
        opacity: s.opacity,
        sort_order: i,
      }));
      const { error: sponsorsError } = await supabase
        .from("sponsors")
        .insert(sponsorsToInsert);
      results.details.sponsors = sponsorsError ? sponsorsError.message : "OK";

      // 6. Insertar FAQs
      const faqsToInsert = faqs.map((f, i) => ({
        event_id: eventId,
        question: f.question,
        answer: f.answer,
        sort_order: i,
      }));
      const { error: faqsError } = await supabase
        .from("faqs")
        .insert(faqsToInsert);
      results.details.faqs = faqsError ? faqsError.message : "OK";
    }

    return results;
  } catch (error: any) {
    console.error("Error en el seeding:", error);
    return {
      success: false,
      message: "Fallo crítico en el seeding",
      details: error.message,
    };
  }
}
