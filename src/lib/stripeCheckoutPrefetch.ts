import type { BundleQuantity } from "@/config/pricing";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";
import { preloadStripeJs } from "@/lib/stripeJsLoader";

const STORAGE_PREFIX = "velora:stripe-prefetch:";
const MAX_AGE_MS = 25 * 60 * 1000;

export type StripePrefetchParams = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  eligibleUnits?: number;
  itemsParam?: string;
};

type Stored = StripeCardBootstrap & { createdAt: number };

export function stripePrefetchStorageKey(params: StripePrefetchParams): string {
  const items = params.itemsParam?.trim() || "";
  const units = params.eligibleUnits ?? params.quantity;
  return `${params.productSlug}|${params.quantity}|${units}|${items}`;
}

function storageKey(params: StripePrefetchParams): string {
  return STORAGE_PREFIX + stripePrefetchStorageKey(params);
}

export function readStripeCheckoutPrefetch(
  params: StripePrefetchParams,
): StripeCardBootstrap | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey(params));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (Date.now() - parsed.createdAt > MAX_AGE_MS) {
      sessionStorage.removeItem(storageKey(params));
      return null;
    }
    if (!parsed.publishableKey || !parsed.clientSecret || !parsed.paymentIntentId) {
      return null;
    }
    return {
      publishableKey: parsed.publishableKey,
      clientSecret: parsed.clientSecret,
      paymentIntentId: parsed.paymentIntentId,
    };
  } catch {
    return null;
  }
}

export function writeStripeCheckoutPrefetch(
  params: StripePrefetchParams,
  bootstrap: StripeCardBootstrap,
): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const payload: Stored = { ...bootstrap, createdAt: Date.now() };
    sessionStorage.setItem(storageKey(params), JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

let inflight: Promise<void> | null = null;
let inflightKey = "";

/** Warm PaymentIntent + Stripe.js before the card checkout page (payment hub, cart hover). */
export async function prefetchStripeCardCheckout(
  params: StripePrefetchParams,
): Promise<void> {
  const key = stripePrefetchStorageKey(params);
  const cached = readStripeCheckoutPrefetch(params);
  if (cached?.publishableKey) {
    void preloadStripeJs(cached.publishableKey);
    return;
  }

  if (inflight && inflightKey === key) {
    await inflight;
    return;
  }

  inflightKey = key;
  inflight = (async () => {
    const [configRes, piRes] = await Promise.all([
      fetch("/api/stripe/config", { cache: "no-store" }),
      fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: params.productSlug,
          productName: params.productName,
          quantity: params.quantity,
          eligibleUnits: params.eligibleUnits ?? params.quantity,
        }),
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

    if (
      !config.ready ||
      !config.publishableKey ||
      !piRes.ok ||
      !piData.clientSecret ||
      !piData.paymentIntentId
    ) {
      return;
    }

    const bootstrap: StripeCardBootstrap = {
      publishableKey: config.publishableKey,
      clientSecret: piData.clientSecret,
      paymentIntentId: piData.paymentIntentId,
    };
    writeStripeCheckoutPrefetch(params, bootstrap);
    void preloadStripeJs(config.publishableKey);
  })().finally(() => {
    inflight = null;
    inflightKey = "";
  });

  await inflight;
}
