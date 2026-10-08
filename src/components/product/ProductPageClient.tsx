"use client";

import { useState } from "react";
import type { BundleQuantity } from "@/config/pricing";
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
import { ProductVideoStoriesStrip } from "@/components/product/ProductVideoStoriesStrip";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { cardBundlePrices, formatPrice, singleProductPrice } from "@/config/pricing";
import type { ProductWithPage } from "@/lib/productCatalog";

type Props = {
  product: ProductWithPage;
  allProducts: ProductWithPage[];
};

export function ProductPageClient({ product, allProducts }: Props) {
  const [quantity, setQuantity] = useState<BundleQuantity>(2);
  const [purchase, setPurchase] = useState<PurchaseState | null>(null);
  const page = product.page;
  const unitLabel = page.form === "serum" ? "عبوة" : "علبة";

  return (
    <>
      <ProductAnnouncementBar />
      <ProductStoreHeader />

      <main className="product-typography bg-velora-cream pb-24 lg:pb-0">
        <div className="mx-auto flex max-w-lg items-start gap-8 px-4 py-4 sm:max-w-6xl sm:px-6 sm:py-6 lg:max-w-7xl lg:py-8">
          <aside className="hidden w-[min(100%,340px)] shrink-0 lg:block xl:w-[360px]">
            <div className="sticky top-20 z-20">
              <ProductGallery
                mainSrc={product.pageImage.src}
                productName={product.name}
                placeholder={product.pageImage.placeholder}
                laraFrame
              />
              <ProductFeaturePills form={page.form} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
        <section
          id="purchase"
          className="scroll-mt-24"
        >
          <div id="pdp-hero-gallery" className="grid items-start gap-6 lg:block">
            <div className="min-w-0 w-full lg:hidden">
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

              <p className="text-sm font-semibold text-velora-burgundy/75">
                من {formatPrice(singleProductPrice)} / {unitLabel} · {page.urgencyLine}
              </p>

              <ProductPurchasePanel
                funnelOffers
                form={page.form}
                productSlug={product.slug}
                upsellSlotSrc={product.pageImage.upsellSlotSrc}
                productName={product.name}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onChange={setPurchase}
              />

              <ProductVideoStoriesStrip compact />

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
          productId={product.id}
          productName={product.name}
          marketingSpotlight={product.pageImage.marketingSpotlight}
          formulaSectionImageSrc={product.pageImage.formulaSectionImageSrc}
          timelineSectionImageSrc={product.pageImage.timelineSectionImageSrc}
        />

        <RelatedProducts currentSlug={product.slug} products={allProducts} />
          </div>
        </div>

      </main>
      <FooterSection />

      <ProductMobileStickyBar
        ctaLabel={
          purchase?.ctaLabel ??
          `اطلبي الآن — ${formatPrice(cardBundlePrices[quantity])}`
        }
        productSlug={product.slug}
        quantity={purchase?.quantity ?? quantity}
      />
    </>
  );
}
