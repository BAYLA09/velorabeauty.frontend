"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductPageImage } from "@/components/product/ProductPageImage";
import {
  productRitualByProductId,
  ritualCta,
} from "@/config/productRitualSection";
import type { ProductId } from "@/config/products";

export function ProductRitualSection({
  productId,
  imageSrc,
}: {
  productId: ProductId;
  imageSrc: string;
}) {
  const ritual = productRitualByProductId[productId];
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!ritual) return null;

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden bg-white py-14 sm:py-18 lg:py-24 transition-all duration-1000 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Creative Image */}
          <div className="lg:col-span-5">
            <div className="group relative overflow-hidden rounded-[2.5rem] border-8 border-white bg-white shadow-2xl transition duration-500 hover:shadow-[0_25px_60px_rgba(58,24,32,0.18)]">
              <ProductPageImage
                src={imageSrc}
                alt={ritual.problem}
                className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </div>

          {/* Editorial Problem & Ritual Content */}
          <div className="flex flex-col justify-center gap-6 lg:col-span-7">
            <div className="space-y-3">
              <p className="text-xs font-bold tracking-[0.3em] text-velora-champagne-dark">
                {ritual.index}
              </p>
              <h2 className="text-2xl font-extrabold leading-[1.3] text-velora-burgundy-dark sm:text-3xl lg:text-4xl">
                {ritual.problem}
              </h2>
              <p className="text-base leading-[1.85] text-velora-burgundy/75 sm:text-lg">
                {ritual.problemCopy}
              </p>
            </div>

            {/* Solution connection card */}
            <div className="rounded-3xl border border-velora-burgundy/10 bg-velora-cream-dark p-6 sm:p-8 shadow-sm transition hover:border-velora-champagne/40">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-velora-champagne-dark">
                {ritual.solutionLabel}
              </p>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl font-extrabold text-velora-burgundy sm:text-2xl">
                  {ritual.productName}
                </h3>
                <span className="text-base font-extrabold tabular-nums text-velora-burgundy">
                  {ritual.priceLabel}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-velora-burgundy/65">
                {ritual.ingredient}
              </p>
            </div>

            {/* Bottom Ritual CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-velora-burgundy/8 bg-velora-burgundy/5 p-5">
              <div>
                <p className="font-extrabold text-velora-burgundy-dark">
                  {ritualCta.title}
                </p>
                <p className="text-xs text-velora-burgundy/65 mt-0.5">
                  {ritualCta.subtitle}
                </p>
              </div>
              <Link
                href={ritualCta.href}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-velora-burgundy px-6 py-3 text-xs font-extrabold text-velora-cream shadow transition hover:bg-velora-burgundy-light"
              >
                {ritualCta.button}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
