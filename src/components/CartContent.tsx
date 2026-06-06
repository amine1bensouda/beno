"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/cart";

export function CartContent() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-blue-100 bg-white p-10 text-center shadow-sm">
        <p className="mb-4 text-gray-600">Votre panier est vide.</p>
        <Link
          href="/"
          className="inline-flex rounded-full bg-beno-blue px-6 py-3 text-sm font-bold text-white hover:bg-beno-navy"
        >
          Voir les produits BENO
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="h-24 w-24 rounded-xl bg-blue-50 object-contain p-1"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/products/${item.slug}`}
                  className="font-bold text-beno-navy hover:text-beno-blue"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-semibold text-beno-blue">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 text-beno-navy"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 text-beno-navy"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="ml-auto text-sm text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-black text-beno-navy">Total</h2>
        <p className="mb-6 text-3xl font-black text-beno-blue">{formatPrice(total)}</p>
        <Link
          href="/checkout"
          className="block w-full rounded-full bg-beno-blue px-6 py-3 text-center text-sm font-bold text-white hover:bg-beno-navy"
        >
          Passer commande
        </Link>
      </div>
    </div>
  );
}
