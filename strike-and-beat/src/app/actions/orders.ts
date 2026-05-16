"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Actualiza el consentimiento de marketing de un pedido
 */
export async function updateOrderMarketingConsent(orderId: string, consent: boolean) {
  try {
    const supabase: any = await createServerSupabaseClient();
    
    const { error } = await supabase
      .from("orders")
      .update({ marketing_consent: consent })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating marketing consent:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/ventas");
    return { success: true };
  } catch (error: any) {
    console.error("Error in updateOrderMarketingConsent:", error);
    return { success: false, error: error.message };
  }
}
