import {
  getCheckoutTotal,
  getMerchandiseAedForUnits,
  resolveCheckoutTotalAedLegacy,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import {
  isStripeTestCheckoutEnabled,
  isStripeTestProductSlug,
  STRIPE_TEST_PRICE_AED,
} from "@/config/stripeTestCheckout";
import { getCheckoutTotalForCart, getMerchandiseAedForCart } from "@/lib/cart/cartPricing";
import type { CartLine } from "@/lib/cart/cartTypes";

/** Order total: per-line bundles when `cartLines` set; else PDP single-SKU tiers. */
function stripeTestLineSlug(cartLines?: CartLine[]): string | null {
  if (!isStripeTestCheckoutEnabled() || !cartLines?.length) return null;
  const slug = cartLines[0]?.slug;
  return slug && isStripeTestProductSlug(slug) ? slug : null;
}

export function resolveCheckoutTotalAed(
  quantity: BundleQuantity,
  method: PaymentMethod,
  eligibleUnits?: number,
  cartLines?: CartLine[],
  productSlug?: string,
): number {
  if (
    isStripeTestCheckoutEnabled() &&
    productSlug &&
    isStripeTestProductSlug(productSlug) &&
    method === "card"
  ) {
    return STRIPE_TEST_PRICE_AED;
  }
  if (stripeTestLineSlug(cartLines) && method === "card") {
    return STRIPE_TEST_PRICE_AED;
  }
  if (cartLines && cartLines.length > 0) {
    const fromCart = getCheckoutTotalForCart(cartLines, method);
    if (fromCart !== null) return fromCart;
  }
  return resolveCheckoutTotalAedLegacy(quantity, method, eligibleUnits);
}

export function resolveCheckoutMerchandiseAed(
  quantity: BundleQuantity,
  eligibleUnits?: number,
  cartLines?: CartLine[],
  productSlug?: string,
): number {
  if (isStripeTestCheckoutEnabled() && productSlug && isStripeTestProductSlug(productSlug)) {
    return STRIPE_TEST_PRICE_AED;
  }
  if (stripeTestLineSlug(cartLines)) {
    return STRIPE_TEST_PRICE_AED;
  }
  if (cartLines && cartLines.length > 0) {
    return getMerchandiseAedForCart(cartLines) ?? 0;
  }
  const units = eligibleUnits ?? quantity;
  return getMerchandiseAedForUnits(units) ?? getCheckoutTotal(quantity, "card");
}
