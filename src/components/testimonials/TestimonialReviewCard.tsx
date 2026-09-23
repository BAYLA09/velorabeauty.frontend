import type { TestimonialReview } from "@/config/testimonials";
import { TestimonialAvatar } from "./TestimonialAvatar";
import { StarRating } from "./StarRating";

type Props = {
  review: TestimonialReview;
  featured?: boolean;
  layout?: "default" | "pdp";
};

export function TestimonialReviewCard({ review, featured, layout = "default" }: Props) {
  if (layout === "pdp") {
    return (
      <article className="rounded-[1.5rem] border border-velora-burgundy/10 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
            ✓ مؤكدة
          </span>
          {review.rating != null ? (
            <div className="shrink-0">
              <StarRating rating={review.rating} />
            </div>
          ) : null}
        </div>
        <blockquote className="text-right text-sm leading-relaxed text-velora-burgundy/85 sm:text-base">
          {review.quote}
        </blockquote>
        <footer className="mt-4 flex items-center justify-end gap-3 border-t border-velora-burgundy/8 pt-4">
          <div className="text-right">
            <p className="text-sm font-bold text-velora-burgundy-dark">{review.name}</p>
            <p className="text-xs text-velora-burgundy/55">{review.city}</p>
          </div>
          <TestimonialAvatar name={review.name} imageSrc={review.imageSrc} size="md" />
        </footer>
      </article>
    );
  }

  return (
    <article
      className={`flex h-full flex-col rounded-[1.75rem] border bg-white p-6 text-center shadow-sm md:p-8 ${
        featured
          ? "border-velora-champagne/35 shadow-md"
          : "border-velora-burgundy/10"
      }`}
    >
      {review.rating != null && (
        <div className="flex justify-center">
          <StarRating rating={review.rating} />
        </div>
      )}
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-velora-burgundy/85 md:text-lg">
        <span className="text-velora-champagne/80" aria-hidden>
          ❝{" "}
        </span>
        {review.quote}
      </blockquote>
      <footer className="mt-6 flex flex-col items-center gap-3">
        <TestimonialAvatar name={review.name} imageSrc={review.imageSrc} size={featured ? "lg" : "md"} />
        <div>
          <p className="text-sm font-bold text-velora-burgundy">
            {review.name}
            <span className="font-medium text-velora-burgundy/55"> · {review.city}</span>
          </p>
          {review.productLabel && (
            <p className="mt-1 text-xs text-velora-champagne-dark">{review.productLabel}</p>
          )}
        </div>
      </footer>
    </article>
  );
}
