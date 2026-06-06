import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { id } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-3xl border border-emerald-100 bg-white p-10 shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl text-beno-blue">
          ✓
        </div>
        <h1 className="mb-3 text-3xl font-black text-beno-navy">Commande confirmée !</h1>
        <p className="mb-2 text-gray-600">
          Merci pour votre commande. Nous vous contacterons très bientôt pour confirmer la livraison.
        </p>
        {id && (
          <p className="mb-8 text-sm text-gray-500">
            Numéro de commande : <span className="font-mono font-medium">{id}</span>
          </p>
        )}
        <Link
          href="/"
          className="inline-flex rounded-full bg-beno-blue px-6 py-3 text-sm font-bold text-white hover:bg-beno-navy"
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
