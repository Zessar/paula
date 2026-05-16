"use server";

import { createServerSupabaseClient, assertAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ArtistSchema, type ArtistInput } from "@/lib/validations/admin";

export async function createArtist(data: ArtistInput) {
  await assertAdmin();
  const result = ArtistSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Datos inválidos" };
  }

  const supabase: any = await createServerSupabaseClient();
  const slug = result.data.slug || result.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { error } = await supabase.from("artists").upsert({
    ...(result.data.id ? { id: result.data.id } : {}),
    name: result.data.name,
    genre: result.data.genre,
    image: result.data.image || null,
    profile_link: `/artistas/${slug}`,
    instagram_url: result.data.instagram_url || null,
    spotify_url: result.data.spotify_url || null,
    spotify_embed_url: result.data.spotify_embed_url || null,
    youtube_url: result.data.youtube_url || null,
    subtitle: result.data.subtitle || null,
    description: result.data.description || null,
    video_url: result.data.video_url || null,
    hero_image: result.data.hero_image || null,
    slug: slug,
    sort_order: result.data.sort_order,
  });

  if (error) {
    console.error("Error creating artist:", error);
    return { success: false, error: "Error al crear el artista" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateArtist(data: ArtistInput) {
  await assertAdmin();
  const result = ArtistSchema.safeParse(data);
  if (!result.success || !result.data.id) {
    return { success: false, error: "Datos inválidos" };
  }

  const supabase: any = await createServerSupabaseClient();
  const slug = result.data.slug || result.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { error } = await supabase
    .from("artists")
    .upsert({
      id: result.data.id,
      name: result.data.name,
      genre: result.data.genre,
      image: result.data.image || null,
      profile_link: `/artistas/${slug}`,
      instagram_url: result.data.instagram_url || null,
      spotify_url: result.data.spotify_url || null,
      spotify_embed_url: result.data.spotify_embed_url || null,
      youtube_url: result.data.youtube_url || null,
      subtitle: result.data.subtitle || null,
      description: result.data.description || null,
      video_url: result.data.video_url || null,
      hero_image: result.data.hero_image || null,
      slug: slug,
      sort_order: result.data.sort_order,
    });

  if (error) {
    console.error("Error updating artist:", error);
    return { success: false, error: "Error al actualizar el artista" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteArtist(id: string) {
  await assertAdmin();
  const supabase: any = await createServerSupabaseClient();

  const { error } = await supabase.from("artists").delete().eq("id", id);

  if (error) {
    console.error("Error deleting artist:", error);
    return { success: false, error: "Error al eliminar el artista" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
