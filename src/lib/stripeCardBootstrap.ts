import type { BundleQuantity } from "@/config/pricing";
import { createOrUpdateCardPaymentIntent } from "@/lib/stripePaymentIntent";
import {
  getStripePublishableKey,
  isStripeCardCheckoutEnabled,
} from "@/lib/stripeServer";

export type StripeCardBootstrap = {
  publishableKey: string;
  clientSecret: string;
  paymentIntentId: string;
};

/** Server-only: prepare Stripe Elements before HTML is sent (avoids client waterfall). */
export async function bootstrapStripeCardCheckout(input: {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
}): Promise<StripeCardBootstrap | null> {
  if (!isStripeCardCheckoutEnabled()) return null;

  const publishableKey = getStripePublishableKey();
  if (!publishableKey) return null;

  try {
    const intent = await createOrUpdateCardPaymentIntent(input);
    return {
      publishableKey,
      clientSecret: intent.clientSecret,
      paymentIntentId: intent.paymentIntentId,
    };
  } catch (err) {
    console.error("[bootstrapStripeCardCheckout]", err);
    return null;
  }
}
