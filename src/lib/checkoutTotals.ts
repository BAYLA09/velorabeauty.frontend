import {
  getCheckoutTotal,
  getMerchandiseAedForUnits,
  resolveCheckoutTotalAedLegacy,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import { getCheckoutTotalForCart, getMerchandiseAedForCart } from "@/lib/cart/cartPricing";
import type { CartLine } from "@/lib/cart/cartTypes";

/** Order total: per-line bundles when `cartLines` set; else PDP single-SKU tiers. */
export function resolveCheckoutTotalAed(
  quantity: BundleQuantity,
  method: PaymentMethod,
  eligibleUnits?: number,
  cartLines?: CartLine[],
): number {
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
): number {
  if (cartLines && cartLines.length > 0) {
    return getMerchandiseAedForCart(cartLines) ?? 0;
  }
  const units = eligibleUnits ?? quantity;
  return getMerchandiseAedForUnits(units) ?? getCheckoutTotal(quantity, "card");
}
