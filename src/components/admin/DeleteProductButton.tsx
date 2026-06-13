"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProduct } from "@/actions/admin";

type DeleteProductButtonProps = {
  id: string;
  name: string;
  redirectTo?: string;
  variant?: "table" | "form";
};

export function DeleteProductButton({
  id,
  name,
  redirectTo,
  variant = "table",
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = confirm(
      `Supprimer « ${name} » ?\n\n` +
        "• Si le produit figure dans des commandes, il sera désactivé (masqué en boutique).\n" +
        "• Sinon, il sera supprimé définitivement."
    );

    if (!confirmed) return;

    setLoading(true);
    const result = await deleteProduct(id);
    setLoading(false);

    if (!result.success) {
      alert(result.error || "Erreur lors de la suppression.");
      return;
    }

    alert(result.message ?? "Opération réussie.");

    if (redirectTo) {
      router.push(redirectTo);
    }

    router.refresh();
  }

  const className =
    variant === "form"
      ? "rounded-lg border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
      : "rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60";

  return (
    <button type="button" onClick={handleDelete} disabled={loading} className={className}>
      {loading ? "Suppression..." : "Supprimer"}
    </button>
  );
}
