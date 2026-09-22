import { testimonialsSection } from "@/config/testimonials";

export function TestimonialsEmptyState() {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      <div className="rounded-[1.75rem] border border-velora-burgundy/15 bg-white p-8 shadow-sm md:col-span-3 md:max-w-2xl md:justify-self-center">
        <p className="text-lg font-bold text-velora-burgundy">{testimonialsSection.emptyTitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-velora-burgundy/70">
          {testimonialsSection.emptyBody}
        </p>
      </div>
      {[1, 2, 3].map((slot) => (
        <div
          key={slot}
          className="rounded-[1.75rem] border border-dashed border-velora-burgundy/15 bg-white/60 p-6 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-velora-cream-dark text-sm font-bold text-velora-burgundy/40">
            {slot}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-velora-burgundy/45">
            مساحة محجوزة لتقييم معتمد #{slot}
          </p>
        </div>
      ))}
    </div>
  );
}
