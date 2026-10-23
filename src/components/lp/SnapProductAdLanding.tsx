"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AttributionCaptureEffect } from "@/components/attribution/AttributionCaptureEffect";
import { brand } from "@/config/brand";
import { getProductPath } from "@/lib/productCatalog";
import { trackSnapViewContent } from "@/lib/analytics/trackSnapCommerce";

export type SnapLpDisplayOverride = {
  heroImageAlt: string;
  ingredientLine: string;
  headline: string;
  body: string;
};

type Props = {
  productSlug: string;
  priceLabel: string;
  cta: string;
  heroImageSrc: string;
  /** Catalog copy for hair / eye snap LPs (omit when `snapDisplayOverride` is set). */
  catalogDisplay?: SnapLpDisplayOverride;
  /** Compliance copy for `/lp/snap/skin-gummies` only. */
  snapDisplayOverride?: SnapLpDisplayOverride;
  /** When set, fires Snap VIEW_CONTENT once on mount (hair-gummies LP only). */
  viewContentValueAed?: number;
};

export function SnapProductAdLanding({
  productSlug,
  priceLabel,
  cta,
  heroImageSrc,
  catalogDisplay,
  snapDisplayOverride,
  viewContentValueAed,
}: Props) {
  useEffect(() => {
    if (viewContentValueAed === undefined) return;
    trackSnapViewContent({ productSlug, valueAed: viewContentValueAed });
  }, [productSlug, viewContentValueAed]);

  const buyHref = getProductPath(productSlug);
  const display = snapDisplayOverride ?? catalogDisplay;
  if (!display) {
    throw new Error("SnapProductAdLanding requires catalogDisplay or snapDisplayOverride");
  }

  return (
    <>
      <AttributionCaptureEffect />
      <div className="flex min-h-screen flex-col bg-white text-velora-burgundy-dark">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-burgundy/45">
            {brand.nameAr}
          </p>

          <div className="relative mx-auto mt-8 aspect-square w-full max-w-[320px]">
            <Image
              src={heroImageSrc}
              alt={display.heroImageAlt}
              fill
              priority
              sizes="(max-width: 480px) 90vw, 320px"
              className="object-contain"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-medium text-velora-burgundy/55">{display.ingredientLine}</p>
            <h1 className="mt-2 font-[family-name:var(--font-el-messiri)] text-3xl font-bold leading-snug text-velora-burgundy">
              {display.headline}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-velora-burgundy/75">{display.body}</p>
            <p className="mt-5 text-2xl font-semibold tabular-nums text-velora-burgundy">
              {priceLabel}
            </p>
          </div>

          <div className="mt-auto pt-10">
            <Link
              href={buyHref}
              className="flex w-full items-center justify-center rounded-full bg-velora-burgundy px-6 py-4 text-lg font-semibold text-velora-cream shadow-sm transition hover:bg-velora-burgundy-light"
            >
              {cta}
            </Link>
            <p className="mt-4 text-center text-xs text-velora-burgundy/50">
              توصيل داخل {brand.country} · دفع عند الاستلام أو بالبطاقة
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
