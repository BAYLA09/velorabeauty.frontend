import { loadStripe, type Stripe } from "@stripe/stripe-js";

declare global {
  interface Window {
    __VELORA_STRIPE?: Stripe | null;
    __VELORA_STRIPE_BOOT?: {
      publishableKey: string;
      clientSecret: string;
      paymentIntentId: string;
    };
  }
}

const stripePromises = new Map<string, Promise<Stripe | null>>();

function stripeFromWindow(publishableKey: string): Stripe | null {
  if (typeof window === "undefined") return null;
  if (window.__VELORA_STRIPE) return window.__VELORA_STRIPE;
  const StripeCtor = window.Stripe;
  if (typeof StripeCtor === "function") {
    try {
      const instance = StripeCtor(publishableKey, { locale: "ar" });
      window.__VELORA_STRIPE = instance;
      return instance;
    } catch {
      return null;
    }
  }
  return null;
}

/** Start loading Stripe.js as early as possible (call with publishable key from server or /api/stripe/config). */
export function preloadStripeJs(publishableKey: string): Promise<Stripe | null> {
  const key = publishableKey.trim();
  if (!key) return Promise.resolve(null);

  const sync = stripeFromWindow(key);
  if (sync) return Promise.resolve(sync);

  let promise = stripePromises.get(key);
  if (!promise) {
    promise = loadStripe(key, { locale: "ar" }).then((stripe) => {
      if (stripe) window.__VELORA_STRIPE = stripe;
      return stripe;
    });
    stripePromises.set(key, promise);
  }
  return promise;
}

/** Call as soon as publishable key is known (server script or bootstrap prop). */
export function primeStripeJsSync(publishableKey: string): void {
  if (typeof window === "undefined") return;
  void preloadStripeJs(publishableKey);
}
