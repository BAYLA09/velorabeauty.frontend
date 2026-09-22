import { publishedTestimonials, testimonialsSection } from "@/config/testimonials";
import { TestimonialReviewCard } from "./TestimonialReviewCard";
import { TestimonialsEmptyState } from "./TestimonialsEmptyState";

type Props = {
  title: string;
  subtitle: string;
};

/** Product page — نفس منطق الصفحة الرئيسية */
export function TestimonialsProductStrip({ title, subtitle }: Props) {
  const reviews = publishedTestimonials();

  return (
    <section className="bg-velora-cream px-4 py-14 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-extrabold text-velora-burgundy">{title}</h2>
        <p className="mt-2 text-center text-sm text-velora-burgundy/55">{subtitle}</p>
        <div className="mt-10">
          {reviews.length === 0 ? (
            <TestimonialsEmptyState />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {reviews.slice(0, 3).map((review) => (
                <TestimonialReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
        {reviews.length === 0 && (
          <p className="mt-6 text-center text-xs text-velora-burgundy/45">
            {testimonialsSection.subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
