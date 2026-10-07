import { loadStripe, type Stripe } from "@stripe/stripe-js";

const stripePromises = new Map<string, Promise<Stripe | null>>();

/** Start loading Stripe.js as early as possible (call with publishable key from server or /api/stripe/config). */
export function preloadStripeJs(publishableKey: string): Promise<Stripe | null> {
  const key = publishableKey.trim();
  if (!key) return Promise.resolve(null);

  let promise = stripePromises.get(key);
  if (!promise) {
    promise = loadStripe(key, { locale: "ar" });
    stripePromises.set(key, promise);
  }
  return promise;
}
