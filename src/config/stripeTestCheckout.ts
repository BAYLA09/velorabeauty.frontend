/** Hidden card checkout SKU — not listed on homepage. Enable via Easypanel only. */
export const STRIPE_TEST_PRODUCT_SLUG = "velora-stripe-test-20";

/** Short shareable PDP URL (same page as canonical slug). */
export const STRIPE_TEST_PRODUCT_PUBLIC_SLUG = "04-e-pay";

/** Hidden PDP «منتج 04» — الدفع الإلكتروني 20 د.إ، not on homepage. */
export const STRIPE_TEST_PRODUCT_NUMBER = "04";

export const STRIPE_TEST_PRODUCT_NAME = "الدفع الإلكتروني — فيلورا";

export const STRIPE_TEST_PRODUCT_HEADLINE =
  "منتج 04 · ادفعي بالبطاقة بأمان — تجربة دفع إلكتروني داخل الإمارات";

export const STRIPE_TEST_PRODUCT_SUBHOOK =
  "طلب حقيقي بـ 20 د.إ عبر Stripe — تأكيد فوري على البطاقة، بدون دفع عند الاستلام.";

export const STRIPE_TEST_PRICE_AED = 20;

export const STRIPE_TEST_USD_HINT = "~5 USD";

export function stripeTestProductPublicPath(): string {
  return `/products/${STRIPE_TEST_PRODUCT_PUBLIC_SLUG}`;
}

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

export function stripeTestCardCheckoutQuery(token?: string | null): URLSearchParams {
  const q = new URLSearchParams({
    product: STRIPE_TEST_PRODUCT_SLUG,
    quantity: "1",
  });
  const envToken = process.env.STRIPE_TEST_CHECKOUT_TOKEN?.trim();
  const t = token?.trim() || envToken;
  if (t) q.set("token", t);
  return q;
}

export function stripeTestCardCheckoutPath(token?: string | null): string {
  return `/checkout/card?${stripeTestCardCheckoutQuery(token).toString()}`;
}

export function stripeTestProductPagePath(): string {
  return `/products/${STRIPE_TEST_PRODUCT_SLUG}`;
}

export function stripeTestCheckoutUrl(siteUrl: string, token?: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${stripeTestCardCheckoutPath(token)}`;
}
