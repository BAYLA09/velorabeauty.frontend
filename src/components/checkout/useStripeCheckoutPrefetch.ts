"use client";

import { useEffect } from "react";
import {
  prefetchStripeCardCheckout,
  type StripePrefetchParams,
} from "@/lib/stripeCheckoutPrefetch";

/** Fire-and-forget PI + Stripe.js warmup (payment hub, cart, card page). */
export function useStripeCheckoutPrefetch(params: StripePrefetchParams | null) {
  useEffect(() => {
    if (!params?.productSlug || !params.productName) return;
    void prefetchStripeCardCheckout(params);
  }, [params]);
}
