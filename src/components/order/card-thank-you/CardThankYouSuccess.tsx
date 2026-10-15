"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { cardThankYouCopy } from "@/config/cardThankYouCopy";
import { formatPrice } from "@/config/pricing";
import type { BundleQuantity } from "@/config/pricing";
import { CodThankYouOrderMetaBar } from "@/components/order/cod-thank-you/CodThankYouOrderMetaBar";
import { CodThankYouOrderSummary } from "@/components/order/cod-thank-you/CodThankYouOrderSummary";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
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
  onNavigateAway?: () => void;
};

export function CardThankYouSuccess({ order, onNavigateAway }: Props) {
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

  useEffect(() => {
    trackStoreEvent({ event: "card_thank_you_page_view" });
    trackStoreEvent({ event: "order_summary_view" });
  }, []);

  return (
    <article className="relative mx-auto max-w-[440px] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_16px_48px_rgba(58,24,32,0.12)] ring-1 ring-velora-burgundy/8">
      <header className="bg-gradient-to-b from-velora-burgundy to-velora-burgundy-dark px-6 pb-8 pt-10 text-center text-velora-cream">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-2xl">
          ✓
        </div>
        <p className="mt-4 text-[11px] font-bold tracking-widest text-velora-cream/80">
          {cardThankYouCopy.paidBadge}
        </p>
        <h1 className="mt-2 text-2xl font-black">{cardThankYouCopy.hero.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-velora-cream/90">
          {order.customerName}، طلبك مسجّل و{isPaid ? "الدفع مؤكّد" : "جاري تأكيد الدفع"}.
        </p>
      </header>

      <div className="mt-4">
        <CodThankYouOrderMetaBar orderRef={orderRef} createdAt={createdAt} />
      </div>

      <p className="mx-5 mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-right text-xs leading-relaxed text-emerald-900 ring-1 ring-emerald-200/80">
        {isPaid ? cardThankYouCopy.status.paid : cardThankYouCopy.status.pending}
      </p>

      <CodThankYouOrderSummary
        lines={displayLines}
        emirate={order.emirate}
        address={order.address}
        subtotalAed={subtotalAed}
        deliveryFeeAed={deliveryFee}
        totalAed={order.totalAed}
      />

      <div className="border-t border-velora-burgundy/8 px-5 py-5">
        <p className="text-center text-xs text-velora-burgundy/55">
          {formatPrice(order.totalAed)} · بطاقة ·{" "}
          <span dir="ltr" className="font-semibold">
            {order.phone}
          </span>
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {order.productSlug && order.productSlug !== "velora-offer" && (
            <Link
              href={getProductPath(order.productSlug)}
              className="block rounded-full bg-velora-burgundy py-3 text-center text-sm font-bold text-velora-cream"
              onClick={() => onNavigateAway?.()}
            >
              {cardThankYouCopy.actions.shop}
            </Link>
          )}
          <Link
            href="/"
            className="block rounded-full border border-velora-burgundy/15 py-3 text-center text-sm font-bold text-velora-burgundy"
            onClick={() => onNavigateAway?.()}
          >
            {cardThankYouCopy.actions.home}
          </Link>
        </div>
      </div>
    </article>
  );
}
