"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductPageImage } from "@/components/product/ProductPageImage";
import { productRitualSection } from "@/config/productRitualSection";
import type { ProductWithPage } from "@/lib/productCatalog";
import { getProductPath } from "@/lib/productCatalog";

function useInView(threshold = 0.12) {
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
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function RitualCard({
  card,
  product,
  imageSrc,
  isCurrent,
  reverse,
}: {
  card: (typeof productRitualSection.cards)[number];
  product: ProductWithPage;
  imageSrc: string;
  isCurrent: boolean;
  reverse: boolean;
}) {
  const { ref, visible } = useInView();

  return (
    <article
      ref={ref}
      className={`group transition-all duration-1000 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${isCurrent ? "ring-2 ring-velora-champagne/60 ring-offset-4 ring-offset-white" : ""}`}
    >
      <div
        className={`overflow-hidden rounded-[2rem] border border-velora-burgundy/10 bg-white shadow-[0_20px_60px_rgba(58,24,32,0.08)] transition-shadow duration-500 group-hover:shadow-[0_28px_80px_rgba(58,24,32,0.14)]`}
      >
        <div
          className={`grid lg:grid-cols-2 lg:min-h-[min(28rem,70vh)] ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
        >
          <div className="relative min-h-[18rem] overflow-hidden sm:min-h-[22rem] lg:min-h-full">
            <ProductPageImage
              src={imageSrc}
              alt={card.problem}
              className="h-full w-full min-h-[18rem] object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04] sm:min-h-[22rem] lg:min-h-full lg:object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-velora-burgundy/75 via-velora-burgundy/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90"
              aria-hidden
            />
            <div className="absolute bottom-0 start-0 end-0 p-6 text-velora-cream lg:hidden">
              <p className="text-[11px] font-bold tracking-[0.3em] text-velora-champagne">
                {card.index} — {card.categoryLabel}
              </p>
              <p className="mt-2 text-xl font-extrabold leading-snug">{card.problem}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-12">
            <p className="hidden text-[11px] font-bold tracking-[0.35em] text-velora-champagne-dark lg:block">
              {card.index} — {card.categoryLabel}
            </p>
            <h3 className="hidden text-2xl font-extrabold leading-snug text-velora-burgundy-dark sm:text-3xl lg:block">
              {card.problem}
            </h3>
            <p className="text-base leading-[1.85] text-velora-burgundy/75 sm:text-lg">{card.problemCopy}</p>

            <div className="mt-2 overflow-hidden rounded-2xl border border-velora-burgundy/10 bg-velora-cream-dark/80 p-5 transition-all duration-500 group-hover:border-velora-champagne/45 group-hover:bg-velora-cream">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-velora-burgundy/45 transition-colors group-hover:text-velora-champagne-dark">
                خطوة من طقس فيلورا
              </p>
              <p className="mt-3 translate-y-1 text-lg font-extrabold text-velora-burgundy-dark opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {product.name}
              </p>
              <p className="mt-1 text-sm font-semibold text-velora-burgundy/65">{product.ingredient}</p>
              <p className="mt-3 text-sm font-bold tabular-nums text-velora-burgundy">{product.priceLabel}</p>
              <Link
                href={getProductPath(product.slug)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-velora-burgundy transition-colors hover:text-velora-burgundy-light"
              >
                <span className="border-b border-velora-champagne/80 pb-0.5">اكتشفي هذا المنتج</span>
                <span aria-hidden className="text-velora-champagne">
                  ←
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductRitualSection({
  products,
  currentSlug,
}: {
  products: ProductWithPage[];
  currentSlug: string;
}) {
  const { ref: headerRef, visible: headerVisible } = useInView(0.2);
  const byId = Object.fromEntries(products.map((p) => [p.id, p])) as Record<
    ProductWithPage["id"],
    ProductWithPage
  >;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-velora-cream-dark to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <header
          ref={headerRef}
          className={`mx-auto max-w-3xl text-center transition-all duration-1000 ease-out ${
            headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-[11px] font-bold tracking-[0.35em] text-velora-champagne-dark">
            {productRitualSection.eyebrow}
          </p>
          <h2 className="mt-5 text-2xl font-extrabold leading-[1.45] text-velora-burgundy-dark sm:text-3xl lg:text-4xl">
            {productRitualSection.headline}
          </h2>
          <p className="mt-6 text-base leading-[1.9] text-velora-burgundy/70 sm:text-lg">
            {productRitualSection.intro}
          </p>
        </header>

        <div className="mt-14 space-y-10 sm:mt-16 sm:space-y-14 lg:space-y-20">
          {productRitualSection.cards.map((card, i) => {
            const product = byId[card.id];
            if (!product) return null;
            const imageSrc = product.pageImage.storySrc ?? product.pageImage.src;
            return (
              <RitualCard
                key={card.id}
                card={card}
                product={product}
                imageSrc={imageSrc}
                isCurrent={product.slug === currentSlug}
                reverse={i % 2 === 1}
              />
            );
          })}
        </div>

        <div className="mt-16 text-center sm:mt-20">
          <p className="text-xl font-extrabold text-velora-burgundy-dark sm:text-2xl">
            {productRitualSection.ctaTitle}
          </p>
          <Link
            href={productRitualSection.ctaHref}
            className="mt-8 inline-flex rounded-full bg-velora-burgundy px-10 py-4 text-sm font-extrabold text-velora-cream shadow-lg transition hover:bg-velora-burgundy-light hover:shadow-xl"
          >
            {productRitualSection.ctaButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
