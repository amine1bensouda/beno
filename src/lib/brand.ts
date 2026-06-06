export const brand = {
  name: "BENO",
  tagline: "Aqua Matic — Lessive liquide premium",
  slogan: "Propreté impeccable, fraîcheur qui dure",
  sloganAr: "نظافة وانتعاش يدومان",
} as const;

export type ProductVariant = "blue" | "purple" | "green";

export function getProductVariant(slug: string): ProductVariant {
  if (slug.includes("lavande")) return "purple";
  if (slug.includes("verda")) return "green";
  return "blue";
}

export const variantStyles: Record<
  ProductVariant,
  {
    border: string;
    bg: string;
    badge: string;
    accent: string;
    accentHover: string;
    text: string;
    hoverText: string;
    ring: string;
    featureBg: string;
    infoBg: string;
  }
> = {
  blue: {
    border: "border-blue-100",
    bg: "bg-blue-50",
    badge: "bg-beno-blue",
    accent: "bg-beno-blue",
    accentHover: "hover:bg-beno-navy",
    text: "text-beno-blue",
    hoverText: "hover:text-beno-blue",
    ring: "ring-blue-100",
    featureBg: "bg-blue-50",
    infoBg: "bg-blue-50",
  },
  purple: {
    border: "border-purple-100",
    bg: "bg-purple-50",
    badge: "bg-beno-purple",
    accent: "bg-beno-purple",
    accentHover: "hover:bg-purple-800",
    text: "text-beno-purple",
    hoverText: "hover:text-beno-purple",
    ring: "ring-purple-100",
    featureBg: "bg-purple-50",
    infoBg: "bg-purple-50",
  },
  green: {
    border: "border-green-100",
    bg: "bg-green-50",
    badge: "bg-beno-green",
    accent: "bg-beno-green",
    accentHover: "hover:bg-beno-green-dark",
    text: "text-beno-green-dark",
    hoverText: "hover:text-beno-green-dark",
    ring: "ring-green-100",
    featureBg: "bg-green-50",
    infoBg: "bg-green-50",
  },
};

export const productFeatures = [
  { icon: "✨", label: "3 en 1", labelAr: "3 في 1" },
  { icon: "👕", label: "110 lavages", labelAr: "110 غسلة" },
  { icon: "🌡️", label: "Efficace dès 30°C", labelAr: "فعال من 30°م" },
  { icon: "🌿", label: "Sans phosphates", labelAr: "بدون فوسفates" },
  { icon: "🇲🇦", label: "Fabriqué au Maroc", labelAr: "صنع في المغرب" },
] as const;

export const productMeta: Record<
  string,
  {
    volume: string;
    washes: number;
    scent: string;
    poster?: string;
    label?: string;
    bottle?: string;
  }
> = {
  "beno-aqua-matic-bleu-oceanic-5l": {
    volume: "5L",
    washes: 110,
    scent: "Bleu Océanic",
    poster: "/products/bleu-oceanic-poster.png",
    label: "/products/bleu-oceanic-label.png",
    bottle: "/products/bleu-oceanic-bottle.png",
  },
  "beno-aqua-matic-lavande-5l": {
    volume: "5L",
    washes: 110,
    scent: "Lavande",
    poster: "/products/lavande-poster.png",
    label: "/products/lavande-label.png",
  },
  "beno-aqua-matic-verda-fresh-5l": {
    volume: "5L",
    washes: 110,
    scent: "Verda Fresh",
  },
};
