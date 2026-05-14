import { AdminFightsClient } from "./admin-fights-client";
import { getFights } from "@/lib/supabase/queries";

export default async function AdminFightsPage() {
  const fights = await getFights();
  return <AdminFightsClient initialFights={fights} />;
}
