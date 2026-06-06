export const dynamic = "force-dynamic";

import { FeaturesSection } from "@/components/FeaturesSection";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts } from "@/actions/store";
import { brand } from "@/lib/brand";

type HomeProps = {
  searchParams: Promise<{ category?: string }>;
};

const categoryTitles: Record<string, string> = {
  "bleu-oceanic": "BENO Aqua Matic Bleu Océanic",
  lavande: "BENO Aqua Matic Lavande",
  "verda-fresh": "BENO Aqua Matic Verda Fresh",
};

export default async function Home({ searchParams }: HomeProps) {
  const { category } = await searchParams;
  const products = await getAllProducts();
  const filtered = category
    ? products.filter((p) => p.category.slug === category)
    : products;

  return (
    <>
      <HeroSlider />
      <FeaturesSection />

      <section id="products" className="mx-auto max-w-5xl px-4 py-14">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-beno-blue">
            BENO Aqua Matic
          </p>
          <h2 className="mb-2 text-3xl font-black text-beno-navy md:text-4xl">
            {category ? categoryTitles[category] ?? "Nos produits" : "Nos lessives"}
          </h2>
          <p className="text-gray-600">
            {brand.slogan} — Livraison partout au Maroc
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">Aucun produit dans cette catégorie.</p>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
