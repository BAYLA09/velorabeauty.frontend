"use client";

import { useEffect } from "react";
import { primeStripeJsSync, preloadStripeJs } from "@/lib/stripeJsLoader";

/** Load Stripe.js on every store page so checkout/card feels instant. */
export function StripeGlobalWarmup() {
  useEffect(() => {
    const boot = window.__VELORA_STRIPE_BOOT;
    if (boot?.publishableKey) {
      primeStripeJsSync(boot.publishableKey);
      return;
    }
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
  }, []);

  return null;
}
