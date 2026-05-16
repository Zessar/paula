import { EntradasClient } from "./checkout-client";
import { getTickets, getEventInfo } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function EntradasPage() {
  const tickets = await getTickets();
  const eventInfo = await getEventInfo();
  return <EntradasClient initialTickets={tickets} eventInfo={eventInfo} />;
}
