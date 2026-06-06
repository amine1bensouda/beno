import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PromoBanner } from "@/components/PromoBanner";
import "./globals.css";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "BENO Aqua Matic — Lessive liquide premium",
  description:
    "BENO Aqua Matic : lessive liquide 3 en 1, 110 lavages, efficace dès 30°C. Bleu Océanic & Lavande. Paiement à la livraison au Maroc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr" className={`${cairo.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f4f8fc] font-sans text-beno-navy antialiased">
        <CartProvider>
          <PromoBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
