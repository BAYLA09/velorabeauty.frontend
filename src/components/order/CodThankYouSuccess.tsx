"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { codThankYouCopy } from "@/config/codThankYouCopy";
import { codFee } from "@/config/pricing";
import type { BundleQuantity } from "@/config/pricing";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import { codTimelineSteps } from "@/lib/order/codThankYouTimeline";
import { resolveOrderProductImage } from "@/lib/order/resolveOrderProductImage";
import type { OrderDraft } from "@/lib/orderStorage";
import { CodThankYouBeforeDelivery } from "@/components/order/cod-thank-you/CodThankYouBeforeDelivery";
import { CodThankYouConfirmSection } from "@/components/order/cod-thank-you/CodThankYouConfirmSection";
import { CodThankYouHero } from "@/components/order/cod-thank-you/CodThankYouHero";
import { CodThankYouOrderSummary } from "@/components/order/cod-thank-you/CodThankYouOrderSummary";
import { CodThankYouSupport } from "@/components/order/cod-thank-you/CodThankYouSupport";
import { CodThankYouTimeline } from "@/components/order/cod-thank-you/CodThankYouTimeline";
import { CodThankYouTrustStrip } from "@/components/order/cod-thank-you/CodThankYouTrustStrip";

export type CodThankYouOrder = OrderDraft & {
  subtotalAed?: number;
  status?: string;
};

type Props = {
  order: CodThankYouOrder;
  onNavigateAway?: () => void;
};

export function CodThankYouSuccess({ order, onNavigateAway }: Props) {
  const orderRef = order.orderId?.slice(0, 8).toUpperCase() ?? "—";
  const createdAt = order.createdAt || new Date().toISOString();
  const deliveryFee = order.deliveryFeeAed ?? codFee;
  const subtotalAed = order.subtotalAed ?? Math.max(0, order.totalAed - deliveryFee);
  const timeline = useMemo(() => codTimelineSteps(order.status), [order.status]);
  const productImage = useMemo(
    () => resolveOrderProductImage(order.productSlug),
    [order.productSlug],
  );

  useEffect(() => {
    trackStoreEvent({ event: "cod_thank_you_page_view" });
    trackStoreEvent({ event: "order_summary_view" });
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-8">
      <CodThankYouHero
        customerName={order.customerName}
        orderRef={orderRef}
        createdAt={createdAt}
        totalAed={order.totalAed}
      />

      <CodThankYouTimeline steps={timeline} />

      <CodThankYouConfirmSection
        orderRef={orderRef}
        customerName={order.customerName}
        phone={order.phone}
      />

      <CodThankYouTrustStrip />

      <CodThankYouOrderSummary
        productName={order.productName}
        productSlug={order.productSlug}
        quantity={order.quantity as BundleQuantity}
        image={productImage}
        emirate={order.emirate}
        address={order.address}
        subtotalAed={subtotalAed}
        deliveryFeeAed={deliveryFee}
        totalAed={order.totalAed}
      />

      <CodThankYouBeforeDelivery />

      <CodThankYouSupport orderRef={orderRef} />

      <div className="flex justify-center pt-2">
        <Link
          href="/"
          className="rounded-full border border-velora-burgundy/15 bg-white px-8 py-3 text-sm font-bold text-velora-burgundy transition hover:bg-velora-cream"
          onClick={onNavigateAway}
        >
          {codThankYouCopy.homeCta}
        </Link>
      </div>
    </div>
  );
}
