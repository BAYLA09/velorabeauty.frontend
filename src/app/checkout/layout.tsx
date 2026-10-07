import Script from "next/script";
import type { ReactNode } from "react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
      {children}
    </>
  );
}
