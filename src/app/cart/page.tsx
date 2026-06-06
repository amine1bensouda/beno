import { CartContent } from "@/components/CartContent";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-black text-beno-navy">Mon panier</h1>
      <CartContent />
    </div>
  );
}
