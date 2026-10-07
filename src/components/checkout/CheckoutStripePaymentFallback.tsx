"use client";

import { useEffect } from "react";
import { useCheckoutCardForm } from "@/components/checkout/CheckoutCardFormContext";
import { CheckoutPayButton } from "@/components/checkout/CheckoutPayButton";
import {
  CheckoutStripeElementsProvider,
  useCheckoutStripe,
} from "@/components/checkout/CheckoutStripeElementsProvider";
import { CheckoutStripePaymentElement } from "@/components/checkout/CheckoutStripePaymentElement";
import { getCheckoutTotal } from "@/config/pricing";
import { prefetchStripeCardCheckout } from "@/lib/prefetchStripeCardCheckout";
import { readStripePiCache } from "@/lib/stripePiSessionCache";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";

function FallbackPaySection() {
  const { quantity } = useCheckoutCardForm();
  const { elementsLoading } = useCheckoutStripe();
  const total = getCheckoutTotal(quantity, "card");

  return (
    <>
      <CheckoutStripePaymentElement />
      <div className="border-t border-neutral-100 pt-6">
        <CheckoutPayButton
          totalAed={total}
          disabled={elementsLoading}
          hint="جاري تجهيز حقول البطاقة…"
        />
      </div>
    </>
  );
}

/** Shown while server PI bootstrap streams in — uses session cache when available. */
export function CheckoutStripePaymentFallback() {
  const { productSlug, productName, quantity } = useCheckoutCardForm();

  const cached = readStripePiCache(productSlug, quantity);
  const bootstrap: StripeCardBootstrap | null = cached
    ? {
        publishableKey: cached.publishableKey,
        clientSecret: cached.clientSecret,
        paymentIntentId: cached.paymentIntentId,
      }
    : null;

  useEffect(() => {
    void prefetchStripeCardCheckout({ productSlug, productName, quantity });
  }, [productSlug, productName, quantity]);

  return (
    <CheckoutStripeElementsProvider
      productSlug={productSlug}
      productName={productName}
      quantity={quantity}
      bootstrap={bootstrap}
    >
      <FallbackPaySection />
    </CheckoutStripeElementsProvider>
  );
}
