import Script from "next/script";
import type { ReactNode } from "react";
import { StripeEarlyInit } from "@/components/checkout/StripeEarlyInit";
import { getStripePublishableKey, isStripeCardCheckoutEnabled } from "@/lib/stripeServer";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const stripeOn = isStripeCardCheckoutEnabled();
  const publishableKey = stripeOn ? getStripePublishableKey() : null;

  return (
    <>
      <link rel="preconnect" href="https://js.stripe.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.stripe.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://js.stripe.com" />
      <link rel="dns-prefetch" href="https://api.stripe.com" />
      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
      <StripeEarlyInit publishableKey={publishableKey} />
      {children}
    </>
  );
}
