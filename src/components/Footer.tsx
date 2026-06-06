import Link from "next/link";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-auto bg-beno-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="mb-2 text-2xl font-black italic text-beno-red">BENO</p>
          <p className="text-sm text-blue-100">{brand.tagline}</p>
          <p className="mt-2 text-xs text-blue-200/80" dir="rtl">
            {brand.sloganAr}
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Informations</h4>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>Lessive liquide 3 en 1</li>
            <li>110 lavages — Format 5L</li>
            <li>Sans phosphates — Efficace dès 30°C</li>
            <li>
              <Link href="/checkout" className="hover:text-white">
                Paiement à la livraison
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>Fabriqué au Maroc — Doro Industries</li>
            <li>Livraison partout au Maroc</li>
            <li>WhatsApp / Téléphone</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-blue-200">
        © {new Date().getFullYear()} BENO — Tous droits réservés
      </div>
    </footer>
  );
}
