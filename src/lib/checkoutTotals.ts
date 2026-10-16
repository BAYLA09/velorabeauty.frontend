import {
  getCheckoutTotal,
  getMerchandiseAedForUnits,
  resolveCheckoutTotalAedLegacy,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import {
  isStripeLiveTestCheckoutEnabled,
  isStripeLiveTestProductSlug,
  STRIPE_LIVE_TEST_PRICE_AED,
} from "@/config/stripeLiveTestCheckout";
import { getCheckoutTotalForCart, getMerchandiseAedForCart } from "@/lib/cart/cartPricing";
import type { CartLine } from "@/lib/cart/cartTypes";

function liveTestLineSlug(cartLines?: CartLine[]): string | null {
  if (!isStripeLiveTestCheckoutEnabled() || !cartLines?.length) return null;
  const slug = cartLines[0]?.slug;
  return slug && isStripeLiveTestProductSlug(slug) ? slug : null;
}

/** Order total: per-line bundles when `cartLines` set; else PDP single-SKU tiers. */
export function resolveCheckoutTotalAed(
  quantity: BundleQuantity,
  method: PaymentMethod,
  eligibleUnits?: number,
  cartLines?: CartLine[],
  productSlug?: string,
): number {
  if (
    isStripeLiveTestCheckoutEnabled() &&
    productSlug &&
    isStripeLiveTestProductSlug(productSlug) &&
    method === "card"
  ) {
    return STRIPE_LIVE_TEST_PRICE_AED;
  }
  if (liveTestLineSlug(cartLines) && method === "card") {
    return STRIPE_LIVE_TEST_PRICE_AED;
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
  if (isStripeLiveTestCheckoutEnabled() && productSlug && isStripeLiveTestProductSlug(productSlug)) {
    return STRIPE_LIVE_TEST_PRICE_AED;
  }
  if (liveTestLineSlug(cartLines)) {
    return STRIPE_LIVE_TEST_PRICE_AED;
  }
  if (cartLines && cartLines.length > 0) {
    return getMerchandiseAedForCart(cartLines) ?? 0;
  }
  const units = eligibleUnits ?? quantity;
  return getMerchandiseAedForUnits(units) ?? getCheckoutTotal(quantity, "card");
}
