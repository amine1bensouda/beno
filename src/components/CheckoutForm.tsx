"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/store";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/cart";

export function CheckoutForm() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await createOrder({
      customerName: formData.get("customerName") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      address: formData.get("address") as string,
      notes: (formData.get("notes") as string) || undefined,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Une erreur est survenue.");
      return;
    }

    clearCart();
    router.push(`/order/success?id=${result.orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">Votre panier est vide.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-beno-navy">Informations de livraison</h2>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-beno-navy">Nom complet *</span>
          <input
            required
            name="customerName"
            className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none ring-beno-blue focus:ring-2"
            placeholder="Votre nom"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-beno-navy">Téléphone *</span>
          <input
            required
            name="phone"
            type="tel"
            className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none ring-beno-blue focus:ring-2"
            placeholder="06 XX XX XX XX"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-beno-navy">Ville *</span>
          <input
            required
            name="city"
            className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none ring-beno-blue focus:ring-2"
            placeholder="Casablanca, Rabat..."
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-beno-navy">Adresse *</span>
          <textarea
            required
            name="address"
            rows={3}
            className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none ring-beno-blue focus:ring-2"
            placeholder="Quartier, rue, numéro..."
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-beno-navy">Notes (optionnel)</span>
          <textarea
            name="notes"
            rows={2}
            className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none ring-beno-blue focus:ring-2"
            placeholder="Instructions pour le livreur"
          />
        </label>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      </div>

      <div className="h-fit rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-black text-beno-navy">Récapitulatif</h2>

        <ul className="mb-6 space-y-3">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-4 text-sm">
              <span className="text-gray-700">
                {item.name} × {item.quantity}
              </span>
              <span className="font-bold text-beno-navy">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mb-6 flex items-center justify-between border-t border-blue-50 pt-4">
          <span className="text-lg font-black">Total</span>
          <span className="text-2xl font-black text-beno-blue">{formatPrice(total)}</span>
        </div>

        <div className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-beno-navy">
          Paiement à la livraison (espèces) — vous payez uniquement à la réception.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-beno-blue px-6 py-3 text-sm font-bold text-white transition hover:bg-beno-navy disabled:opacity-60"
        >
          {loading ? "Envoi en cours..." : "Confirmer la commande"}
        </button>
      </div>
    </form>
  );
}
