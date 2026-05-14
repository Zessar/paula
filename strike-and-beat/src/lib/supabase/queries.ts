/**
 * Queries de Supabase para Strike & Beat
 * Capa de acceso a datos que reemplaza las importaciones directas de mockData.
 * Incluye fallback a mockData si la conexion falla.
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  eventData as mockEventData,
  fighters as mockFighters,
  artists as mockArtists,
  tickets as mockTickets,
  sponsors as mockSponsors,
  faqs as mockFaqs,
  type EventInfo,
  type Fighter,
  type Artist,
  type Ticket,
  type Sponsor,
  type FAQ,
} from "@/lib/mockData";

/* ------------------------------------------------------------------ */
/*  EVENT INFO                                                         */
/* ------------------------------------------------------------------ */

export async function getEventInfo(): Promise<EventInfo> {
  try {
    const supabase: any = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("event_info")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      console.warn("[Supabase] Fallback a mockData para event_info:", error?.message);
      return mockEventData;
    }

    return {
      title: data.title,
      date: data.event_date,
      locationName: data.location_name,
      locationAddress: data.location_address,
      locationLogistics: data.location_logistics,
      heroImage: data.hero_image || mockEventData.heroImage,
      aboutTitle: data.about_title || mockEventData.aboutTitle,
      aboutText: data.about_text || mockEventData.aboutText,
      aboutSecondaryText: data.about_secondary_text || mockEventData.aboutSecondaryText,
      aboutImage: data.about_image || mockEventData.aboutImage,
      doorsOpen: data.doors_open_time,
      weighInDate: data.weigh_in_date,
      weighInDoors: data.weigh_in_doors,
      weighInTime: data.weigh_in_time,
      weighInIsFree: data.weigh_in_is_free,
      totalFights: data.total_fights,
      totalArtists: data.total_artists,
      totalBars: data.total_bars,
      hasBars: data.has_bars,
      breakTimes: data.break_times,
      firstFightTime: data.first_fight_time,
      infoImage: data.info_image || mockEventData.infoImage || "",
      locationLogisticsTitle: data.location_logistics_title || "Logística del recinto",
      weighInTitle: data.weigh_in_title || "El Pesaje",
      weighInText: data.weigh_in_text || "Sé testigo del primer enfrentamiento. Los atletas se enfrentan a la báscula antes de la jaula. Acceso completo a prensa. Incluye sesión de meet & greet con fans.",
      weighInNotice: data.weigh_in_notice || "No se permite la entrada de comida o bebida externa. Controles de seguridad en la entrada. Una vez fuera, no se permite volver a entrar sin una nueva entrada. Advertencia de volumen industrial.",
      // Mapeo campos contacto
      contactTitle: data.contact_title || "Contacta Con Nosotros",
      contactSubtitle: data.contact_subtitle || "Información De Enlace",
      contactDescription: data.contact_description,
      contactEmail: data.contact_email,
      contactPhone: data.contact_phone,
      contactHours: data.contact_hours || "L-V: 10:00 - 18:00",
      contactAssociationTitle: data.contact_association_title || "Caminando Juntos",
      contactAssociationText: data.contact_association_text,
    };
  } catch (err) {
    console.warn("[Supabase] Error de conexion, fallback a mockData:", err);
    return mockEventData;
  }
}

/* ------------------------------------------------------------------ */
/*  FIGHTS (COMBATES)                                                  */
/* ------------------------------------------------------------------ */

export async function getFights(): Promise<Fighter[]> {
  try {
    const supabase: any = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("fights")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("[Supabase] Fallback a mockData para fights:", error?.message);
      return mockFighters;
    }

    return data.map((f: any) => ({
      id: f.id,
      nameA: f.name_a,
      imageA: f.image_a || "",
      aliasA: f.alias_a || "",
      nameB: f.name_b,
      imageB: f.image_b || "",
      aliasB: f.alias_b || "",
      category: f.category,
      rounds: f.rounds,
      rules: f.rules,
      isFeatured: f.is_featured,
      descriptionA: f.description_a || "",
      descriptionB: f.description_b || "",
      videoUrl: f.video_url || "",
      slug: f.slug || "",
    }));
  } catch (err) {
    console.warn("[Supabase] Error de conexion, fallback a mockData:", err);
    return mockFighters;
  }
}

export async function getFightBySlug(slug: string): Promise<Fighter | null> {
  try {
    const supabase: any = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("fights")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      nameA: data.name_a,
      imageA: data.image_a || "",
      aliasA: data.alias_a || "",
      nameB: data.name_b,
      imageB: data.image_b || "",
      aliasB: data.alias_b || "",
      category: data.category,
      rounds: data.rounds,
      rules: data.rules,
      isFeatured: data.is_featured,
      descriptionA: data.description_a || "",
      descriptionB: data.description_b || "",
      videoUrl: data.video_url || "",
      slug: data.slug || "",
    };
  } catch (err) {
    console.warn("[Supabase] Error fetching fight by slug:", err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  ARTISTS                                                            */
/* ------------------------------------------------------------------ */

export async function getArtists(): Promise<Artist[]> {
  try {
    const supabase: any = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("[Supabase] Fallback a mockData para artists:", error?.message);
      return mockArtists;
    }

    return data.map((a: any) => ({
      id: a.id,
      name: a.name,
      genre: a.genre,
      image: a.image || "",
      profileLink: a.slug ? `/artistas/${a.slug}` : (a.profile_link || "/artistas"),
      instagramUrl: a.instagram_url,
      spotifyUrl: a.spotify_url,
      youtubeUrl: a.youtube_url,
      description: a.description || "",
      videoUrl: a.video_url || "",
      heroImage: a.hero_image || "",
      slug: a.slug || "",
    }));
  } catch (err) {
    console.warn("[Supabase] Error de conexion, fallback a mockData:", err);
    return mockArtists;
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    const supabase: any = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      genre: data.genre,
      image: data.image || "",
      profileLink: data.slug ? `/artistas/${data.slug}` : (data.profile_link || "/artistas"),
      instagramUrl: data.instagram_url,
      spotifyUrl: data.spotify_url,
      youtubeUrl: data.youtube_url,
      description: data.description || "",
      videoUrl: data.video_url || "",
      heroImage: data.hero_image || "",
      slug: data.slug || "",
    };
  } catch (err) {
    console.warn("[Supabase] Error fetching artist by slug:", err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  TICKETS                                                            */
/* ------------------------------------------------------------------ */

export async function getTickets(): Promise<Ticket[]> {
  try {
    const supabase: any = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("price", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("[Supabase] Fallback a mockData para tickets:", error?.message);
      return mockTickets;
    }

    return data.map((t: any) => ({
      id: t.id,
      priceId: t.stripe_price_id || "price_placeholder",
      name: t.name,
      description: t.description || "",
      price: Number(t.price),
      stock: t.available_stock > 0 ? t.available_stock : null,
      managementFees: Number(t.management_fees),
    }));
  } catch (err) {
    console.warn("[Supabase] Error de conexion, fallback a mockData:", err);
    return mockTickets;
  }
}

/* ------------------------------------------------------------------ */
/*  SPONSORS                                                           */
/* ------------------------------------------------------------------ */

export async function getSponsors(): Promise<Sponsor[]> {
  try {
    const supabase: any = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("[Supabase] Fallback a mockData para sponsors:", error?.message);
      return mockSponsors;
    }

    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
      logo: s.logo_url || "",
      opacity: s.opacity ?? 100,
    }));
  } catch (err) {
    console.warn("[Supabase] Error de conexion, fallback a mockData:", err);
    return mockSponsors;
  }
}

/* ------------------------------------------------------------------ */
/*  FAQS                                                               */
/* ------------------------------------------------------------------ */

export async function getFaqs(): Promise<FAQ[]> {
  try {
    const supabase: any = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("[Supabase] Fallback a mockData para faqs:", error?.message);
      return mockFaqs;
    }

    return data.map((f: any) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));
  } catch (err) {
    console.warn("[Supabase] Error de conexion, fallback a mockData:", err);
    return mockFaqs;
  }
}
export async function getOrders(limit = 10) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        tickets (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data.map((o: any) => ({
    id: o.id,
    name: o.customer_name,
    email: o.customer_email,
    total: o.total_amount,
    status: o.status,
    date: new Date(o.created_at).toLocaleDateString("es-ES"),
    tickets: o.order_items?.map((item: any) => 
      `${item.quantity}x ${item.tickets?.name || "Entrada"}`
    ).join(", ") || "Sin detalles",
  }));
}

export async function getSalesStats() {
  const supabase: any = await createServerSupabaseClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("total_amount, status, order_items(quantity)");

  if (error) {
    console.error("Error fetching sales stats:", error);
    return {
      totalRevenue: 0,
      totalTicketsSold: 0,
      averageOrderValue: 0,
      conversionRate: 0
    };
  }

  const completedOrders = orders.filter((o: any) => o.status === "completado" || o.status === "paid" || o.status === "pending");
  
  const totalRevenue = completedOrders.reduce((acc: number, curr: any) => acc + Number(curr.total_amount || 0), 0);
  const totalTicketsSold = completedOrders.reduce((acc: number, curr: any) => {
    const itemsCount = curr.order_items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
    return acc + itemsCount;
  }, 0);

  const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  return {
    totalRevenue,
    totalTicketsSold,
    averageOrderValue,
    conversionRate: 0
  };
}
