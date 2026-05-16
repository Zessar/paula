"use server";

import { createServerSupabaseClient, assertAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TicketSchema, type TicketInput } from "@/lib/validations/admin";

export async function updateTicketPrice(data: TicketInput) {
  await assertAdmin();
  const result = TicketSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const supabase: any = await createServerSupabaseClient();

  // Si se actualiza el stock, debemos considerar las ventas ya realizadas
  let finalStock = result.data.available_stock;
  if (finalStock !== undefined && finalStock !== null) {
    // 1. Obtener cuántas se han vendido ya de este ticket_id
    const { data: soldData, error: soldError } = await supabase
      .from("order_items")
      .select("quantity")
      .eq("ticket_id", result.data.id);

    if (!soldError && soldData) {
      const totalSold = soldData.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0);
      // El stock disponible real es Capacidad Total - Ya Vendidas
      finalStock = Math.max(0, finalStock - totalSold);
    }
  }

  const { error } = await supabase
    .from("tickets")
    .update({
      name: result.data.name,
      description: result.data.description,
      price: result.data.price,
      management_fees: result.data.management_fees,
      ...(finalStock !== undefined ? { available_stock: finalStock } : {}),
    })
    .eq("id", result.data.id);

  if (error) {
    console.error("Error updating ticket:", error);
    return { success: false, error: "Error al actualizar el precio en la base de datos" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/entradas");
  revalidatePath("/admin/entradas");
  return { success: true };
}

export async function createTicket(data: TicketInput) {
  await assertAdmin();
  const result = TicketSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const supabase: any = await createServerSupabaseClient();

  const { data: newTicket, error } = await supabase
    .from("tickets")
    .insert([{
      name: result.data.name,
      description: result.data.description,
      price: result.data.price,
      management_fees: result.data.management_fees,
      available_stock: result.data.available_stock,
      stripe_price_id: `temp_${Date.now()}` // ID temporal, el checkout usa price_data dinámico
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error: "Error al crear la entrada en la base de datos" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/entradas");
  return { success: true, ticket: newTicket };
}
