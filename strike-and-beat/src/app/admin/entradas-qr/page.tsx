import { getTicketEntries, getValidators } from "@/app/actions/ticket-entries";
import { getTickets } from "@/lib/supabase/queries";
import AdminEntradasQRClient from "./admin-entradas-qr-client";

export const dynamic = "force-dynamic";

export default async function EntradasQRPage() {
  const [entries, validators, tickets] = await Promise.all([
    getTicketEntries(),
    getValidators(),
    getTickets(),
  ]);

  return (
    <AdminEntradasQRClient 
      entries={entries}
      validators={validators}
      tickets={tickets}
    />
  );
}
