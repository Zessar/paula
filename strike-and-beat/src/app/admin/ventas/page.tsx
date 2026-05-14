import { getOrders } from "@/lib/supabase/queries";
import { AdminOrdersClient } from "./admin-orders-client";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders(100); // Traemos las ultimas 100 ordenes

  return (
    <AdminOrdersClient initialOrders={orders} />
  );
}
