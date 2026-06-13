"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProduct, updateProduct, type ProductInput } from "@/actions/admin";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductImageField } from "@/components/admin/ProductImageField";

type Category = { id: string; name: string; slug: string };

type ProductFormProps = {
  categories: Category[];
  availableImages: string[];
  product?: {
    id: string;
    name: string;
    nameAr: string;
    slug: string;
    description: string;
    descriptionAr: string;
    price: number;
    compareAtPrice: number | null;
    image: string;
    categoryId: string;
    featured: boolean;
    inStock: boolean;
  };
};

export function ProductForm({ categories, availableImages, product }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: ProductInput = {
      name: form.get("name") as string,
      nameAr: form.get("nameAr") as string,
      slug: (form.get("slug") as string) || undefined,
      description: form.get("description") as string,
      descriptionAr: form.get("descriptionAr") as string,
      price: parseFloat(form.get("price") as string),
      compareAtPrice: form.get("compareAtPrice")
        ? parseFloat(form.get("compareAtPrice") as string)
        : null,
      image: form.get("image") as string,
      categoryId: form.get("categoryId") as string,
      featured: form.get("featured") === "on",
      inStock: form.get("inStock") === "on",
    };

    const result = isEdit
      ? await updateProduct(product!.id, data)
      : await createProduct(data);

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Erreur");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom (FR) *" name="name" defaultValue={product?.name} required />
        <Field label="Nom (AR)" name="nameAr" defaultValue={product?.nameAr} />
      </div>

      <Field
        label="Slug (URL)"
        name="slug"
        defaultValue={product?.slug}
        placeholder="auto-généré si vide"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Prix (DH) *"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price?.toString()}
          required
        />
        <Field
          label="Ancien prix (DH)"
          name="compareAtPrice"
          type="number"
          step="0.01"
          defaultValue={product?.compareAtPrice?.toString() ?? ""}
        />
      </div>

      <ProductImageField defaultValue={product?.image ?? ""} availableImages={availableImages} />

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-slate-700">Catégorie *</span>
        <select
          name="categoryId"
          required
          defaultValue={product?.categoryId ?? categories[0]?.id}
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-slate-700">Description (FR) *</span>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-slate-700">Description (AR)</span>
        <textarea
          name="descriptionAr"
          rows={4}
          defaultValue={product?.descriptionAr}
          dir="rtl"
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5"
        />
      </label>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? true}
            className="h-4 w-4"
          />
          Produit vedette
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={product?.inStock ?? true}
            className="h-4 w-4"
          />
          Visible en boutique
        </label>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-beno-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-beno-navy disabled:opacity-60"
        >
          {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le produit"}
        </button>
        <Link
          href="/admin/products"
          className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold hover:bg-slate-50"
        >
          Annuler
        </Link>
        {isEdit && product && (
          <DeleteProductButton
            id={product.id}
            name={product.name}
            redirectTo="/admin/products"
            variant="form"
          />
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        step={step}
        className="w-full rounded-lg border border-slate-200 px-4 py-2.5"
      />
    </label>
  );
}
