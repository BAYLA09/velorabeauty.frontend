import type { TestimonialReview } from "@/config/testimonials";
import { TestimonialAvatar } from "./TestimonialAvatar";
import { StarRating } from "./StarRating";

type Props = {
  review: TestimonialReview;
  featured?: boolean;
};

export function TestimonialReviewCard({ review, featured }: Props) {
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
