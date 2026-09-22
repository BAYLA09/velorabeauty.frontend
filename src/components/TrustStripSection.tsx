import { trustStrip } from "@/config/content";

export function TrustStripSection() {
  return (
    <section className="border-y border-velora-burgundy/10 bg-velora-cream-dark">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-velora-burgundy/10 md:grid-cols-4">
        {trustStrip.items.map((label) => (
          <div
            key={label}
            className="flex min-h-[5.5rem] items-center justify-center bg-velora-cream-dark px-4 py-5 text-center text-sm font-medium leading-snug text-velora-burgundy md:text-base"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="bg-velora-burgundy px-4 py-4 text-center text-sm font-medium text-velora-champagne md:text-base">
        {trustStrip.codBanner}
      </div>
    </section>
  );
}
