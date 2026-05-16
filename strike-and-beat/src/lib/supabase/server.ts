import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component - no se pueden setear cookies desde aqui.
            // Esto es seguro de ignorar si solo estamos leyendo datos.
          }
        },
      },
    }
  );
}

export async function assertAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("Acceso denegado: no autenticado.");
  }
  
  const adminEmails = [
    "veladadeboxeobeneficaazuqueca@hotmail.com",
    "sequerone37@gmail.com"
  ];
  
  if (!adminEmails.includes(user.email || "")) {
    throw new Error("Acceso denegado: no tienes permisos de administrador.");
  }
  
  return user;
}
