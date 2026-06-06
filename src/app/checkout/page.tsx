import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-black text-beno-navy">Finaliser la commande</h1>
      <p className="mb-8 text-gray-600">Paiement en espèces à la livraison</p>
      <CheckoutForm />
    </div>
  );
}
