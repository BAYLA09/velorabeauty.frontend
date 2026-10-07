import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Runtime-friendly flag for Easypanel (Docker Image pulls do not rebuild on env change).
 * Prefer `CARD_PAYMENT_ENABLED=true` in Easypanel; `NEXT_PUBLIC_*` is build-time only.
 */
export function isStripeCardCheckoutEnabled(): boolean {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) return false;

  const runtime = process.env.CARD_PAYMENT_ENABLED?.trim().toLowerCase();
  if (runtime === "false" || runtime === "0") return false;
  if (runtime === "true" || runtime === "1") return true;

  const baked = process.env.NEXT_PUBLIC_CARD_PAYMENT_ENABLED?.trim().toLowerCase();
  if (baked === "false" || baked === "0") return false;
  if (baked === "true" || baked === "1") return true;

  // Secret present and not explicitly disabled → enable (Easypanel default).
  return true;
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
