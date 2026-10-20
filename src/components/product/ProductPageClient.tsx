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
  ProductPageFormulaMarketing,
  ProductPagePainNarrative,
  ProductPagePdpTail,
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
  getGalleryBenefitLines,
  getProductPdpScrollImages,
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
  const scrollImages = getProductPdpScrollImages(product.pageImage, product.image.src);
  const galleryBenefitLines = getGalleryBenefitLines(page);

  useEffect(() => {
    trackSnapViewContent({ productSlug: product.slug, valueAed: product.price });
  }, [product.slug, product.price]);

  const displayTotal = purchase?.total ?? cardBundlePrices[quantity];
  const stickyCtaLabel = purchase?.ctaLabel ?? "اطلبي الآن — الدفع عند الاستلام";

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
          {scrollImages.beforeAfter ? (
            <ProductPdpStackedImage
              src={scrollImages.beforeAfter}
              alt={`${product.name} — قبل وبعد`}
              priority
            />
          ) : null}

          <section
            id="buy-box"
            className="scroll-mt-[var(--header-h)] py-5 sm:py-6"
          >
            <header className="mb-4 text-right">
              <h1 className="text-[1.35rem] font-black leading-[1.35] text-velora-burgundy-dark sm:text-[1.75rem] lg:text-[2rem] lg:leading-[1.28]">
                {page.headlineQuestion}
              </h1>
            </header>

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

          {scrollImages.problem ? (
            <div className="py-4 sm:py-5">
              <ProductPdpStackedImage
                src={scrollImages.problem}
                alt={`${product.name} — التحدي اليومي`}
              />
            </div>
          ) : null}

          <div className="space-y-4 py-4 sm:py-5">
            <ProductGalleryBenefitLines lines={galleryBenefitLines} />
            <ProductFeaturePills form={page.form} />
          </div>

          <ProductPagePainNarrative page={page} />
          <ProductPageFormulaMarketing page={page} />

          {scrollImages.productMain ? (
            <div className="py-4 sm:py-5">
              <ProductPdpStackedImage
                src={scrollImages.productMain}
                alt={`${product.name} — المنتج`}
              />
            </div>
          ) : null}

          <ProductPageUsageAndResults page={page} />

          {scrollImages.storyOrFormula ? (
            <div className="py-4 sm:py-5">
              <ProductPdpStackedImage
                src={scrollImages.storyOrFormula}
                alt={`${product.name} — التركيبة والروتين`}
              />
            </div>
          ) : null}

          <ProductPageComparisonSection page={page} />

          {scrollImages.fourth ? (
            <div className="py-4 sm:py-5">
              <ProductPdpStackedImage
                src={scrollImages.fourth}
                alt={`${product.name} — فيلورا`}
              />
            </div>
          ) : null}

          <ProductVeloraGuaranteeBlock page={page} variant="section" />

          <div className="mt-8 border-t border-velora-burgundy/8 pt-6">
            <ProductVideoStoriesStrip productSlug={product.slug} />
          </div>

          <ProductPagePdpTail page={page} productId={product.id} />

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
