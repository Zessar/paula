import { AdminEntradasClient } from "./admin-entradas-client";
import { getTickets } from "@/lib/supabase/queries";

export default async function AdminEntradasPage() {
  const tickets = await getTickets();
  return <AdminEntradasClient initialTickets={tickets} />;
}
