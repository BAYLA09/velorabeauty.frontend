"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatPrice } from "@/config/pricing";
import type { BundleQuantity } from "@/config/pricing";

type Props = {
  ctaLabel: string;
  productSlug: string;
  quantity: BundleQuantity;
  productName: string;
  thumbnailSrc: string;
  priceAed: number;
};

function scrollToBuyBox() {
  const el = document.getElementById("buy-box");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Sticky CTA — mobile + desktop; visible when buy box and final CTA are off-screen */
export function ProductMobileStickyBar({
  ctaLabel,
  productName,
  thumbnailSrc,
  priceAed,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const buyBox = document.getElementById("buy-box");
    const finalCta = document.getElementById("final-cta");
    if (!buyBox) return;

    let buyVisible = true;
    let finalVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "buy-box") buyVisible = entry.isIntersecting;
          if (entry.target.id === "final-cta") finalVisible = entry.isIntersecting;
        }
        setVisible(!buyVisible && !finalVisible);
      },
      { root: null, rootMargin: "0px", threshold: 0.08 },
    );

    observer.observe(buyBox);
    if (finalCta) observer.observe(finalCta);

    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-velora-burgundy/10 bg-white/95 shadow-[0_-8px_30px_rgba(58,24,32,0.12)] backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      role="region"
      aria-label="اطلبي الآن"
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-3 py-3 sm:px-6">
        <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-velora-burgundy/10 bg-velora-cream">
            <Image
              src={thumbnailSrc}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-extrabold text-velora-burgundy-dark">{productName}</p>
            <p className="text-xs font-bold tabular-nums text-velora-burgundy/70">
              {formatPrice(priceAed)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={scrollToBuyBox}
          className="w-full rounded-2xl bg-[#2c1318] py-3.5 text-sm font-black text-white shadow-lg sm:max-w-xs sm:py-4 sm:text-base"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
