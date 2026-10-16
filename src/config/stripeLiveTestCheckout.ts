/** Hidden ~1 USD Stripe Live test — checkout URL only, not on homepage. */
export const STRIPE_LIVE_TEST_PRODUCT_SLUG = "velora-stripe-test-1usd";

/** Charge in AED (Stripe account currency). ~1 USD at fixed display rate. */
export const STRIPE_LIVE_TEST_USD = 1;

export const STRIPE_LIVE_TEST_USD_TO_AED = 3.67;

export const STRIPE_LIVE_TEST_PRICE_AED =
  Math.round(STRIPE_LIVE_TEST_USD * STRIPE_LIVE_TEST_USD_TO_AED * 100) / 100;

export const STRIPE_LIVE_TEST_PRODUCT_NAME = "اختبار Stripe Live (~1 USD)";

export function isStripeLiveTestCheckoutEnabled(): boolean {
  const v = process.env.STRIPE_TEST_CHECKOUT_ENABLED?.trim().toLowerCase();
  return v === "true" || v === "1";
}

export function isStripeLiveTestProductSlug(slug: string): boolean {
  return slug.trim() === STRIPE_LIVE_TEST_PRODUCT_SLUG;
}

export function isStripeLiveTestCheckoutTokenValid(token: string | null | undefined): boolean {
  const expected = process.env.STRIPE_TEST_CHECKOUT_TOKEN?.trim();
  if (!expected) return true;
  return token?.trim() === expected;
}

export function stripeLiveTestCardCheckoutQuery(token?: string | null): URLSearchParams {
  const q = new URLSearchParams({
    product: STRIPE_LIVE_TEST_PRODUCT_SLUG,
    quantity: "1",
  });
  const envToken = process.env.STRIPE_TEST_CHECKOUT_TOKEN?.trim();
  const t = token?.trim() || envToken;
  if (t) q.set("token", t);
  return q;
}

export function stripeLiveTestCardCheckoutPath(token?: string | null): string {
  return `/checkout/card?${stripeLiveTestCardCheckoutQuery(token).toString()}`;
}

/** Short bookmark: /checkout/stripe-test */
export function stripeLiveTestShortcutPath(): string {
  return "/checkout/stripe-test";
}

export function stripeLiveTestCheckoutUrl(siteUrl: string, token?: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${stripeLiveTestCardCheckoutPath(token)}`;
}

export function stripeLiveTestShortcutUrl(siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${stripeLiveTestShortcutPath()}`;
}
