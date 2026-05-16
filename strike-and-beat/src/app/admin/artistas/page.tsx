import { AdminArtistsClient } from "./admin-artists-client";
import { getArtists } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminArtistsPage() {
  const artists = await getArtists();
  return <AdminArtistsClient initialArtists={artists} />;
}
