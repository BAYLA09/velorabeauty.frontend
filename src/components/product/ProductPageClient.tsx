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
import { ProductRitualSection } from "@/components/product/ProductRitualSection";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { ProductTrustBar } from "@/components/product/ProductTrustBar";
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
      <ProductTrustBar />

      <main className="bg-velora-cream pb-24 md:pb-0">
        {/* Nama-style: gallery → pills → copy → offers (mobile stack) */}
        <section className="mx-auto max-w-lg px-4 py-5 sm:max-w-6xl sm:px-6 sm:py-8 lg:py-10">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0 w-full">
              <ProductGallery
                mainSrc={product.pageImage.src}
                productName={product.name}
                placeholder={product.pageImage.placeholder}
                laraFrame
                fullWidthMobile
              />
              <ProductFeaturePills form={page.form} />
            </div>

            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
              <h1 className="text-[1.35rem] font-black leading-[1.35] text-velora-burgundy-dark sm:text-3xl lg:text-[2rem] lg:leading-[1.3]">
                {page.headlineQuestion}
              </h1>

              <p className="text-[15px] font-medium leading-[1.85] text-velora-burgundy/85 sm:text-base">
                {page.subhook}
              </p>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-velora-burgundy-dark">
                <span className="text-base tracking-wide text-amber-500" aria-hidden>
                  ★★★★★
                </span>
                <span className="font-bold text-velora-burgundy/55">{page.ratingPlaceholder}</span>
                <span className="text-velora-burgundy/30" aria-hidden>
                  ·
                </span>
                <span className="font-extrabold">
                  من {formatPrice(singleProductPrice)} / {page.form === "serum" ? "عبوة" : "علبة"}
                </span>
              </div>

              <div className="rounded-full border border-rose-200/80 bg-rose-50/90 px-4 py-2.5 text-xs font-bold leading-snug text-rose-900 sm:text-sm">
                آخر 48 ساعة على عرض الشحن المجاني هذا الأسبوع
              </div>

              <ProductPurchasePanel
                form={page.form}
                productImageSrc={product.image.src}
                productName={product.name}
                onChange={setPurchase}
              />
            </div>
          </div>
        </section>

        {/* Nama: problem photo + overlay bar (scroll) */}
        <ProductRitualSection
          productId={product.id}
          imageSrc={product.pageImage.storySrc ?? product.pageImage.src}
        />

        <ProductPageLongSections page={page} />
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
