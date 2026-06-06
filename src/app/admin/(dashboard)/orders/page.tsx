import { getAdminOrders } from "@/actions/admin";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-slate-900">Commandes</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
