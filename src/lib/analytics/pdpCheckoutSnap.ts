import type { BundleQuantity, PaymentMethod } from "@/config/pricing";
import { snapMerchandiseValueAed } from "@/lib/analytics/snapCommercePricing";
import {
  trackSnapAddToCart,
  trackSnapStartCheckout,
} from "@/lib/analytics/trackSnapCommerce";
import { resolveCheckoutTotalAed } from "@/lib/checkoutTotals";

/** PDP pay buttons: ADD_CART (bundle merchandise) then START_CHECKOUT (method total). */
export function firePdpCheckoutSnapEvents(input: {
  productSlug: string;
  quantity: BundleQuantity;
  paymentMethod: PaymentMethod;
}): void {
  const merchandiseAed = snapMerchandiseValueAed({
    productSlug: input.productSlug,
    quantity: input.quantity,
  });
  trackSnapAddToCart({
    productSlug: input.productSlug,
    quantity: input.quantity,
    valueAed: merchandiseAed,
  });
  const checkoutTotal = resolveCheckoutTotalAed(
    input.quantity,
    input.paymentMethod,
    input.quantity,
    undefined,
    input.productSlug,
  );
  trackSnapStartCheckout({
    productSlug: input.productSlug,
    quantity: input.quantity,
    valueAed: checkoutTotal,
  });
}
