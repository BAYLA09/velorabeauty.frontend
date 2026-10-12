import type { BundleQuantity } from "@/config/pricing";
import { computeCartPricing, normalizeCartLines } from "@/lib/cart/cartPricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { buildMixedCartSummary } from "@/lib/cart/cartCheckoutMeta";

export type ValidatedCartCheckout = {
  lines: CartLine[];
  bundleQuantity: BundleQuantity;
  productSlug: string;
  productName: string;
  merchandiseAed: number;
};

export function validateCartForCheckout(
  lines: CartLine[],
): { ok: true; cart: ValidatedCartCheckout } | { ok: false; error: string } {
  const normalized = normalizeCartLines(lines);
  const pricing = computeCartPricing(normalized);
  if (!pricing.ok) {
    if (pricing.reason === "too_many_units") {
      return {
        ok: false,
        error: "Maximum 3 produits éligibles par commande. Ajustez votre panier.",
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
      bundleQuantity: pricing.bundleQuantity,
      productSlug: meta.productSlug,
      productName: meta.productName,
      merchandiseAed: pricing.merchandiseAed,
    },
  };
}
