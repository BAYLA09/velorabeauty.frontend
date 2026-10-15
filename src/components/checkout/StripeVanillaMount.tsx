import Script from "next/script";
import { buildStripeVanillaMountScript } from "@/lib/stripeVanillaMountScript";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";

/** Single afterInteractive mount — avoids duplicate Payment Element instances. */
export function StripeVanillaMount({ bootstrap }: { bootstrap: StripeCardBootstrap }) {
  return (
    <Script
      id="velora-stripe-vanilla-mount"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: buildStripeVanillaMountScript(bootstrap) }}
    />
  );
}
