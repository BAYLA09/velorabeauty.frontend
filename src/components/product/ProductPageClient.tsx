"use client";

import { useEffect, useState } from "react";
import { trackSnapViewContent } from "@/lib/analytics/trackSnapCommerce";
import type { BundleQuantity } from "@/config/pricing";
import { FooterSection } from "@/components/FooterSection";
import { ProductAnnouncementBar } from "@/components/product/ProductAnnouncementBar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductFeaturePills } from "@/components/product/ProductFeaturePills";
import { ProductMobileStickyBar } from "@/components/product/ProductMobileStickyBar";
import { ProductPageLongSections } from "@/components/product/ProductPageLongSections";
import { ProductFinalCtaSection } from "@/components/product/ProductFinalCtaSection";
import {
  ProductPurchasePanel,
  type PurchaseState,
} from "@/components/product/ProductPurchasePanel";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { ProductTrustBar } from "@/components/product/ProductTrustBar";
import { ProductVideoStoriesStrip } from "@/components/product/ProductVideoStoriesStrip";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { cardBundlePrices, formatPrice, singleProductPrice } from "@/config/pricing";
import { uaeDeliveryWindowLabel } from "@/lib/delivery/uaeDeliveryWindow";
import { AttributionCaptureEffect } from "@/components/attribution/AttributionCaptureEffect";
import type { ProductWithPage } from "@/lib/productCatalog";
import { ProductGalleryBenefitLines } from "@/components/product/ProductGalleryBenefitLines";
import {
  getGalleryBenefitLines,
  getProductGalleryImageSrcs,
} from "@/lib/product/getProductGalleryImageSrcs";

type Props = {
  product: ProductWithPage;
  allProducts: ProductWithPage[];
};

export function ProductPageClient({ product, allProducts }: Props) {
  const [quantity, setQuantity] = useState<BundleQuantity>(2);
  const [purchase, setPurchase] = useState<PurchaseState | null>(null);
  const page = product.page;
  const unitLabel = page.form === "serum" ? "عبوة" : "علبة";
  const deliveryWindow = uaeDeliveryWindowLabel();
  const gallerySrcs = getProductGalleryImageSrcs(product.pageImage, product.image.src);
  const galleryBenefitLines = getGalleryBenefitLines(page);

  useEffect(() => {
    trackSnapViewContent({ productSlug: product.slug, valueAed: product.price });
  }, [product.slug, product.price]);

  const displayTotal = purchase?.total ?? cardBundlePrices[quantity];
  const stickyCtaLabel =
    purchase?.ctaLabel ?? "اطلبي الآن — الدفع عند الاستلام";

  return (
    <>
      <AttributionCaptureEffect />
      <ProductAnnouncementBar />
      <ProductStoreHeader />

      <main
        className="product-typography bg-velora-cream pb-24 lg:pb-20"
        style={{ ["--header-h" as string]: "3.5rem" }}
      >
        <div className="mx-auto max-w-lg px-4 py-4 sm:max-w-6xl sm:px-6 sm:py-6 lg:max-w-[1200px] lg:py-8">
          <section
            id="buy-box"
            className="scroll-mt-[var(--header-h)] sm:scroll-mt-[var(--header-h)]"
          >
            <header className="mb-4 text-right sm:mb-5 lg:mb-6">
              <h1 className="text-[1.35rem] font-black leading-[1.35] text-velora-burgundy-dark sm:text-[1.75rem] lg:text-[2rem] lg:leading-[1.28]">
                {page.headlineQuestion}
              </h1>
              <p className="mt-3 text-xs font-bold text-velora-burgundy/60 sm:mt-4">
                {deliveryWindow}
              </p>
            </header>

            <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
              <aside className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
                <div className="hidden lg:block">
                  <ProductGallery
                    mainSrc={product.pageImage.src}
                    gallerySrcs={gallerySrcs}
                    productName={product.name}
                    placeholder={product.pageImage.placeholder}
                    laraFrame
                  />
                  <ProductGalleryBenefitLines lines={galleryBenefitLines} />
                  <ProductFeaturePills form={page.form} />
                </div>
              </aside>

              <div className="min-w-0 flex-1">
                <div className="lg:hidden">
                  <ProductGallery
                    mainSrc={product.pageImage.src}
                    gallerySrcs={gallerySrcs}
                    productName={product.name}
                    placeholder={product.pageImage.placeholder}
                    laraFrame
                    fullWidthMobile
                  />
                  <ProductGalleryBenefitLines lines={galleryBenefitLines} />
                  <ProductFeaturePills form={page.form} />
                </div>

                <div className="mt-4 flex min-w-0 flex-col gap-3.5 sm:mt-0 sm:gap-4">
                  <p className="text-sm font-semibold tabular-nums text-velora-burgundy/75">
                    من {formatPrice(singleProductPrice)} / {unitLabel}
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
                    showTrustRow
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 border-t border-velora-burgundy/8 pt-6">
            <ProductVideoStoriesStrip productSlug={product.slug} />
            <div className="mt-6 sm:mt-8">
              <ProductTrustBar prominent />
            </div>
          </div>

          <ProductPageLongSections
            page={page}
            productId={product.id}
            productName={product.name}
            marketingSpotlight={product.pageImage.marketingSpotlight}
            formulaSectionImageSrc={product.pageImage.formulaSectionImageSrc}
            problemSectionImageSrc={
              product.pageImage.storySrc ?? product.pageImage.src
            }
          />

          <ProductFinalCtaSection
            form={page.form}
            productSlug={product.slug}
            productName={product.name}
            upsellSlotSrc={product.pageImage.upsellSlotSrc}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onPurchaseChange={setPurchase}
            headline="جاهزة تكملين طلبك؟"
          />

          <RelatedProducts currentSlug={product.slug} products={allProducts} />
        </div>
      </main>
      <FooterSection />

      <ProductMobileStickyBar
        ctaLabel={stickyCtaLabel}
        productSlug={product.slug}
        quantity={purchase?.quantity ?? quantity}
        productName={product.name}
        thumbnailSrc={product.pageImage.src ?? "/images/products/eye-serum.webp"}
        priceAed={displayTotal}
      />
    </>
  );
}
