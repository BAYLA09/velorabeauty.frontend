"use client";

import { useState } from "react";
import { FooterSection } from "@/components/FooterSection";
import { ProductAnnouncementBar } from "@/components/product/ProductAnnouncementBar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductFeaturePills } from "@/components/product/ProductFeaturePills";
import { ProductPageLongSections } from "@/components/product/ProductPageLongSections";
import {
  ProductPurchasePanel,
  type PurchaseState,
} from "@/components/product/ProductPurchasePanel";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { ProductTrustBar } from "@/components/product/ProductTrustBar";
import { RelatedProducts } from "@/components/product/RelatedProducts";
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
      <ProductTrustBar />

      <main className="bg-velora-cream pb-24 md:pb-0">
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Visual Column (Photo + 4 Specs Pills) */}
            <div className="min-w-0 w-full">
              <ProductGallery
                mainSrc={product.pageImage.src}
                productName={product.name}
                placeholder={product.pageImage.placeholder}
                laraFrame
              />
              <ProductFeaturePills form={page.form} />
            </div>

            {/* Product Details & Purchase Column */}
            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
              {/* Main Headline (Nama Beauty Style) */}
              <h1 className="text-2xl font-black leading-[1.3] text-velora-burgundy-dark sm:text-3xl lg:text-4xl">
                {page.headlineQuestion}
              </h1>

              {/* Subhook with accent line */}
              <div className="border-r-4 border-velora-champagne pr-3.5 py-1">
                <p className="text-base font-medium leading-[1.8] text-velora-burgundy/85 sm:text-lg">
                  {page.subhook}
                </p>
              </div>

              {/* Social Proof Rating */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base font-bold text-velora-burgundy-dark">
                <span className="text-lg tracking-wider text-amber-500" aria-hidden>
                  ★★★★★
                </span>
                <span className="font-extrabold">4.9</span>
                <span className="text-velora-burgundy/60 font-semibold">
                  (487 تقييم · مؤكدة)
                </span>
                <span className="text-velora-burgundy/30">·</span>
                <span className="text-velora-burgundy/80 font-bold">
                  من 199 د.إ / علبة
                </span>
              </div>

              {/* Urgency Pill */}
              <div className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-black text-rose-800 shadow-sm sm:text-sm">
                <span aria-hidden>🔥</span>
                <span>آخر 48 ساعة على عرض الشحن المجاني هذا الأسبوع</span>
              </div>

              {/* Offer Selector & CTA */}
              <ProductPurchasePanel form={page.form} onChange={setPurchase} />
            </div>
          </div>
        </section>

        <ProductPageLongSections
          page={page}
          product={product}
        />
        <RelatedProducts currentSlug={product.slug} products={allProducts} />
      </main>
      <FooterSection />

      {purchase && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-velora-burgundy/10 bg-white p-3 shadow-[0_-8px_30px_rgba(58,24,32,0.12)] md:hidden">
          <button
            type="button"
            onClick={() => {
              const checkoutEl = document.getElementById("checkout");
              if (checkoutEl) {
                checkoutEl.scrollIntoView({ behavior: "smooth" });
              } else {
                window.location.href = "/#checkout";
              }
            }}
            className="w-full rounded-2xl bg-[#2c1318] py-4 text-base font-extrabold text-white shadow-lg"
          >
            {purchase.ctaLabel}
          </button>
        </div>
      )}
    </>
  );
}
