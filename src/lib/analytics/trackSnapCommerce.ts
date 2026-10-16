import { isSnapCatalogSlug } from "@/config/snapPixel";
import { snapContentIdsFromOrder, snapItemCount } from "@/lib/analytics/snapContentIds";
import { trackStoreEvent } from "@/lib/analytics/trackStoreEvent";
import type { CartLine } from "@/lib/cart/cartTypes";

export function trackSnapViewContent(input: {
  productSlug: string;
  valueAed: number;
}): void {
  if (!isSnapCatalogSlug(input.productSlug)) return;
  trackStoreEvent({
    event: "view_content",
    value_aed: input.valueAed,
    currency: "AED",
    content_ids: [input.productSlug],
    number_items: 1,
  });
}

export function trackSnapAddToCart(input: {
  productSlug: string;
  quantity: number;
  valueAed: number;
}): void {
  if (!isSnapCatalogSlug(input.productSlug)) return;
  trackStoreEvent({
    event: "add_cart",
    value_aed: input.valueAed,
    currency: "AED",
    content_ids: [input.productSlug],
    number_items: Math.max(1, input.quantity),
  });
}

export function trackSnapAddBilling(input: {
  productSlug: string;
  quantity: number;
  valueAed: number;
  cartLines?: CartLine[];
}): void {
  const content_ids = snapContentIdsFromOrder({
    productSlug: input.productSlug,
    cartLines: input.cartLines,
  });
  if (content_ids.length === 0) return;
  trackStoreEvent({
    event: "add_billing",
    value_aed: input.valueAed,
    currency: "AED",
    content_ids,
    number_items: snapItemCount({
      quantity: input.quantity,
      cartLines: input.cartLines,
    }),
  });
}

export function trackSnapStartCheckout(input: {
  productSlug: string;
  quantity: number;
  valueAed: number;
  cartLines?: CartLine[];
}): void {
  const content_ids = snapContentIdsFromOrder({
    productSlug: input.productSlug,
    cartLines: input.cartLines,
  });
  if (content_ids.length === 0) return;
  trackStoreEvent({
    event: "start_checkout",
    value_aed: input.valueAed,
    currency: "AED",
    content_ids,
    number_items: snapItemCount({
      quantity: input.quantity,
      cartLines: input.cartLines,
    }),
  });
}
