"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TicketSchema, type TicketInput } from "@/lib/validations/admin";

export async function updateTicketPrice(data: TicketInput) {
  const result = TicketSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const supabase: any = await createServerSupabaseClient();

  const { error } = await supabase
    .from("tickets")
    .update({
      price: result.data.price,
      management_fees: result.data.management_fees,
      ...(result.data.available_stock !== undefined ? { available_stock: result.data.available_stock } : {}),
    })
    .eq("id", result.data.id);

  if (error) {
    console.error("Error updating ticket:", error);
    return { success: false, error: "Error al actualizar el precio en la base de datos" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/entradas");
  return { success: true };
}
