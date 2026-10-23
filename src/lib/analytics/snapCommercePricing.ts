import type { BundleQuantity } from "@/config/pricing";
import { cardBundlePrices, getMerchandiseAedForLineQuantity } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { getMerchandiseAedForCart } from "@/lib/cart/cartPricing";

/** Merchandise AED for Snap ADD_CART / offer selection (bundle tiers, not 199×qty). */
export function snapMerchandiseValueAed(input: {
  productSlug: string;
  quantity: BundleQuantity;
  cartLines?: CartLine[];
}): number {
  if (input.cartLines?.length) {
    return getMerchandiseAedForCart(input.cartLines) ?? 0;
  }
  return (
    getMerchandiseAedForLineQuantity(input.quantity, input.productSlug) ??
    cardBundlePrices[input.quantity]
  );
}

/** Value delta when adding units of one SKU to the cart (for ADD_CART). */
export function snapAddToCartDeltaAed(
  linesBefore: CartLine[],
  slug: string,
  addQty: number,
): number {
  const idx = linesBefore.findIndex((l) => l.slug === slug);
  const beforeQty = idx >= 0 ? linesBefore[idx].quantity : 0;
  const afterQty = beforeQty + addQty;
  const beforeMerch =
    beforeQty > 0 ? getMerchandiseAedForLineQuantity(beforeQty, slug) ?? 0 : 0;
  const afterMerch = getMerchandiseAedForLineQuantity(afterQty, slug) ?? 0;
  return Math.max(0, afterMerch - beforeMerch);
}
