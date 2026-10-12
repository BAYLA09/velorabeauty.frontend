import Script from "next/script";
import type { ReactNode } from "react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://js.stripe.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.stripe.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://js.stripe.com" />
      <link rel="dns-prefetch" href="https://api.stripe.com" />
      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
      {children}
    </>
  );
}
