"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FooterSection } from "@/components/FooterSection";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductMobileStickyBar } from "@/components/product/ProductMobileStickyBar";
import { ProductPaymentMethodsInfo } from "@/components/product/ProductPaymentMethodsInfo";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { AttributionCaptureEffect } from "@/components/attribution/AttributionCaptureEffect";
import {
  WARM_TEE_DESCRIPTION_AR,
  WARM_TEE_IMAGE_SRC,
  WARM_TEE_NAME_AR,
  WARM_TEE_NAME_EN,
  WARM_TEE_PRICE_AED,
  WARM_TEE_SLUG,
  warmTeeCheckoutTotalAed,
} from "@/config/warmTeeProduct";
import { formatPrice } from "@/config/pricing";
import { trackSnapStartCheckout, trackSnapViewContent } from "@/lib/analytics/trackSnapCommerce";
import { buildCheckoutPaymentStepPath } from "@/lib/checkoutRoutes";
import { prefetchStripeCardCheckout } from "@/lib/stripeCheckoutPrefetch";

export function WarmTeeProductPageClient() {
  const router = useRouter();
  const [codTotal] = useState(() => warmTeeCheckoutTotalAed("cod"));

  useEffect(() => {
    trackSnapViewContent({ productSlug: WARM_TEE_SLUG, valueAed: WARM_TEE_PRICE_AED });
  }, []);

  function warmStripeCheckout() {
    void prefetchStripeCardCheckout({
      productSlug: WARM_TEE_SLUG,
      productName: WARM_TEE_NAME_AR,
      quantity: 1,
      eligibleUnits: 1,
    });
  }

  function goToCheckout() {
    trackSnapStartCheckout({
      productSlug: WARM_TEE_SLUG,
      quantity: 1,
      valueAed: WARM_TEE_PRICE_AED,
    });
    warmStripeCheckout();
    router.push(buildCheckoutPaymentStepPath({ product: WARM_TEE_SLUG, quantity: 1 }));
  }

  return (
    <>
      <AttributionCaptureEffect />
      <ProductStoreHeader />

      <main
        className="product-typography bg-velora-cream pb-24 lg:pb-12"
        style={{ ["--header-h" as string]: "3.5rem" }}
      >
        <div className="mx-auto max-w-lg px-4 py-6 sm:max-w-xl sm:px-6 lg:max-w-2xl lg:py-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
            <ProductGallery
              mainSrc={WARM_TEE_IMAGE_SRC}
              productName={WARM_TEE_NAME_AR}
              placeholder={WARM_TEE_NAME_AR}
              laraFrame
              fullWidthMobile
            />

            <div className="min-w-0 text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-velora-burgundy/55">
                {WARM_TEE_NAME_EN}
              </p>
              <h1 className="mt-1 text-2xl font-black leading-snug text-velora-burgundy-dark sm:text-3xl">
                {WARM_TEE_NAME_AR}
              </h1>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-velora-burgundy/85">
                {WARM_TEE_DESCRIPTION_AR}
              </p>
              <p className="mt-4 text-2xl font-black tabular-nums text-velora-burgundy-dark">
                {formatPrice(WARM_TEE_PRICE_AED)}
              </p>

              <div className="mt-6 space-y-4 rounded-2xl border border-velora-burgundy/10 bg-white p-4 shadow-sm">
                <p className="text-sm font-extrabold text-velora-burgundy-dark">الكمية</p>
                <p className="text-sm font-semibold text-velora-burgundy/80">قطعة واحدة</p>
                <ProductPaymentMethodsInfo quantity={1} />
                <button
                  type="button"
                  onClick={goToCheckout}
                  onMouseEnter={warmStripeCheckout}
                  onFocus={warmStripeCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#3a1820] to-[#2c1318] py-4 text-base font-black text-white shadow-[0_12px_32px_rgba(44,19,24,0.35)] transition hover:from-velora-burgundy hover:to-[#2c1318] active:scale-[0.99]"
                >
                  اطلب الآن — الدفع عند الاستلام أو بالبطاقة
                  <span className="text-lg" aria-hidden>←</span>
                </button>
                <p className="text-center text-[11px] font-semibold text-velora-burgundy/55">
                  الدفع عند الاستلام: {formatPrice(codTotal)} شامل رسوم التوصيل
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />

      <ProductMobileStickyBar
        ctaLabel="اطلب الآن"
        productSlug={WARM_TEE_SLUG}
        quantity={1}
        productName={WARM_TEE_NAME_AR}
        thumbnailSrc={WARM_TEE_IMAGE_SRC}
        priceAed={WARM_TEE_PRICE_AED}
      />
    </>
  );
}
