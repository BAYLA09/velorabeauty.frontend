import { publishedTestimonials } from "@/config/testimonials";
import { ProductEmotionalProof } from "@/components/product/ProductEmotionalProof";
import { TestimonialReviewCard } from "./TestimonialReviewCard";

type EmotionalFallback = {
  title: string;
  subtitle: string;
  lines: string[];
};

type Props = {
  title: string;
  subtitle: string;
  layout?: "default" | "pdp";
  emotionalFallback?: EmotionalFallback;
};

export function TestimonialsProductStrip({
  title,
  subtitle,
  layout = "default",
  emotionalFallback,
}: Props) {
  const reviews = publishedTestimonials();

  if (reviews.length > 0) {
    return (
      <section className="bg-velora-cream px-4 py-12 md:px-6 md:py-14">
        <div className="mx-auto max-w-lg sm:max-w-3xl">
          <h2 className="text-right text-2xl font-extrabold text-velora-burgundy-dark sm:text-3xl">{title}</h2>
          <p className="mt-2 text-right text-sm text-velora-burgundy/55">{subtitle}</p>
          <div className="mt-8 space-y-4">
            {reviews.slice(0, 4).map((review) => (
              <TestimonialReviewCard key={review.id} review={review} layout={layout === "pdp" ? "pdp" : "default"} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "pdp" && emotionalFallback) {
    return (
      <ProductEmotionalProof
        title={emotionalFallback.title}
        subtitle={emotionalFallback.subtitle}
        lines={emotionalFallback.lines}
      />
    );
  }

  return null;
}
