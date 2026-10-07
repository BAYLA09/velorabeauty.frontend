import Script from "next/script";
import type { ReactNode } from "react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://js.stripe.com" />
      <link rel="preconnect" href="https://m.stripe.network" crossOrigin="anonymous" />
      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
      {children}
    </>
  );
}
