export function HeroSlider() {
  return (
    <section className="relative overflow-hidden bg-beno-navy">
      <div className="relative mx-auto max-w-7xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/products/trio-banner.png"
          alt="BENO Aqua Matic — Lavande, Bleu Océanic et Verda Fresh"
          className="w-full object-cover object-center md:max-h-[580px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-beno-navy/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 md:bottom-10">
          <a
            href="#products"
            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-beno-navy shadow-lg transition hover:bg-blue-50"
          >
            Commander maintenant
          </a>
        </div>
      </div>
    </section>
  );
}
