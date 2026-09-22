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
      <main className="bg-velora-cream pb-24 md:pb-0">
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
            <ProductGallery
              mainSrc={product.pageImage.src}
              productName={product.name}
              placeholder={product.pageImage.placeholder}
              laraFrame
            />

            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {page.statChips.map((chip) => (
                  <div
                    key={chip.label}
                    className="rounded-xl border border-velora-burgundy/12 bg-white px-2 py-3 text-center shadow-sm"
                  >
                    <p className="text-lg font-extrabold tabular-nums leading-none text-velora-burgundy-dark sm:text-xl">
                      {chip.value}
                    </p>
                    <p className="mt-1.5 text-[11px] font-bold leading-snug text-velora-burgundy/75 sm:text-xs">
                      {chip.label}
                    </p>
                  </div>
                ))}
              </div>

              <h1 className="text-[1.65rem] font-extrabold leading-[1.25] text-velora-burgundy-dark sm:text-4xl sm:leading-[1.2]">
                {page.headlineQuestion}
              </h1>
              <p className="text-base font-medium leading-[1.75] text-velora-burgundy/90 sm:text-lg">
                {page.subhook}
              </p>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base">
                <div className="flex gap-0.5 text-velora-champagne" aria-hidden>
                  ★★★★★
                </div>
                <span className="font-medium text-velora-burgundy/70">{page.ratingPlaceholder}</span>
                <span className="text-velora-burgundy/35" aria-hidden>
                  ·
                </span>
                <span className="font-extrabold text-velora-burgundy-dark">
                  من {formatPrice(singleProductPrice)} / منتج
                </span>
              </div>

              <p className="rounded-xl border border-velora-champagne/50 bg-white px-3.5 py-3 text-sm font-bold leading-relaxed text-velora-burgundy-dark sm:text-[15px]">
                {page.urgencyLine}
              </p>

              <ProductPurchasePanel form={page.form} onChange={setPurchase} />
            </div>
          </div>
        </section>

        <ProductPageLongSections page={page} productImageSrc={product.pageImage.src} />
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
