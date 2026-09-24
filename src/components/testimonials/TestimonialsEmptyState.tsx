import { testimonialsSection } from "@/config/testimonials";

/** الصفحة الرئيسية فقط — بدون خانات «محجوزة» */
export function TestimonialsEmptyState() {
  return (
    <div className="mt-8 rounded-[1.75rem] border border-velora-burgundy/10 bg-white p-8 text-right shadow-sm md:max-w-2xl md:justify-self-center">
      <p className="text-lg font-bold text-velora-burgundy">{testimonialsSection.emptyTitle}</p>
      <p className="mt-3 text-sm leading-relaxed text-velora-burgundy/70">{testimonialsSection.emptyBody}</p>
    </div>
  );
}
