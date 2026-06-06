"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/actions/admin";

const links = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/products", label: "Produits" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-r border-slate-200 bg-slate-900 text-white md:w-64 md:min-h-screen">
      <div className="border-b border-slate-700 px-6 py-5">
        <p className="text-xl font-black italic text-red-500">BENO</p>
        <p className="text-sm text-slate-300">Panel Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                active ? "bg-beno-blue text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <Link
          href="/"
          className="mb-2 block rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          ← Voir la boutique
        </Link>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="w-full rounded-lg px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-800"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
