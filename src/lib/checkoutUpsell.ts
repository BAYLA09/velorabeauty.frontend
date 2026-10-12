import type { BundleQuantity } from "@/config/pricing";
import { countEligibleUnits, normalizeCartLines } from "@/lib/cart/cartPricing";
import { parseCartItemsParam } from "@/lib/cart/cartSerialization";
import type { CartLine } from "@/lib/cart/cartTypes";
import { MAX_CART_UNITS } from "@/lib/cart/cartTypes";
import {
  ELIGIBLE_PRODUCT_SLUGS,
  isEligibleProductSlug,
} from "@/lib/cart/eligibleCatalog";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";

export function linesFromSingleProductCheckout(
  productSlug: string,
  quantity: BundleQuantity,
): CartLine[] {
  return [{ slug: productSlug, quantity }];
}

export function parseCheckoutLines(
  itemsParam: string | undefined,
  productSlug: string,
  quantity: BundleQuantity,
): CartLine[] {
  if (itemsParam) {
    const parsed = parseCartItemsParam(itemsParam);
    if (parsed) return parsed;
  }
  return linesFromSingleProductCheckout(productSlug, quantity);
}

export function setCheckoutLineQuantity(
  current: CartLine[],
  slug: string,
  nextQuantity: number,
): { ok: true; lines: CartLine[]; bundleQuantity: BundleQuantity } | { ok: false } {
  const nextLines =
    nextQuantity < 1
      ? normalizeCartLines(current.filter((l) => l.slug !== slug))
      : normalizeCartLines(
          current.map((l) => (l.slug === slug ? { ...l, quantity: nextQuantity } : l)),
        );
  if (countEligibleUnits(nextLines) === 0) return { ok: false };
  if (countEligibleUnits(nextLines) > MAX_CART_UNITS) return { ok: false };
  const validated = validateCartForCheckout(nextLines);
  if (!validated.ok) return { ok: false };
  return { ok: true, lines: nextLines, bundleQuantity: validated.cart.bundleQuantity };
}

export function addComplementaryLine(
  current: CartLine[],
  addSlug: string,
): { ok: true; lines: CartLine[]; bundleQuantity: BundleQuantity } | { ok: false } {
  if (!isEligibleProductSlug(addSlug)) return { ok: false };
  const merged = normalizeCartLines([...current, { slug: addSlug, quantity: 1 }]);
  if (countEligibleUnits(merged) > MAX_CART_UNITS) return { ok: false };
  const validated = validateCartForCheckout(merged);
  if (!validated.ok) return { ok: false };
  return { ok: true, lines: merged, bundleQuantity: validated.cart.bundleQuantity };
}

export function upsellSlugsNotInCart(lines: CartLine[]): string[] {
  const inCart = new Set(lines.map((l) => l.slug));
  return ELIGIBLE_PRODUCT_SLUGS.filter((slug) => !inCart.has(slug));
}
