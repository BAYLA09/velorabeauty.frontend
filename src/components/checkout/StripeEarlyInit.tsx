import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";

type Props = {
  publishableKey: string | null;
  bootstrap?: StripeCardBootstrap | null;
};

/** Runs before React — Stripe.js + optional PI bootstrap for zero-lag checkout. */
export function StripeEarlyInit({ publishableKey, bootstrap }: Props) {
  if (!publishableKey) return null;

  const bootJson = bootstrap
    ? JSON.stringify(bootstrap).replace(/</g, "\\u003c")
    : "null";

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function () {
  var pk = ${JSON.stringify(publishableKey)};
  var boot = ${bootJson};
  if (boot) window.__VELORA_STRIPE_BOOT = boot;
  function prime() {
    if (!window.Stripe || !pk) return;
    try {
      window.__VELORA_STRIPE = window.Stripe(pk, { locale: "ar" });
    } catch (e) {}
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prime);
  } else {
    prime();
  }
  prime();
})();
`,
      }}
    />
  );
}
