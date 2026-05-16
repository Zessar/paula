import { AdminFightsClient } from "./admin-fights-client";
import { getFights } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminFightsPage() {
  const fights = await getFights();
  return <AdminFightsClient initialFights={fights} />;
}
