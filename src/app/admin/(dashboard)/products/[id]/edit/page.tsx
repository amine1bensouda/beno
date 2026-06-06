import { notFound } from "next/navigation";
import { getAdminCategories, getAdminProduct } from "@/actions/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black text-slate-900">Modifier le produit</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
