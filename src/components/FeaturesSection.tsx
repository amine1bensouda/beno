import { productFeatures } from "@/lib/brand";

export function FeaturesSection() {
  return (
    <section className="border-y border-blue-100 bg-white py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
        {productFeatures.map((feature) => (
          <div
            key={feature.label}
            className="flex flex-col items-center rounded-2xl bg-blue-50/60 px-3 py-5 text-center"
          >
            <span className="mb-2 text-2xl">{feature.icon}</span>
            <p className="text-sm font-bold text-beno-navy">{feature.label}</p>
            <p className="mt-1 text-xs text-beno-blue" dir="rtl">
              {feature.labelAr}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
