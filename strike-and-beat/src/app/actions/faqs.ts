"use server";

import { createServerSupabaseClient, assertAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { FAQSchema, type FAQInput } from "@/lib/validations/faq";

export async function createFAQ(data: FAQInput) {
  await assertAdmin();
  const result = FAQSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const supabase: any = await createServerSupabaseClient();

  const { error } = await supabase
    .from("faqs")
    .insert([{
      question: result.data.question,
      answer: result.data.answer,
      sort_order: result.data.sort_order,
    }]);

  if (error) {
    console.error("Error creating FAQ:", error);
    return { success: false, error: "Error al crear la pregunta frecuente" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/faq");
  return { success: true };
}

export async function updateFAQ(data: FAQInput) {
  await assertAdmin();
  if (!data.id) return { success: false, error: "ID requerido" };

  const result = FAQSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const supabase: any = await createServerSupabaseClient();

  const { error } = await supabase
    .from("faqs")
    .update({
      question: result.data.question,
      answer: result.data.answer,
      sort_order: result.data.sort_order,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating FAQ:", error);
    return { success: false, error: "Error al actualizar la pregunta frecuente" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/faq");
  return { success: true };
}

export async function deleteFAQ(id: string) {
  await assertAdmin();
  const supabase: any = await createServerSupabaseClient();

  const { error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting FAQ:", error);
    return { success: false, error: "Error al eliminar la pregunta frecuente" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/faq");
  return { success: true };
}
