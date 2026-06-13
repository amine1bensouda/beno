import { getAdminCategories, getProductImages } from "@/actions/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, availableImages] = await Promise.all([
    getAdminCategories(),
    getProductImages(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-slate-900">Nouveau produit</h1>
      <ProductForm categories={categories} availableImages={availableImages} />
    </div>
  );
}
