"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/?category=bleu-oceanic", label: "Bleu Océanic" },
  { href: "/?category=lavande", label: "Lavande" },
  { href: "/?category=verda-fresh", label: "Verda Fresh" },
];

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-black italic tracking-tight text-beno-red">
            BENO
          </span>
          <div className="hidden border-l border-blue-100 pl-3 sm:block">
            <p className="text-sm font-bold uppercase tracking-wide text-beno-navy">
              Aqua Matic
            </p>
            <p className="text-xs text-beno-blue">Lessive liquide premium</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-beno-navy/80 transition hover:text-beno-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative rounded-full bg-beno-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-beno-navy"
        >
          Panier
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-beno-red text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
