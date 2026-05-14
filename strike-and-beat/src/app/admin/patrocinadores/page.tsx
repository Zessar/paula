import { getSponsors } from "@/app/actions/sponsors";
import { AdminSponsorsClient } from "./admin-sponsors-client";

export const dynamic = "force-dynamic";

export default async function AdminSponsorsPage() {
  const sponsors = await getSponsors();

  return (
    <AdminSponsorsClient initialSponsors={sponsors} />
  );
}
