import {
  bundleQuantityFromUnitCount,
  codFee,
  getCheckoutTotalForUnits,
  getMerchandiseAedForLineQuantity,
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

/** Per-SKU bundle tiers summed (2× hair 249 + 1× skin 199 = 448). */
export function getMerchandiseAedForCart(lines: CartLine[]): number | null {
  const normalized = normalizeCartLines(lines);
  if (normalized.length === 0) return null;
  let sum = 0;
  for (const line of normalized) {
    const part = getMerchandiseAedForLineQuantity(line.quantity);
    if (part === null) return null;
    sum += part;
  }
  return sum;
}

export function getCheckoutTotalForCart(
  lines: CartLine[],
  method: PaymentMethod,
): number | null {
  const merchandise = getMerchandiseAedForCart(lines);
  if (merchandise === null) return null;
  return merchandise + (method === "cod" ? codFee : 0);
}

export function simulateAddToCart(lines: CartLine[], slug: string, quantity = 1): CartLine[] {
  const normalized = normalizeCartLines(lines);
  const idx = normalized.findIndex((l) => l.slug === slug);
  if (idx >= 0) {
    return normalizeCartLines(
      normalized.map((l, i) =>
        i === idx ? { slug, quantity: l.quantity + quantity } : l,
      ),
    );
  }
  return normalizeCartLines([...normalized, { slug, quantity }]);
}

export function merchandiseDeltaForCartChange(
  before: CartLine[],
  after: CartLine[],
): number | null {
  const a = getMerchandiseAedForCart(before);
  const b = getMerchandiseAedForCart(after);
  if (a === null || b === null) return null;
  return b - a;
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
  const merchandiseAed = getMerchandiseAedForCart(normalized);
  if (!bundleQuantity || merchandiseAed === null) {
    return { ok: false, reason: "no_bundle_rule", eligibleUnits };
  }

  const method = paymentMethod ?? null;
  const shippingAed = method === "cod" ? codFee : method === "card" ? 0 : null;
  const totalAed =
    method === null ? null : getCheckoutTotalForCart(normalized, method);

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

/** @deprecated Prefer cart-line upsell helpers; kept for single-SKU PDP tiers. */
export function upsellMerchandiseDelta(currentUnits: number): number | null {
  const current = getMerchandiseAedForUnits(currentUnits);
  const next = getMerchandiseAedForUnits(currentUnits + 1);
  if (current === null || next === null) return null;
  return next - current;
}

/** @deprecated Global mixed-bundle tier; use targetTotalAfterAddingProduct. */
export function targetBundleTotalAfterUpsell(currentUnits: number): number | null {
  return getMerchandiseAedForUnits(currentUnits + 1);
}

/** Adding one unit of another Velora SKU (usually +199 د.إ). */
export function targetTotalAfterAddingProduct(
  lines: CartLine[],
  slug: string,
): number | null {
  const after = simulateAddToCart(lines, slug, 1);
  return getMerchandiseAedForCart(after);
}

export function upsellDeltaAddingProduct(lines: CartLine[], slug: string): number | null {
  const after = simulateAddToCart(lines, slug, 1);
  return merchandiseDeltaForCartChange(lines, after);
}
