import {
  bundleQuantityFromUnitCount,
  codFee,
  getCheckoutTotalForUnits,
  getMerchandiseAedForUnits,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { MAX_CART_UNITS } from "@/lib/cart/cartTypes";
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

  if (eligibleUnits > MAX_CART_UNITS) {
    return { ok: false, reason: "too_many_units", eligibleUnits };
  }

  const bundleQuantity = bundleQuantityFromUnitCount(eligibleUnits);
  const merchandiseAed = getMerchandiseAedForUnits(eligibleUnits);
  if (!bundleQuantity || merchandiseAed === null) {
    return { ok: false, reason: "no_bundle_rule", eligibleUnits };
  }

  const method = paymentMethod ?? null;
  const shippingAed = method === "cod" ? codFee : method === "card" ? 0 : null;
  const totalAed =
    method === null ? null : getCheckoutTotalForUnits(eligibleUnits, method);

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

/** Incremental merchandise cost to reach next unit tier (card pricing). */
export function upsellMerchandiseDelta(currentUnits: number): number | null {
  const current = getMerchandiseAedForUnits(currentUnits);
  const next = getMerchandiseAedForUnits(currentUnits + 1);
  if (current === null || next === null) return null;
  return next - current;
}

export function targetBundleTotalAfterUpsell(currentUnits: number): number | null {
  return getMerchandiseAedForUnits(currentUnits + 1);
}
