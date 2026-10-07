import type { BundleQuantity } from "@/config/pricing";
import { readStripePiCache, writeStripePiCache } from "@/lib/stripePiSessionCache";
import { preloadStripeJs } from "@/lib/stripeJsLoader";

let inflightKey: string | null = null;

/** Client-only: config + PaymentIntent in parallel, cached for the card step. */
export async function prefetchStripeCardCheckout(input: {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
}): Promise<void> {
  if (typeof window === "undefined") return;

  const { productSlug, productName, quantity } = input;
  const cached = readStripePiCache(productSlug, quantity);
  if (cached) {
    void preloadStripeJs(cached.publishableKey);
    return;
  }

  const key = `${productSlug}:${quantity}`;
  if (inflightKey === key) return;
  inflightKey = key;

  try {
    const [configRes, piRes] = await Promise.all([
      fetch("/api/stripe/config", { cache: "no-store" }),
      fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, productName, quantity }),
      }),
    ]);

    const config = (await configRes.json()) as {
      ready?: boolean;
      publishableKey?: string | null;
    };
    const piData = (await piRes.json()) as {
      clientSecret?: string;
      paymentIntentId?: string;
    };

    if (!config.ready || !config.publishableKey) return;
    if (!piRes.ok || !piData.clientSecret || !piData.paymentIntentId) return;

    writeStripePiCache(productSlug, quantity, {
      publishableKey: config.publishableKey,
      clientSecret: piData.clientSecret,
      paymentIntentId: piData.paymentIntentId,
    });
    void preloadStripeJs(config.publishableKey);
  } catch {
    /* ignore — card page will retry */
  } finally {
    if (inflightKey === key) inflightKey = null;
  }
}
