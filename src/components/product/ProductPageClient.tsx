"use client";

import { useState } from "react";
import { FooterSection } from "@/components/FooterSection";
import { ProductAnnouncementBar } from "@/components/product/ProductAnnouncementBar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPageLongSections } from "@/components/product/ProductPageLongSections";
import {
  ProductPurchasePanel,
  type PurchaseState,
} from "@/components/product/ProductPurchasePanel";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { formatPrice, singleProductPrice } from "@/config/pricing";
import type { ProductWithPage } from "@/lib/productCatalog";

type Props = {
  product: ProductWithPage;
  allProducts: ProductWithPage[];
};

export function ProductPageClient({ product, allProducts }: Props) {
  const [purchase, setPurchase] = useState<PurchaseState | null>(null);
  const page = product.page;

  return (
    <>
      <ProductAnnouncementBar />
      <ProductStoreHeader />
      <main className="bg-white pb-24 md:pb-0">
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductGallery
              mainSrc={product.image.src}
              productName={product.name}
              placeholders={page.galleryPlaceholders}
              laraFrame
            />

            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {page.statChips.map((chip) => (
                  <div
                    key={chip.label}
                    className="rounded-xl border border-velora-burgundy/10 bg-white px-2 py-2.5 text-center shadow-sm"
                  >
                    <p className="text-base font-extrabold tabular-nums text-velora-burgundy sm:text-lg">
                      {chip.value}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium leading-tight text-velora-burgundy/55">
                      {chip.label}
                    </p>
                  </div>
                ))}
              </div>

              <h1 className="text-2xl font-extrabold leading-[1.15] text-velora-burgundy sm:text-3xl lg:text-[2rem]">
                {page.headlineQuestion}
              </h1>
              <p className="text-sm leading-relaxed text-velora-burgundy/65 sm:text-base">{page.subhook}</p>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <div className="flex gap-0.5 text-velora-champagne/50" aria-hidden>
                  ★★★★★
                </div>
                <span className="text-xs text-velora-burgundy/45">{page.ratingPlaceholder}</span>
                <span className="text-velora-burgundy/30" aria-hidden>
                  ·
                </span>
                <span className="font-extrabold text-velora-burgundy">
                  من {formatPrice(singleProductPrice)} / منتج
                </span>
              </div>

              <p className="rounded-xl border border-velora-champagne/40 bg-velora-cream-dark px-3 py-2.5 text-xs font-bold leading-relaxed text-velora-burgundy sm:text-sm">
                {page.urgencyLine}
              </p>

              <ProductPurchasePanel form={page.form} onChange={setPurchase} />
            </div>
          </div>
        </section>

        <ProductPageLongSections page={page} productImageSrc={product.image.src} />
        <RelatedProducts currentSlug={product.slug} products={allProducts} />
      </main>
      <FooterSection />

      {purchase && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-velora-burgundy/10 bg-white p-3 shadow-[0_-8px_30px_rgba(58,24,32,0.12)] md:hidden">
          <button
            type="button"
            className="w-full rounded-full bg-velora-burgundy py-3.5 text-sm font-extrabold text-velora-cream"
          >
            {purchase.ctaLabel}
          </button>
        </div>
      )}
    </>
  );
}
