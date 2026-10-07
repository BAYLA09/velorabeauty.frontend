import type { BundleQuantity } from "@/config/pricing";

const PREFIX = "velora-stripe-pi:";

export type CachedStripePi = {
  publishableKey: string;
  clientSecret: string;
  paymentIntentId: string;
  cachedAt: number;
};

function cacheKey(productSlug: string, quantity: BundleQuantity): string {
  return `${PREFIX}${productSlug}:${quantity}`;
}

/** Reuse a PI prepared on the payment-method step (instant Elements on /checkout/card). */
export function readStripePiCache(
  productSlug: string,
  quantity: BundleQuantity,
): CachedStripePi | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(productSlug, quantity));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedStripePi;
    if (
      !parsed?.publishableKey ||
      !parsed?.clientSecret ||
      !parsed?.paymentIntentId ||
      typeof parsed.cachedAt !== "number"
    ) {
      return null;
    }
    // Stripe client secrets remain valid ~24h; refresh after 45 min.
    if (Date.now() - parsed.cachedAt > 45 * 60 * 1000) {
      sessionStorage.removeItem(cacheKey(productSlug, quantity));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeStripePiCache(
  productSlug: string,
  quantity: BundleQuantity,
  data: Omit<CachedStripePi, "cachedAt">,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: CachedStripePi = { ...data, cachedAt: Date.now() };
    sessionStorage.setItem(cacheKey(productSlug, quantity), JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}
