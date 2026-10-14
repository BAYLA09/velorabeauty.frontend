import type { BundleQuantity } from "@/config/pricing";
import { computeCartPricing, normalizeCartLines } from "@/lib/cart/cartPricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { buildMixedCartSummary } from "@/lib/cart/cartCheckoutMeta";
import { exceedsPerSlugUnitLimit } from "@/lib/cart/enforceLineQuantityLimits";

export type ValidatedCartCheckout = {
  lines: CartLine[];
  eligibleUnits: number;
  bundleQuantity: BundleQuantity;
  productSlug: string;
  productName: string;
  merchandiseAed: number;
};

export function validateCartForCheckout(
  lines: CartLine[],
): { ok: true; cart: ValidatedCartCheckout } | { ok: false; error: string } {
  const normalized = normalizeCartLines(lines);
  if (exceedsPerSlugUnitLimit(normalized)) {
    return {
      ok: false,
      error: "كل منتج مرة واحدة — كمّلي الروتين بإضافة منتج آخر (شعر، بشرة، أو عين).",
    };
  }
  const pricing = computeCartPricing(normalized);
  if (!pricing.ok) {
    if (pricing.reason === "too_many_units") {
      return {
        ok: false,
        error: "الحد 4 منتجات — 3 بعرض الباقة + الرابع بـ 199 د.إ.",
      };
    }
    if (pricing.reason === "empty") {
      return { ok: false, error: "Votre panier est vide." };
    }
    return { ok: false, error: "Panier invalide." };
  }
  const meta = buildMixedCartSummary(normalized);
  return {
    ok: true,
    cart: {
      lines: normalized,
      eligibleUnits: pricing.eligibleUnits,
      bundleQuantity: pricing.bundleQuantity,
      productSlug: meta.productSlug,
      productName: meta.productName,
      merchandiseAed: pricing.merchandiseAed,
    },
  };
}
