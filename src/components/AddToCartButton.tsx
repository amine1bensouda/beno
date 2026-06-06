"use client";

import { useState } from "react";
import { getProductVariant, variantStyles } from "@/lib/brand";
import { useCart } from "./CartProvider";

type AddToCartButtonProps = {
  product: {
    productId: string;
    slug: string;
    name: string;
    nameAr: string;
    price: number;
    image: string;
  };
  fullWidth?: boolean;
};

export function AddToCartButton({ product, fullWidth = true }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const styles = variantStyles[getProductVariant(product.slug)];

  function handleClick() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-full px-5 py-3 text-sm font-bold text-white transition ${styles.accent} ${styles.accentHover} ${
        fullWidth ? "w-full" : ""
      } ${added ? "opacity-80" : ""}`}
    >
      {added ? "Ajouté ✓" : "Acheter maintenant"}
    </button>
  );
}
