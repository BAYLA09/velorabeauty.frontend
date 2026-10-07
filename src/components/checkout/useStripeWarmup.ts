"use client";

import { useEffect } from "react";
import type { BundleQuantity } from "@/config/pricing";
import { prefetchStripeCardCheckout } from "@/lib/prefetchStripeCardCheckout";

type WarmupContext = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
};

/** Preload Stripe.js + PaymentIntent while the shopper is on the payment-method step. */
export function useStripeWarmup(active: boolean, context?: WarmupContext) {
  const productSlug = context?.productSlug;
  const productName = context?.productName;
  const quantity = context?.quantity;

  useEffect(() => {
    if (!active || !productSlug || !productName || quantity == null) return;
    void prefetchStripeCardCheckout({ productSlug, productName, quantity });
  }, [active, productSlug, productName, quantity]);
}
