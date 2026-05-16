import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // updateSession se encarga de verificar el token y redirigir si es necesario
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Intercepta todas las rutas excepto:
     * - api (rutas de la API)
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo de icono)
     * - rutas que terminan en ciertas extensiones (imágenes, svg, fuentes, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
