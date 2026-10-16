"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { cardThankYouCopy } from "@/config/cardThankYouCopy";
import type { BundleQuantity } from "@/config/pricing";
import { CodThankYouOrderMetaBar } from "@/components/order/cod-thank-you/CodThankYouOrderMetaBar";
import { CodThankYouOrderSummary } from "@/components/order/cod-thank-you/CodThankYouOrderSummary";
import { CardThankYouFooterBar } from "@/components/order/card-thank-you/CardThankYouFooterBar";
import { CardThankYouHero } from "@/components/order/card-thank-you/CardThankYouHero";
import { CardThankYouQuickTrust } from "@/components/order/card-thank-you/CardThankYouQuickTrust";
import { CardThankYouReceiptStrip } from "@/components/order/card-thank-you/CardThankYouReceiptStrip";
import { CardThankYouTimeline } from "@/components/order/card-thank-you/CardThankYouTimeline";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import { trackVerifiedPurchaseOnce } from "@/lib/analytics/trackPurchaseOnce";
import { cardTimelineSteps } from "@/lib/order/cardThankYouTimeline";
import { buildOrderDisplayLines } from "@/lib/order/buildOrderDisplayLines";
import type { OrderDraft } from "@/lib/orderStorage";
import { getProductPath } from "@/lib/productCatalog";

export type CardThankYouOrder = OrderDraft & {
  subtotalAed?: number;
  status?: string;
  cartLines?: OrderDraft["cartLines"];
};

type Props = {
  order: CardThankYouOrder;
  /** True when order was confirmed from /api/orders after payment. */
  purchaseVerified?: boolean;
  onNavigateAway?: () => void;
};

export function CardThankYouSuccess({
  order,
  purchaseVerified = false,
  onNavigateAway,
}: Props) {
  const orderRef = order.orderId?.slice(0, 8).toUpperCase() ?? "—";
  const createdAt = order.createdAt || new Date().toISOString();
  const deliveryFee = order.deliveryFeeAed ?? 0;
  const subtotalAed = order.subtotalAed ?? Math.max(0, order.totalAed - deliveryFee);
  const isPaid = order.status === "paid";

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

  const timeline = useMemo(() => cardTimelineSteps(order.status), [order.status]);

  useEffect(() => {
    trackStoreEvent({ event: "card_thank_you_page_view" });
    trackStoreEvent({ event: "order_summary_view" });
  }, []);

  useEffect(() => {
    if (!purchaseVerified || !isPaid || !order.orderId?.trim()) return;
    if (order.method && order.method !== "card") return;
    trackVerifiedPurchaseOnce({
      orderId: order.orderId,
      valueAed: order.totalAed,
      paymentMethod: "card",
      productSlug: order.productSlug,
      quantity: order.quantity as BundleQuantity,
      cartLines: order.cartLines,
    });
  }, [
    purchaseVerified,
    isPaid,
    order.method,
    order.orderId,
    order.totalAed,
    order.productSlug,
    order.quantity,
    order.cartLines,
  ]);

  return (
    <article className="relative mx-auto max-w-[440px] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_56px_rgba(58,24,32,0.14)] ring-1 ring-velora-burgundy/8">
      <CardThankYouHero customerName={order.customerName} isPaid={isPaid} />

      <div className="mt-2">
        <CodThankYouOrderMetaBar orderRef={orderRef} createdAt={createdAt} />
      </div>

      <CardThankYouReceiptStrip orderRef={orderRef} totalAed={order.totalAed} isPaid={isPaid} />

      <CardThankYouTimeline steps={timeline} />
      <CardThankYouQuickTrust />

      <p className="mx-5 mb-1 text-right text-[11px] leading-relaxed text-velora-burgundy/55">
        {cardThankYouCopy.summary.promise}
      </p>

      <CodThankYouOrderSummary
        lines={displayLines}
        emirate={order.emirate}
        address={order.address}
        subtotalAed={subtotalAed}
        deliveryFeeAed={deliveryFee}
        totalAed={order.totalAed}
      />

      <div className="border-t border-velora-burgundy/8 px-5 py-4">
        <p className="text-center text-[11px] font-semibold text-velora-burgundy-dark">
          {cardThankYouCopy.values.title}
        </p>
        <p className="mt-1 text-center text-[10px] text-velora-burgundy/50">
          {cardThankYouCopy.values.subtitle}
        </p>
        {order.productSlug && order.productSlug !== "velora-offer" ? (
          <Link
            href={getProductPath(order.productSlug)}
            className="mt-4 block rounded-full bg-velora-burgundy py-3 text-center text-sm font-bold text-velora-cream shadow-md shadow-velora-burgundy/20 transition hover:brightness-105"
            onClick={() => onNavigateAway?.()}
          >
            {cardThankYouCopy.actions.shop}
          </Link>
        ) : null}
      </div>

      <CardThankYouFooterBar orderRef={orderRef} onHome={onNavigateAway} />
    </article>
  );
}
