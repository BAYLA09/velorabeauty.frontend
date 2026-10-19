"use client";

import type { BundleQuantity } from "@/config/pricing";
import type { ProductForm } from "@/config/productPages";
import { uaeDeliveryWindowLabel } from "@/lib/delivery/uaeDeliveryWindow";
import {
  ProductPurchasePanel,
  type PurchaseState,
} from "@/components/product/ProductPurchasePanel";

type Props = {
  form: ProductForm;
  productSlug: string;
  productName: string;
  upsellSlotSrc?: Partial<Record<BundleQuantity, string>>;
  quantity: BundleQuantity;
  onQuantityChange: (q: BundleQuantity) => void;
  onPurchaseChange: (state: PurchaseState) => void;
  headline: string;
};

export function ProductFinalCtaSection({
  form,
  productSlug,
  productName,
  upsellSlotSrc,
  quantity,
  onQuantityChange,
  onPurchaseChange,
  headline,
}: Props) {
  const deliveryWindow = uaeDeliveryWindowLabel();

  return (
    <section
      id="final-cta"
      className="scroll-mt-[var(--header-h,4rem)] border-t border-velora-burgundy/10 bg-white py-10 sm:py-12"
    >
      <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6 lg:max-w-[1200px]">
        <h2 className="text-right text-xl font-extrabold text-velora-burgundy-dark sm:text-2xl">
          {headline}
        </h2>
        <p className="mt-2 text-right text-sm font-medium text-velora-burgundy/65">
          {deliveryWindow} · العرض لفترة محدودة
        </p>
        <div className="mt-6">
          <ProductPurchasePanel
            funnelOffers
            form={form}
            productSlug={productSlug}
            upsellSlotSrc={upsellSlotSrc}
            productName={productName}
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            onChange={onPurchaseChange}
            showTrustRow
          />
        </div>
      </div>
    </section>
  );
}
