export type BundleQuantity = 1 | 2 | 3;

export type PaymentMethod = "card" | "cod";

export const currencyLabel = "د.إ";

export const singleProductPrice = 199;

export const cardBundlePrices: Record<BundleQuantity, number> = {
  1: 199,
  2: 249,
  3: 339,
};

export const codFee = 20;

export const codBundlePrices: Record<BundleQuantity, number> = {
  1: 219,
  2: 269,
  3: 359,
};

export function formatPrice(amount: number): string {
  return `${amount} ${currencyLabel}`;
}

export function getCheckoutTotal(
  quantity: BundleQuantity,
  method: PaymentMethod,
): number {
  return method === "card" ? cardBundlePrices[quantity] : codBundlePrices[quantity];
}

/** Totals for single-SKU checkout or legacy unit count (prefer {@link resolveCheckoutTotalAed} in checkoutTotals). */
export function resolveCheckoutTotalAedLegacy(
  quantity: BundleQuantity,
  method: PaymentMethod,
  eligibleUnits?: number,
): number {
  const units = eligibleUnits ?? quantity;
  return getCheckoutTotalForUnits(units, method) ?? getCheckoutTotal(quantity, method);
}

/** URL / order `quantity` param: bundle tier capped at 3 even when cart has 4 units. */
export function bundleQuantityFromUnitCount(units: number): BundleQuantity | null {
  if (units < 1 || units > 4) return null;
  if (units === 1) return 1;
  if (units === 2) return 2;
  return 3;
}

const MAX_BUNDLE_TIER_UNITS = 3;

/** Card merchandise: bundle price for first 3 units + 199 AED per extra unit. */
export function getMerchandiseAedForUnits(units: number): number | null {
  const tier = bundleQuantityFromUnitCount(units);
  if (!tier) return null;
  const base = cardBundlePrices[tier];
  const extraUnits = Math.max(0, units - MAX_BUNDLE_TIER_UNITS);
  return base + extraUnits * singleProductPrice;
}

export function getCheckoutTotalForUnits(
  units: number,
  method: PaymentMethod,
): number | null {
  const merchandise = getMerchandiseAedForUnits(units);
  if (merchandise === null) return null;
  return merchandise + (method === "cod" ? codFee : 0);
}

export const bundleQuantities: BundleQuantity[] = [1, 2, 3];

/** Card merchandise for one SKU line (1→199, 2→249, 3→339, 4→339+199). */
export function getMerchandiseAedForLineQuantity(units: number): number | null {
  if (!Number.isFinite(units) || units < 1 || units > 4) return null;
  if (units <= MAX_BUNDLE_TIER_UNITS) {
    const tier = bundleQuantityFromUnitCount(units);
    return tier ? cardBundlePrices[tier] : null;
  }
  const base = cardBundlePrices[3];
  return base + (units - MAX_BUNDLE_TIER_UNITS) * singleProductPrice;
}

/** Merchandise subtotal for one line (COD fee is added once per order). */
export function getCodMerchandiseAedForLineQuantity(units: number): number | null {
  return getMerchandiseAedForLineQuantity(units);
}
