import Link from "next/link";
import { formatPrice } from "@/lib/cart";
import { getProductVariant, productMeta, variantStyles } from "@/lib/brand";
import { AddToCartButton } from "./AddToCartButton";

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    nameAr: string;
    price: number;
    compareAtPrice: number | null;
    image: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const meta = productMeta[product.slug];
  const variant = getProductVariant(product.slug);
  const styles = variantStyles[variant];

  return (
    <article
      className={`group overflow-hidden rounded-3xl border bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl ${styles.border}`}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className={`relative aspect-[4/5] overflow-hidden ${styles.bg}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {meta && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white ${styles.badge}`}
            >
              {meta.volume} · {meta.washes} lavages
            </span>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/products/${product.slug}`}>
          <h3 className={`mb-1 line-clamp-2 min-h-[3rem] text-lg font-bold text-beno-navy transition ${styles.hoverText}`}>
            {product.name}
          </h3>
          {meta && (
            <p className={`mb-3 text-sm font-medium ${styles.text}`}>
              Parfum {meta.scent}
            </p>
          )}
        </Link>

        <div className="mb-5 flex items-center gap-2">
          <span className="text-2xl font-black text-beno-navy">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

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
      </div>
    </article>
  );
}
