import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function isStripeCardCheckoutEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_CARD_PAYMENT_ENABLED !== "true") return false;
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
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
