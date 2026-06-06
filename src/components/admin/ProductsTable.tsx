"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/admin";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  inStock: boolean;
  featured: boolean;
  category: { name: string };
};

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer « ${name} » ?`)) return;

    const result = await deleteProduct(id);
    alert(result.message || (result.success ? "Supprimé." : result.error));
    router.refresh();
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Aucun produit.{" "}
        <Link href="/admin/products/new" className="text-beno-blue hover:underline">
          Ajouter un produit
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-lg object-cover bg-slate-100"
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.slug}</p>
                </td>
                <td className="px-4 py-3">{product.category.name}</td>
                <td className="px-4 py-3">
                  <span className="font-bold">{product.price.toFixed(0)} DH</span>
                  {product.compareAtPrice && (
                    <span className="ml-1 text-xs text-slate-400 line-through">
                      {product.compareAtPrice.toFixed(0)} DH
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {product.inStock ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      En ligne
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                      Désactivé
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id, product.name)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
