import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getProductBySlug } from "@/actions/store";
import { formatPrice } from "@/lib/cart";
import { getProductVariant, productFeatures, productMeta, variantStyles } from "@/lib/brand";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const meta = productMeta[slug];
  const styles = variantStyles[getProductVariant(slug)];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className={`overflow-hidden rounded-3xl bg-white p-6 shadow-md ring-1 ${styles.ring}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {meta?.bottle && meta.bottle !== product.image && (
            <div className={`overflow-hidden rounded-2xl p-4 shadow-sm ${styles.bg}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={meta.bottle}
                alt={`Bouteille ${product.name}`}
                className="w-full object-contain"
              />
            </div>
          )}
          {meta?.poster && meta.poster !== product.image && !meta?.bottle && (
            <div className="overflow-hidden rounded-2xl shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={meta.poster}
                alt={`Affiche ${product.name}`}
                className="w-full object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <p className={`mb-2 text-sm font-bold uppercase tracking-wide ${styles.text}`}>
            {product.category.name}
          </p>
          <h1 className="mb-2 text-3xl font-black text-beno-navy">{product.name}</h1>
          <p className="mb-6 text-lg text-gray-500" dir="rtl">
            {product.nameAr}
          </p>

          {meta && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className={`rounded-full px-4 py-1.5 text-sm font-bold text-white ${styles.badge}`}>
                {meta.volume}
              </span>
              <span className="rounded-full bg-beno-navy px-4 py-1.5 text-sm font-bold text-white">
                {meta.washes} lavages
              </span>
              <span className={`rounded-full border px-4 py-1.5 text-sm font-semibold text-beno-navy ${styles.border} ${styles.bg}`}>
                Parfum {meta.scent}
              </span>
            </div>
          )}

          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl font-black text-beno-navy">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {productFeatures.map((f) => (
              <div
                key={f.label}
                className={`rounded-xl px-3 py-2 text-center text-xs font-semibold text-beno-navy ${styles.featureBg}`}
              >
                {f.icon} {f.label}
              </div>
            ))}
          </div>

          <p className="mb-4 leading-relaxed text-gray-700">{product.description}</p>
          <p className="mb-8 leading-relaxed text-gray-600" dir="rtl">
            {product.descriptionAr}
          </p>

          <AddToCartButton
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              nameAr: product.nameAr,
              price: product.price,
              image: product.image,
            }}
          />

          <div className={`mt-8 rounded-2xl px-5 py-4 text-sm text-beno-navy ${styles.infoBg}`}>
            Paiement à la livraison disponible partout au Maroc.
          </div>

          <Link href="/" className={`mt-6 inline-block text-sm font-semibold ${styles.text} hover:underline`}>
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
