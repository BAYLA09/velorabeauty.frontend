import { howToOrder } from "@/config/content";

export function HowToOrderSection() {
  return (
    <section className="bg-velora-cream px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold text-velora-burgundy md:text-4xl">
          {howToOrder.title}
        </h2>
        <p className="mt-3 text-center text-velora-burgundy/65">{howToOrder.support}</p>

        <ol className="mt-12 space-y-6">
          {howToOrder.steps.map((step) => (
            <li
              key={step.number}
              className="flex items-center gap-5 rounded-3xl border border-velora-burgundy/8 bg-white p-5 shadow-sm"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-velora-burgundy text-sm font-bold text-velora-cream">
                {step.number}
              </span>
              <p className="text-lg font-semibold text-velora-burgundy">{step.title}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
