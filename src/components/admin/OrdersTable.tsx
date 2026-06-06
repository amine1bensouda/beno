"use client";

import { Fragment, useState } from "react";
import { updateOrderStatus } from "@/actions/admin";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

type Order = {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  total: number;
  status: string;
  createdAt: Date;
  items: {
    quantity: number;
    price: number;
    product: { name: string };
  }[];
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Aucune commande pour le moment.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 font-medium">{order.customerName}</td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3">{order.city}</td>
                  <td className="px-4 py-3 font-bold">{order.total.toFixed(0)} DH</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[order.status] ?? "bg-slate-100"}`}>
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      className="text-beno-blue hover:underline"
                    >
                      {expanded === order.id ? "Masquer" : "Détails"}
                    </button>
                  </td>
                </tr>
                {expanded === order.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="mb-2 font-semibold text-slate-700">Adresse</p>
                          <p className="text-slate-600">{order.address}</p>
                          {order.notes && (
                            <p className="mt-2 text-sm text-slate-500">Note : {order.notes}</p>
                          )}
                          <p className="mt-2 text-xs text-slate-400">ID : {order.id}</p>
                        </div>
                        <div>
                          <p className="mb-2 font-semibold text-slate-700">Articles</p>
                          <ul className="mb-4 space-y-1 text-slate-600">
                            {order.items.map((item, i) => (
                              <li key={i}>
                                {item.product.name} × {item.quantity} — {(item.price * item.quantity).toFixed(0)} DH
                              </li>
                            ))}
                          </ul>
                          <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await updateOrderStatus(orderId, status);
    setLoading(false);
    setMessage(result.success ? "Statut mis à jour." : result.error || "Erreur");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-500">Changer le statut</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="delivered">Livrée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-beno-blue px-4 py-2 text-sm font-semibold text-white hover:bg-beno-navy disabled:opacity-60"
      >
        {loading ? "..." : "Enregistrer"}
      </button>
      {message && <span className="text-sm text-green-600">{message}</span>}
    </form>
  );
}
