"use server";

import { createServerSupabaseClient, assertAdmin } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { generateQRCode, generateQRDataURL } from "@/lib/qr";

// Cliente admin para operaciones que requieren saltarse RLS
function getAdminSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {}
      }
    }
  );
}

/* ------------------------------------------------------------------ */
/*  TICKET ENTRIES (Entradas QR)                                       */
/* ------------------------------------------------------------------ */

/**
 * Obtener todas las entradas QR (para el panel de admin).
 */
export async function getTicketEntries(limit = 100) {
  await assertAdmin();
  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("ticket_entries")
    .select(`
      *,
      tickets ( name, price )
    `)
    .order("entry_number", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching ticket entries:", error);
    return [];
  }

  return (data || []).map((entry: any) => ({
    id: entry.id,
    orderId: entry.order_id,
    ticketId: entry.ticket_id,
    qrCode: entry.qr_code,
    entryNumber: entry.entry_number || 0,
    customerName: entry.customer_name || "Sin nombre",
    customerEmail: entry.customer_email || "Sin email",
    status: entry.status || "valid",
    isVip: entry.is_vip || false,
    ticketPrice: entry.ticket_price || entry.tickets?.price || 0,
    usedAt: entry.used_at,
    createdAt: entry.created_at,
    ticketName: entry.tickets?.name || "Entrada",
  }));
}

/**
 * Crear entradas QR manualmente desde el admin (para sponsors, cortesías, etc.).
 */
export async function createManualTicketEntries(data: {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  isVip: boolean;
}) {
  await assertAdmin();
  const supabase = getAdminSupabase();

  // Obtener el precio del tipo de entrada seleccionado
  const { data: ticketData } = await supabase
    .from("tickets")
    .select("price")
    .eq("id", data.ticketId)
    .single();

  const ticketPrice = data.isVip ? 0 : (ticketData?.price || 0);

  const entries = [];
  for (let i = 0; i < data.quantity; i++) {
    entries.push({
      ticket_id: data.ticketId,
      qr_code: generateQRCode(),
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      status: "valid",
      order_id: null,
      is_vip: data.isVip,
      ticket_price: ticketPrice,
    });
  }

  const { data: inserted, error } = await supabase
    .from("ticket_entries")
    .insert(entries)
    .select();

  if (error) {
    console.error("Error creating manual entries:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/entradas-qr");
  return { success: true, count: inserted?.length || 0 };
}

/**
 * Generar la imagen QR (Data URL base64) de una entrada.
 */
export async function getQRImageDataURL(qrCode: string): Promise<string> {
  return generateQRDataURL(qrCode);
}

/**
 * Cancelar una entrada QR (la invalida para que no pueda usarse).
 */
export async function cancelTicketEntry(entryId: string) {
  await assertAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase
    .from("ticket_entries")
    .update({ status: "cancelled" })
    .eq("id", entryId);

  if (error) {
    console.error("Error cancelling entry:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/entradas-qr");
  return { success: true };
}

/**
 * Reactivar una entrada QR cancelada.
 */
export async function reactivateTicketEntry(entryId: string) {
  await assertAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase
    .from("ticket_entries")
    .update({ status: "valid" })
    .eq("id", entryId);

  if (error) {
    console.error("Error reactivating entry:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/entradas-qr");
  return { success: true };
}

/* ------------------------------------------------------------------ */
/*  VALIDACIÓN QR (Para el escáner de la puerta)                       */
/* ------------------------------------------------------------------ */

/**
 * Validar un código QR escaneado en la puerta.
 * - Si es válido y no se ha usado: lo marca como "used" y devuelve OK.
 * - Si ya se usó: devuelve error de duplicado.
 * - Si no existe: devuelve error de inválido.
 */
export async function validateQRCode(qrCode: string) {
  const supabase = getAdminSupabase();

  // Limpiar código manual (por si viene con guiones o espacios)
  // El usuario puede que ponga el prefijo o no, quitamos todo lo no alfanumérico
  let cleanCode = qrCode.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  
  // Si el usuario por si acaso escribió sbtkt..., lo quitamos para quedarnos con el UUID
  if (cleanCode.startsWith("sbtkt")) {
    cleanCode = cleanCode.replace("sbtkt", "");
  }

  let query = supabase
    .from("ticket_entries")
    .select(`
      *,
      tickets ( name )
    `);

  // 1. Buscar la entrada (por hash completo o código manual de 8 caracteres)
  if (cleanCode.length >= 8 && cleanCode.length < 20) {
    query = query.like("qr_code", `SB_TKT_${cleanCode}%`);
  } else {
    query = query.eq("qr_code", qrCode);
  }

  const { data: entry, error } = await query.single();

  if (error || !entry) {
    return {
      valid: false,
      status: "not_found",
      message: "ENTRADA NO ENCONTRADA. Código QR inválido.",
    };
  }

  // 2. Comprobar si ya se ha usado
  if (entry.status === "used") {
    return {
      valid: false,
      status: "already_used",
      message: `ENTRADA YA USADA el ${new Date(entry.used_at).toLocaleString("es-ES")}`,
      customerName: entry.customer_name,
      ticketName: (entry as any).tickets?.name || "Entrada",
    };
  }

  // 3. Comprobar si está cancelada
  if (entry.status === "cancelled") {
    return {
      valid: false,
      status: "cancelled",
      message: "ENTRADA CANCELADA. No es válida.",
      customerName: entry.customer_name,
    };
  }

  // 4. ¡Es válida! Marcarla como usada
  const { error: updateError } = await supabase
    .from("ticket_entries")
    .update({
      status: "used",
      used_at: new Date().toISOString(),
    })
    .eq("id", entry.id);

  if (updateError) {
    console.error("Error updating entry status:", updateError);
    return {
      valid: false,
      status: "error",
      message: "Error interno al procesar la entrada.",
    };
  }

  return {
    valid: true,
    status: "valid",
    message: "ENTRADA VÁLIDA",
    customerName: entry.customer_name,
    customerEmail: entry.customer_email,
    ticketName: (entry as any).tickets?.name || "Entrada",
    entryId: entry.id,
  };
}

/* ------------------------------------------------------------------ */
/*  VALIDATOR PROFILES (Personal de puerta)                            */
/* ------------------------------------------------------------------ */

/**
 * Verificar PIN de un validador para acceder al escáner.
 */
export async function verifyValidatorPin(pin: string) {
  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("validator_profiles")
    .select("*")
    .eq("pin_code", pin)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return { valid: false, message: "PIN inválido o cuenta desactivada." };
  }

  return {
    valid: true,
    validatorName: data.name,
    validatorId: data.id,
  };
}

/**
 * Obtener todos los validadores (para el admin).
 */
export async function getValidators() {
  await assertAdmin();
  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("validator_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching validators:", error);
    return [];
  }

  return data || [];
}

/**
 * Crear un perfil de validador (personal de puerta).
 */
export async function createValidator(data: {
  name: string;
  email: string;
  pinCode: string;
}) {
  await assertAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase
    .from("validator_profiles")
    .insert({
      name: data.name,
      email: data.email,
      pin_code: data.pinCode,
    });

  if (error) {
    console.error("Error creating validator:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/entradas-qr");
  return { success: true };
}

/**
 * Eliminar un validador.
 */
export async function deleteValidator(id: string) {
  await assertAdmin();
  const supabase = getAdminSupabase();

  const { error } = await supabase
    .from("validator_profiles")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting validator:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/entradas-qr");
  return { success: true };
}
