import {
  cardBundlePrices,
  codFee,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { MAX_BUNDLE_UNITS } from "@/lib/cart/cartTypes";
import { isEligibleProductSlug } from "@/lib/cart/eligibleCatalog";

export type CartPricingResult =
  | {
      ok: true;
      eligibleUnits: number;
      bundleQuantity: BundleQuantity;
      merchandiseAed: number;
      shippingAed: number | null;
      totalAed: number | null;
      paymentMethod: PaymentMethod | null;
    }
  | {
      ok: false;
      reason: "empty" | "invalid_lines" | "too_many_units" | "no_bundle_rule";
      eligibleUnits: number;
    };

export function normalizeCartLines(raw: CartLine[]): CartLine[] {
  const merged = new Map<string, number>();
  for (const line of raw) {
    const slug = line.slug?.trim();
    const qty = Math.floor(Number(line.quantity));
    if (!slug || !isEligibleProductSlug(slug) || qty < 1) continue;
    merged.set(slug, (merged.get(slug) ?? 0) + qty);
  }
  return [...merged.entries()].map(([slug, quantity]) => ({ slug, quantity }));
}

export function countEligibleUnits(lines: CartLine[]): number {
  return normalizeCartLines(lines).reduce((sum, l) => sum + l.quantity, 0);
}

export function bundleQuantityFromUnitCount(units: number): BundleQuantity | null {
  if (units === 1 || units === 2 || units === 3) return units;
  return null;
}

export function computeCartPricing(
  lines: CartLine[],
  paymentMethod?: PaymentMethod | null,
): CartPricingResult {
  const normalized = normalizeCartLines(lines);
  const eligibleUnits = countEligibleUnits(normalized);

  if (eligibleUnits === 0) {
    return { ok: false, reason: "empty", eligibleUnits: 0 };
  }

  if (normalized.length === 0) {
    return { ok: false, reason: "invalid_lines", eligibleUnits };
  }

  if (eligibleUnits > MAX_BUNDLE_UNITS) {
    return { ok: false, reason: "too_many_units", eligibleUnits };
  }

  const bundleQuantity = bundleQuantityFromUnitCount(eligibleUnits);
  if (!bundleQuantity) {
    return { ok: false, reason: "no_bundle_rule", eligibleUnits };
  }

  const merchandiseAed = cardBundlePrices[bundleQuantity];
  const method = paymentMethod ?? null;
  const shippingAed = method === "cod" ? codFee : method === "card" ? 0 : null;
  const totalAed =
    method === null ? null : getCheckoutTotal(bundleQuantity, method);

  return {
    ok: true,
    eligibleUnits,
    bundleQuantity,
    merchandiseAed,
    shippingAed,
    totalAed,
    paymentMethod: method,
  };
}

/** Incremental merchandise cost to reach next bundle tier (card pricing). */
export function upsellMerchandiseDelta(currentUnits: number): number | null {
  if (currentUnits === 1) return cardBundlePrices[2] - cardBundlePrices[1];
  if (currentUnits === 2) return cardBundlePrices[3] - cardBundlePrices[2];
  return null;
}

export function targetBundleTotalAfterUpsell(currentUnits: number): number | null {
  if (currentUnits === 1) return cardBundlePrices[2];
  if (currentUnits === 2) return cardBundlePrices[3];
  return null;
}
