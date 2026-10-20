"use client";

import Image from "next/image";
import Link from "next/link";
import { AttributionCaptureEffect } from "@/components/attribution/AttributionCaptureEffect";
import { brand } from "@/config/brand";
import type { ProductWithPage } from "@/lib/productCatalog";
import { getProductPath } from "@/lib/productCatalog";

type Props = {
  product: ProductWithPage;
  /** Packshot / clean product image for ad creatives */
  heroImageSrc: string;
};

export function SnapProductAdLanding({ product, heroImageSrc }: Props) {
  const buyHref = getProductPath(product.slug);

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
              alt={product.name}
              fill
              priority
              sizes="(max-width: 480px) 90vw, 320px"
              className="object-contain"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-medium text-velora-burgundy/55">{product.ingredient}</p>
            <h1 className="mt-2 font-[family-name:var(--font-el-messiri)] text-3xl font-bold leading-snug text-velora-burgundy">
              {product.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-velora-burgundy/75">{product.description}</p>
            <p className="mt-5 text-2xl font-semibold tabular-nums text-velora-burgundy">
              {product.priceLabel}
            </p>
          </div>

          <div className="mt-auto pt-10">
            <Link
              href={buyHref}
              className="flex w-full items-center justify-center rounded-full bg-velora-burgundy px-6 py-4 text-lg font-semibold text-velora-cream shadow-sm transition hover:bg-velora-burgundy-light"
            >
              {product.cta}
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
