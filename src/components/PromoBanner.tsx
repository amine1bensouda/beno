export function PromoBanner() {
  return (
    <div className="bg-beno-navy px-4 py-2.5 text-center text-sm font-semibold text-white">
      <span className="hidden sm:inline">Offre spéciale : </span>
      Paiement en espèces à la livraison — Commandez maintenant !
      <span className="mx-2 hidden sm:inline">|</span>
      <span className="hidden sm:inline" dir="rtl">
        الدفع نقداً عند الاستلام — اسرع واطلب الآن
      </span>
    </div>
  );
}
