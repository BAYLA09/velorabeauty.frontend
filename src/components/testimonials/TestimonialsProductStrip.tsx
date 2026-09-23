import { publishedTestimonials, testimonialsSection } from "@/config/testimonials";
import { TestimonialReviewCard } from "./TestimonialReviewCard";
import { TestimonialsEmptyState } from "./TestimonialsEmptyState";

type Props = {
  title: string;
  subtitle: string;
  layout?: "default" | "pdp";
};

export function TestimonialsProductStrip({ title, subtitle, layout = "default" }: Props) {
  const reviews = publishedTestimonials();

  return (
    <section className="bg-velora-cream px-4 py-12 md:px-6 md:py-14">
      <div className="mx-auto max-w-lg sm:max-w-3xl">
        <h2 className="text-right text-2xl font-extrabold text-velora-burgundy-dark sm:text-3xl">{title}</h2>
        <p className="mt-2 text-right text-sm text-velora-burgundy/55">{subtitle}</p>
        <div className="mt-8 space-y-4">
          {reviews.length === 0 ? (
            <TestimonialsEmptyState />
          ) : (
            reviews.slice(0, 4).map((review) => (
              <TestimonialReviewCard key={review.id} review={review} layout={layout === "pdp" ? "pdp" : "default"} />
            ))
          )}
        </div>
        {reviews.length === 0 ? (
          <p className="mt-6 text-center text-xs text-velora-burgundy/45">{testimonialsSection.subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
