import { AdminEntradasClient } from "./admin-entradas-client";
import { getTickets } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminEntradasPage() {
  const tickets = await getTickets();
  return <AdminEntradasClient initialTickets={tickets} />;
}
