"use client";

import { useState } from "react";
import { publishedTestimonials, testimonialsSection } from "@/config/testimonials";
import { TestimonialReviewCard } from "./testimonials/TestimonialReviewCard";
import { TestimonialsEmptyState } from "./testimonials/TestimonialsEmptyState";

export function TestimonialsSection() {
  const reviews = publishedTestimonials();
  const [index, setIndex] = useState(0);

  return (
    <section id="reviews" className="bg-velora-cream-dark px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-velora-burgundy md:text-4xl">{testimonialsSection.title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-velora-burgundy/65 md:text-base">
          {testimonialsSection.subtitle}
        </p>

        {reviews.length === 0 ? (
          <TestimonialsEmptyState />
        ) : reviews.length === 1 ? (
          <div className="mx-auto mt-10 max-w-lg">
            <TestimonialReviewCard review={reviews[0]!} featured />
          </div>
        ) : reviews.length <= 3 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3 md:text-right">
            {reviews.map((review) => (
              <TestimonialReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <>
            <div className="mx-auto mt-10 max-w-xl">
              <TestimonialReviewCard review={reviews[index]!} featured />
            </div>
            <div className="mt-6 flex justify-center gap-2">
              {reviews.map((review, i) => (
                <button
                  key={review.id}
                  type="button"
                  aria-label={`رأي ${review.name}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-velora-burgundy" : "w-2 bg-velora-burgundy/25"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
