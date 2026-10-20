"use client";

import { useEffect, useState } from "react";
import { trackSnapViewContent } from "@/lib/analytics/trackSnapCommerce";
import type { BundleQuantity } from "@/config/pricing";
import { FooterSection } from "@/components/FooterSection";
import { ProductAnnouncementBar } from "@/components/product/ProductAnnouncementBar";
import { ProductFeaturePills } from "@/components/product/ProductFeaturePills";
import { ProductMobileStickyBar } from "@/components/product/ProductMobileStickyBar";
import {
  ProductPageComparisonSection,
  ProductPageDeliveryAndFaq,
  ProductPageFormulaMarketing,
  ProductPagePainNarrative,
  ProductPageTestimonials,
  ProductPageUsageAndResults,
} from "@/components/product/ProductPageLongSections";
import { ProductFinalCtaSection } from "@/components/product/ProductFinalCtaSection";
import {
  ProductPurchasePanel,
  type PurchaseState,
} from "@/components/product/ProductPurchasePanel";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { ProductVeloraGuaranteeBlock } from "@/components/product/ProductVeloraGuaranteeBlock";
import { ProductVideoStoriesStrip } from "@/components/product/ProductVideoStoriesStrip";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductPdpStackedImage } from "@/components/product/ProductPdpStackedImage";
import { cardBundlePrices, formatPrice, singleProductPrice } from "@/config/pricing";
import { AttributionCaptureEffect } from "@/components/attribution/AttributionCaptureEffect";
import type { ProductWithPage } from "@/lib/productCatalog";
import { ProductGalleryBenefitLines } from "@/components/product/ProductGalleryBenefitLines";
import {
  HAIR_GUMMIES_BACKORDER_CTA_LABEL,
  isHairGummiesBackorderReservation,
} from "@/config/hairGummiesBackorder";
import { HairGummiesBackorderNotice } from "@/components/product/HairGummiesBackorderNotice";
import {
  getGalleryBenefitLines,
  getProductPdpScrollImages,
} from "@/lib/product/getProductGalleryImageSrcs";

type Props = {
  product: ProductWithPage;
  allProducts: ProductWithPage[];
};

/**
 * Mobile PDP order aligned with larabeauty.store funnel (magnesium-sleep reference):
 * hero → subhook/benefits/pills → buy box → videos → images interleaved with copy → guarantee → delivery/FAQ.
 */
export function ProductPageClient({ product, allProducts }: Props) {
  const [quantity, setQuantity] = useState<BundleQuantity>(2);
  const [purchase, setPurchase] = useState<PurchaseState | null>(null);
  const page = product.page;
  const unitLabel = page.form === "serum" ? "عبوة" : "علبة";
  const scrollImages = getProductPdpScrollImages(product.pageImage, product.image.src);
  const galleryBenefitLines = getGalleryBenefitLines(page);

  useEffect(() => {
    trackSnapViewContent({ productSlug: product.slug, valueAed: product.price });
  }, [product.slug, product.price]);

  const displayTotal = purchase?.total ?? cardBundlePrices[quantity];
  const stickyCtaLabel =
    purchase?.ctaLabel ??
    (isHairGummiesBackorderReservation(product.slug)
      ? HAIR_GUMMIES_BACKORDER_CTA_LABEL
      : "اطلبي الآن — الدفع عند الاستلام");

  return (
    <>
      <AttributionCaptureEffect />
      <ProductAnnouncementBar />
      <ProductStoreHeader />

      <main
        className="product-typography bg-velora-cream pb-24 lg:pb-20"
        style={{ ["--header-h" as string]: "3.5rem" }}
      >
        <div className="mx-auto max-w-lg px-4 py-4 sm:max-w-3xl sm:px-6 sm:py-6 lg:max-w-[720px] lg:py-8">
          <header className="scroll-mt-[var(--header-h)] mb-4 text-right sm:mb-5">
            <h1 className="text-[1.35rem] font-black leading-[1.35] text-velora-burgundy-dark sm:text-[1.75rem] lg:text-[2rem] lg:leading-[1.28]">
              {page.headlineQuestion}
            </h1>
          </header>

          {scrollImages.beforeAfter ? (
            <ProductPdpStackedImage
              src={scrollImages.beforeAfter}
              alt={`${product.name} — قبل وبعد`}
              priority
            />
          ) : null}

          <div className="space-y-4 py-4 sm:py-5">
            <ProductGalleryBenefitLines lines={galleryBenefitLines} />
            <ProductFeaturePills form={page.form} />
          </div>

          <section id="buy-box" className="py-5 sm:py-6">
            {isHairGummiesBackorderReservation(product.slug) ? (
              <HairGummiesBackorderNotice className="mb-4" />
            ) : null}
            <p className="mb-4 text-sm font-semibold tabular-nums text-velora-burgundy/75">
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
          </section>

          <div className="mt-2 border-t border-velora-burgundy/8 pt-6">
            <ProductVideoStoriesStrip productSlug={product.slug} />
          </div>

          {scrollImages.problem ? (
            <div className="py-4 sm:py-5">
              <ProductPdpStackedImage
                src={scrollImages.problem}
                alt={`${product.name} — التحدي اليومي`}
              />
            </div>
          ) : null}

          <ProductPagePainNarrative page={page} />
          <ProductPageFormulaMarketing page={page} />

          {scrollImages.timeline ? (
            <div className="py-4 sm:py-5">
              <ProductPdpStackedImage
                src={scrollImages.timeline}
                alt={`${product.name} — المنتج`}
              />
            </div>
          ) : null}

          <ProductPageUsageAndResults page={page} />

          <ProductPageTestimonials page={page} productId={product.id} />
          <ProductPageComparisonSection page={page} />

          {scrollImages.formula ? (
            <div className="py-4 sm:py-5">
              <ProductPdpStackedImage
                src={scrollImages.formula}
                alt={`${product.name} — التركيبة والروتين`}
              />
            </div>
          ) : null}

          <ProductVeloraGuaranteeBlock page={page} variant="section" />
          <ProductPageDeliveryAndFaq page={page} />

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
