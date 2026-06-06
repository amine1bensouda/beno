import Link from "next/link";
import { getAdminProducts } from "@/actions/admin";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Produits</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-beno-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-beno-navy"
        >
          + Ajouter
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
