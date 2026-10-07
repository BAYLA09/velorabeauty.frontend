"use client";

import { useEffect } from "react";
import { preloadStripeJs } from "@/lib/stripeJsLoader";

/** Preload Stripe.js while the shopper is on the payment-method step. */
export function useStripeWarmup(active: boolean) {
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    void fetch("/api/stripe/config", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { publishableKey?: string | null }) => {
        if (cancelled || !data.publishableKey) return;
        void preloadStripeJs(data.publishableKey);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [active]);
}
