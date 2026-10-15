/** Hidden Stripe live test — not listed on homepage. Enable via Easypanel only. */
export const STRIPE_TEST_PRODUCT_SLUG = "velora-stripe-test-20";

export const STRIPE_TEST_PRODUCT_NAME = "Velora — Stripe test (20 AED)";

export const STRIPE_TEST_PRICE_AED = 20;

export function isStripeTestCheckoutEnabled(): boolean {
  const v = process.env.STRIPE_TEST_CHECKOUT_ENABLED?.trim().toLowerCase();
  return v === "true" || v === "1";
}

export function isStripeTestProductSlug(slug: string): boolean {
  return slug.trim() === STRIPE_TEST_PRODUCT_SLUG;
}

/** When set, checkout URL must include `?token=` matching this value. */
export function isStripeTestCheckoutTokenValid(
  token: string | null | undefined,
): boolean {
  const expected = process.env.STRIPE_TEST_CHECKOUT_TOKEN?.trim();
  if (!expected) return true;
  return token?.trim() === expected;
}

export function stripeTestCheckoutUrl(siteUrl: string, token?: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const q = new URLSearchParams({
    product: STRIPE_TEST_PRODUCT_SLUG,
    quantity: "1",
  });
  const envToken = process.env.STRIPE_TEST_CHECKOUT_TOKEN?.trim();
  const t = token?.trim() || envToken;
  if (t) q.set("token", t);
  return `${base}/checkout/card?${q.toString()}`;
}
