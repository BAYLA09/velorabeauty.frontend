import { claimSnapPurchaseSend } from "@/lib/analytics/snapPurchaseDedupe";
import { snapContentIdsFromOrder, snapItemCount } from "@/lib/analytics/snapContentIds";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import type { CartLine } from "@/lib/cart/cartTypes";
import type { BundleQuantity } from "@/config/pricing";

export function trackVerifiedPurchaseOnce(input: {
  orderId: string;
  valueAed: number;
  paymentMethod: "card" | "cod";
  productSlug: string;
  quantity: BundleQuantity;
  cartLines?: CartLine[];
}): void {
  const orderId = input.orderId.trim();
  if (!orderId || !Number.isFinite(input.valueAed) || input.valueAed <= 0) return;
  if (!claimSnapPurchaseSend(orderId)) return;

  const content_ids = snapContentIdsFromOrder({
    productSlug: input.productSlug,
    cartLines: input.cartLines,
  });
  const number_items = snapItemCount({
    quantity: input.quantity,
    cartLines: input.cartLines,
  });

  trackStoreEvent({
    event: "purchase",
    order_id: orderId,
    order_ref: orderId.slice(0, 8).toUpperCase(),
    value_aed: input.valueAed,
    currency: "AED",
    payment_method: input.paymentMethod,
    content_ids,
    number_items,
  });
}
