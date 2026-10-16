"use client";

import { useEffect, useMemo } from "react";
import { codFee } from "@/config/pricing";
import type { BundleQuantity } from "@/config/pricing";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import { trackVerifiedPurchaseOnce } from "@/lib/analytics/trackPurchaseOnce";
import { codTimelineSteps } from "@/lib/order/codThankYouTimeline";
import { buildOrderDisplayLines } from "@/lib/order/buildOrderDisplayLines";
import type { OrderDraft } from "@/lib/orderStorage";
import { CodThankYouFooterBar } from "@/components/order/cod-thank-you/CodThankYouFooterBar";
import { CodThankYouHero } from "@/components/order/cod-thank-you/CodThankYouHero";
import { CodThankYouOrderMetaBar } from "@/components/order/cod-thank-you/CodThankYouOrderMetaBar";
import { CodThankYouOrderSummary } from "@/components/order/cod-thank-you/CodThankYouOrderSummary";
import { CodThankYouQuickTrust } from "@/components/order/cod-thank-you/CodThankYouQuickTrust";
import { CodThankYouReachableAlert } from "@/components/order/cod-thank-you/CodThankYouReachableAlert";
import { CodThankYouTimeline } from "@/components/order/cod-thank-you/CodThankYouTimeline";
import { CodThankYouValues } from "@/components/order/cod-thank-you/CodThankYouValues";

export type CodThankYouOrder = OrderDraft & {
  subtotalAed?: number;
  status?: string;
  cartLines?: OrderDraft["cartLines"];
};

type Props = {
  order: CodThankYouOrder;
  /** True when order was loaded from /api/orders (not local draft only). */
  purchaseVerified?: boolean;
  onNavigateAway?: () => void;
};

export function CodThankYouSuccess({
  order,
  purchaseVerified = false,
  onNavigateAway,
}: Props) {
  const orderRef = order.orderId?.slice(0, 8).toUpperCase() ?? "—";
  const createdAt = order.createdAt || new Date().toISOString();
  const deliveryFee = order.deliveryFeeAed ?? codFee;
  const subtotalAed = order.subtotalAed ?? Math.max(0, order.totalAed - deliveryFee);
  const timeline = useMemo(() => codTimelineSteps(order.status), [order.status]);
  const displayLines = useMemo(
    () =>
      buildOrderDisplayLines({
        productSlug: order.productSlug,
        productName: order.productName,
        quantity: order.quantity as BundleQuantity,
        cartLines: order.cartLines,
      }),
    [order.productSlug, order.productName, order.quantity, order.cartLines],
  );

  useEffect(() => {
    trackStoreEvent({ event: "cod_thank_you_page_view" });
    trackStoreEvent({ event: "order_summary_view" });
  }, []);

  useEffect(() => {
    if (!purchaseVerified || !order.orderId?.trim()) return;
    if (order.method && order.method !== "cod") return;
    trackVerifiedPurchaseOnce({
      orderId: order.orderId,
      valueAed: order.totalAed,
      paymentMethod: "cod",
      productSlug: order.productSlug,
      quantity: order.quantity as BundleQuantity,
      cartLines: order.cartLines,
    });
  }, [
    purchaseVerified,
    order.method,
    order.orderId,
    order.totalAed,
    order.productSlug,
    order.quantity,
    order.cartLines,
  ]);

  return (
    <article className="relative mx-auto max-w-[440px] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_16px_48px_rgba(58,24,32,0.12)] ring-1 ring-velora-burgundy/8">
      <CodThankYouHero customerName={order.customerName} />

      <div className="mt-4">
        <CodThankYouOrderMetaBar orderRef={orderRef} createdAt={createdAt} />
      </div>

      <CodThankYouTimeline steps={timeline} />
      <CodThankYouQuickTrust />

      <div className="pb-5 pt-2">
        <CodThankYouReachableAlert
          orderRef={orderRef}
          customerName={order.customerName}
          phone={order.phone}
        />
      </div>

      <CodThankYouOrderSummary
        lines={displayLines}
        emirate={order.emirate}
        address={order.address}
        subtotalAed={subtotalAed}
        deliveryFeeAed={deliveryFee}
        totalAed={order.totalAed}
      />

      <CodThankYouValues />

      <CodThankYouFooterBar orderRef={orderRef} onHome={onNavigateAway} />
    </article>
  );
}
