import { AdminSettingsClient } from "./admin-settings-client";
import { getEventInfo } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const eventInfo = await getEventInfo();
  return <AdminSettingsClient initialEventInfo={eventInfo} />;
}
