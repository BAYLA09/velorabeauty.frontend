"use client";

import { useState } from "react";
import type { BundleQuantity, PaymentMethod } from "@/config/pricing";
import { ProductCheckoutSection } from "@/components/product/ProductCheckoutSection";
import { FooterSection } from "@/components/FooterSection";
import { ProductAnnouncementBar } from "@/components/product/ProductAnnouncementBar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductFeaturePills } from "@/components/product/ProductFeaturePills";
import { ProductMobileStickyBar } from "@/components/product/ProductMobileStickyBar";
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
  const [quantity, setQuantity] = useState<BundleQuantity>(2);
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [purchase, setPurchase] = useState<PurchaseState | null>(null);
  const page = product.page;
  const unitLabel = page.form === "serum" ? "عبوة" : "علبة";

  return (
    <>
      <ProductAnnouncementBar />
      <ProductStoreHeader />

      <main className="product-typography bg-velora-cream pb-[9.5rem] md:pb-0">
        <section className="mx-auto max-w-lg px-4 py-4 sm:max-w-6xl sm:px-6 sm:py-6 lg:py-8">
          <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="min-w-0 w-full lg:sticky lg:top-4">
              <ProductGallery
                mainSrc={product.pageImage.src}
                productName={product.name}
                placeholder={product.pageImage.placeholder}
                laraFrame
                fullWidthMobile
              />
              <ProductFeaturePills form={page.form} />
            </div>

            <div className="flex min-w-0 flex-col gap-3.5 sm:gap-4">
              <header>
                <h1 className="text-[1.35rem] font-black leading-[1.35] text-velora-burgundy-dark sm:text-[1.75rem] lg:text-[2rem] lg:leading-[1.28]">
                  {page.headlineQuestion}
                </h1>
                <p className="mt-2.5 text-[15px] font-medium leading-[1.85] text-velora-burgundy/85 sm:mt-3 sm:text-base">
                  {page.subhook}
                </p>
              </header>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-velora-burgundy-dark">
                <span className="text-base tracking-wide text-amber-500" aria-hidden>
                  ★★★★★
                </span>
                <span className="font-bold text-velora-burgundy/55">{page.ratingPlaceholder}</span>
                <span className="text-velora-burgundy/30" aria-hidden>
                  ·
                </span>
                <span className="font-extrabold">
                  من {formatPrice(singleProductPrice)} / {unitLabel}
                </span>
              </div>

              <div className="rounded-full border border-rose-200/80 bg-rose-50/90 px-4 py-2.5 text-center text-xs font-bold leading-snug text-rose-900 sm:text-sm">
                كمية محدودة هذا الأسبوع — اطلبي قبل نفاد المخزون
              </div>

              <ProductPurchasePanel
                funnelOffers
                form={page.form}
                upsellSlotSrc={product.pageImage.upsellSlotSrc}
                productName={product.name}
                quantity={quantity}
                method={method}
                onQuantityChange={setQuantity}
                onMethodChange={setMethod}
                onChange={setPurchase}
              />

              <ProductTrustBar prominent />
            </div>
          </div>
        </section>

        <ProductRitualSection
          productId={product.id}
          imageSrc={product.pageImage.storySrc ?? product.pageImage.src}
        />

        <ProductPageLongSections
          page={page}
          productName={product.name}
          marketingGallery={product.pageImage.marketingGallery}
        />

        <ProductCheckoutSection
          productSlug={product.slug}
          productName={product.name}
          quantity={quantity}
          method={method}
          onMethodChange={setMethod}
        />

        <RelatedProducts currentSlug={product.slug} products={allProducts} />
      </main>
      <FooterSection />

      {purchase && <ProductMobileStickyBar ctaLabel={purchase.ctaLabel} />}
    </>
  );
}
