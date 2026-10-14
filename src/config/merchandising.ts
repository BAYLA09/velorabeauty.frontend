/**
 * Bundle tiers 249 / 339 apply only when mixing different Velora SKUs (cart + checkout upsell).
 * Multiple units of the same product at bundle price confused call-center ops — disabled for now.
 */
export const allowSameSkuMultiUnitBundles = false;

/** Max units per product slug in cart / checkout when {@link allowSameSkuMultiUnitBundles} is false. */
export const maxUnitsPerProductSlug = allowSameSkuMultiUnitBundles ? Number.POSITIVE_INFINITY : 1;
