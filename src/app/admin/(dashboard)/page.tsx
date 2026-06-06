import Link from "next/link";
import { getAdminStats } from "@/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-slate-900">Tableau de bord</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Commandes totales" value={stats.ordersCount.toString()} />
        <StatCard label="En attente" value={stats.pendingCount.toString()} color="amber" />
        <StatCard label="Produits" value={stats.productsCount.toString()} color="blue" />
        <StatCard label="Chiffre d'affaires" value={`${stats.revenue.toFixed(0)} DH`} color="green" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/orders"
          className="rounded-lg bg-beno-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-beno-navy"
        >
          Voir les commandes
        </Link>
        <Link
          href="/admin/products/new"
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-50"
        >
          Ajouter un produit
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "slate",
}: {
  label: string;
  value: string;
  color?: "slate" | "amber" | "blue" | "green";
}) {
  const colors = {
    slate: "border-slate-200",
    amber: "border-amber-200 bg-amber-50",
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
  };

  return (
    <div className={`rounded-xl border bg-white p-5 ${colors[color]}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
