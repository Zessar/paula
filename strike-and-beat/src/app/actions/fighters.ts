"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { FighterSchema, type FighterInput } from "@/lib/validations/admin";

export async function createFighter(data: FighterInput) {
  const result = FighterSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Datos inválidos" };
  }

  const supabase: any = await createServerSupabaseClient();
  const slug = result.data.slug || `${result.data.name_a}-vs-${result.data.name_b}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { error } = await supabase.from("fights").upsert({
    ...(result.data.id ? { id: result.data.id } : {}),
    name_a: result.data.name_a,
    image_a: result.data.image_a || null,
    alias_a: result.data.alias_a || null,
    name_b: result.data.name_b,
    image_b: result.data.image_b || null,
    alias_b: result.data.alias_b || null,
    category: result.data.category,
    rounds: result.data.rounds,
    rules: result.data.rules,
    is_featured: result.data.is_featured,
    sort_order: result.data.sort_order,
    description_a: result.data.description_a || null,
    description_b: result.data.description_b || null,
    video_url: result.data.video_url || null,
    slug: slug,
  });

  if (error) {
    console.error("Error creating fighter:", error);
    return { success: false, error: "Error al crear el combate" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateFighter(data: FighterInput) {
  const result = FighterSchema.safeParse(data);
  if (!result.success || !result.data.id) {
    return { success: false, error: "Datos inválidos" };
  }

  const supabase: any = await createServerSupabaseClient();
  const slug = result.data.slug || `${result.data.name_a}-vs-${result.data.name_b}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { error } = await supabase
    .from("fights")
    .upsert({
      id: result.data.id,
      name_a: result.data.name_a,
      image_a: result.data.image_a || null,
      alias_a: result.data.alias_a || null,
      name_b: result.data.name_b,
      image_b: result.data.image_b || null,
      alias_b: result.data.alias_b || null,
      category: result.data.category,
      rounds: result.data.rounds,
      rules: result.data.rules,
      is_featured: result.data.is_featured,
      sort_order: result.data.sort_order,
      description_a: result.data.description_a || null,
      description_b: result.data.description_b || null,
      video_url: result.data.video_url || null,
      slug: slug,
    });

  if (error) {
    console.error("Error updating fighter:", error);
    return { success: false, error: "Error al actualizar el combate" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteFighter(id: string) {
  const supabase: any = await createServerSupabaseClient();

  const { error } = await supabase.from("fights").delete().eq("id", id);

  if (error) {
    console.error("Error deleting fighter:", error);
    return { success: false, error: "Error al eliminar el combate" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
