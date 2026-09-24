import type { TestimonialReview } from "@/config/testimonials";
import { TestimonialAvatar } from "./TestimonialAvatar";
import { StarRating } from "./StarRating";

type Props = {
  review: TestimonialReview;
  featured?: boolean;
  layout?: "default" | "pdp";
};

function cityAgeLine(review: TestimonialReview) {
  if (review.age != null) {
    return `${review.city} • ${review.age} سنة`;
  }
  return review.city;
}

export function TestimonialReviewCard({ review, featured, layout = "default" }: Props) {
  if (layout === "pdp") {
    return (
      <article className="flex h-full flex-col rounded-[1.25rem] border border-velora-burgundy/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-velora-cream-dark px-2.5 py-1 text-[10px] font-bold text-velora-burgundy-dark">
            ✓ مؤكدة
          </span>
          {review.rating != null ? (
            <StarRating rating={review.rating} className="text-amber-500" />
          ) : null}
        </div>
        <blockquote className="flex-1 text-center text-sm leading-relaxed text-velora-burgundy/85 sm:text-[15px]">
          {review.quote}
        </blockquote>
        <footer className="mt-5 flex items-center justify-between gap-3 border-t border-velora-burgundy/8 pt-4">
          <div className="min-w-0 text-right">
            <p className="text-sm font-extrabold text-velora-burgundy-dark">{review.name}</p>
            <p className="text-xs text-velora-burgundy/55">{cityAgeLine(review)}</p>
          </div>
          <TestimonialAvatar name={review.name} imageSrc={review.imageSrc} size="sm" />
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
            <span className="font-medium text-velora-burgundy/55"> · {cityAgeLine(review)}</span>
          </p>
          {review.productLabel && (
            <p className="mt-1 text-xs text-velora-champagne-dark">{review.productLabel}</p>
          )}
        </div>
      </footer>
    </article>
  );
}
