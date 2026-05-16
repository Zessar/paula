"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function loginWithOTP(email: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, 
    },
  });

  if (error) {
    console.error("Error OTP:", error.message);
    return { success: false, error: "No se pudo enviar el código. Verifica que el email sea correcto." };
  }

  return { success: true };
}

export async function verifyOTP(email: string, token: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    console.error("Error verify OTP:", error.message);
    return { success: false, error: "Código incorrecto o caducado. Inténtalo de nuevo." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
