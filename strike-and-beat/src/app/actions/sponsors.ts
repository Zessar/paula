"use server";

import { randomUUID } from "node:crypto";
import { createServerSupabaseClient, assertAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SponsorSchema, type SponsorInput } from "@/lib/validations/admin";

export async function getSponsors() {
  const supabase = (await createServerSupabaseClient()) as any;
  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching sponsors:", error);
    return [];
  }

  return data;
}

export async function saveSponsor(data: SponsorInput) {
  await assertAdmin();
  const supabase = (await createServerSupabaseClient()) as any;
  
  const result = SponsorSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const sponsorData = {
    name: result.data.name,
    logo_url: result.data.logo_url,
    opacity: result.data.opacity ?? 100,
    sort_order: result.data.sort_order ?? 0,
  };

  let queryResult;
  const table = supabase.from("sponsors");

  if (result.data.id) {
    // Update
    queryResult = await table
      .update(sponsorData)
      .eq("id", result.data.id);
  } else {
    // Create
    queryResult = await table
      .insert({
        ...sponsorData,
        id: randomUUID()
      });
  }

  if (queryResult.error) {
    return { success: false, error: queryResult.error.message };
  }

  revalidatePath("/admin/patrocinadores");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSponsor(id: string) {
  await assertAdmin();
  const supabase = (await createServerSupabaseClient()) as any;
  const { error } = await supabase.from("sponsors").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/patrocinadores");
  revalidatePath("/");
  return { success: true };
}
