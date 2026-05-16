import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Endpoint para validar un código QR desde el escáner
export async function POST(req: Request) {
  try {
    const { qrCode } = await req.json();

    if (!qrCode || typeof qrCode !== "string") {
      return NextResponse.json(
        { valid: false, status: "error", message: "Código QR vacío o inválido." },
        { status: 400 }
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {}
        }
      }
    );

    // 1. Buscar la entrada
    const { data: entry, error } = await supabase
      .from("ticket_entries")
      .select(`*, tickets ( name )`)
      .eq("qr_code", qrCode)
      .single();

    if (error || !entry) {
      return NextResponse.json({
        valid: false,
        status: "not_found",
        message: "ENTRADA NO ENCONTRADA. Código QR inválido.",
      });
    }

    // 2. Comprobar estado
    if (entry.status === "used") {
      return NextResponse.json({
        valid: false,
        status: "already_used",
        message: `ENTRADA YA USADA el ${new Date(entry.used_at).toLocaleString("es-ES")}`,
        customerName: entry.customer_name,
        ticketName: (entry as any).tickets?.name || "Entrada",
      });
    }

    if (entry.status === "cancelled") {
      return NextResponse.json({
        valid: false,
        status: "cancelled",
        message: "ENTRADA CANCELADA. No es válida.",
        customerName: entry.customer_name,
      });
    }

    // 3. Marcar como usada
    const { error: updateError } = await supabase
      .from("ticket_entries")
      .update({
        status: "used",
        used_at: new Date().toISOString(),
      })
      .eq("id", entry.id);

    if (updateError) {
      return NextResponse.json({
        valid: false,
        status: "error",
        message: "Error interno al procesar la entrada.",
      }, { status: 500 });
    }

    return NextResponse.json({
      valid: true,
      status: "valid",
      message: "ENTRADA VALIDA",
      customerName: entry.customer_name,
      customerEmail: entry.customer_email,
      ticketName: (entry as any).tickets?.name || "Entrada",
    });
  } catch (err) {
    console.error("Error en validación QR:", err);
    return NextResponse.json(
      { valid: false, status: "error", message: "Error del servidor." },
      { status: 500 }
    );
  }
}
