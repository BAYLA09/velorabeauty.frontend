"use client";

import { useState } from "react";
import { testimonials } from "@/config/content";
import { images } from "@/config/images";
import { VeloraImage } from "./ui/VeloraImage";

const imageMap = {
  customer01: images.testimonials.customer01,
  customer02: images.testimonials.customer02,
} as const;

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const item = testimonials.items[index];
  const img = imageMap[item.imageKey];

  return (
    <section className="bg-velora-cream-dark px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-velora-burgundy md:text-4xl">
          {testimonials.title}
        </h2>

        <div className="mt-10 rounded-[2rem] border border-velora-burgundy/8 bg-white p-8 shadow-lg md:p-12">
          <p className="text-5xl leading-none text-velora-champagne" aria-hidden>
            ❝
          </p>
          <div className="mx-auto mt-6 h-24 w-24 overflow-hidden rounded-full border-2 border-velora-champagne/40">
            <VeloraImage
              src={img.src}
              alt={item.name}
              placeholder={img.placeholder}
              className="h-full w-full rounded-full"
              sizes="96px"
            />
          </div>
          <div className="mt-4 flex justify-center gap-1 text-velora-champagne" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <blockquote className="mt-6 text-lg leading-relaxed text-velora-burgundy/75">
            {item.quote}
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-velora-burgundy">{item.name}</p>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`رأي ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-velora-burgundy" : "w-2 bg-velora-burgundy/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
