import { stripeElementsAppearance } from "@/components/checkout/stripeAppearance";
import { stripePaymentElementCreateOptions } from "@/lib/checkout/stripePaymentElementConfig";
import type { StripeCardBootstrap } from "@/lib/stripeCardBootstrap";

/** Inline script: mount Stripe Payment Element before React hydrates (~ saves seconds). */
export function buildStripeVanillaMountScript(bootstrap: StripeCardBootstrap): string {
  const appearance = JSON.stringify(stripeElementsAppearance).replace(/</g, "\\u003c");
  const peOptions = JSON.stringify(stripePaymentElementCreateOptions).replace(/</g, "\\u003c");
  const boot = JSON.stringify(bootstrap).replace(/</g, "\\u003c");

  return `
(function () {
  var boot = ${boot};
  window.__VELORA_STRIPE_BOOT = boot;
  if (window.__VELORA_PE_MOUNTED || window.__VELORA_PE_MOUNTING) return;
  window.__VELORA_PE_MOUNTING = true;

  function mount() {
    var host = document.getElementById("velora-stripe-payment-mount");
    if (!host || !window.Stripe) {
      requestAnimationFrame(mount);
      return;
    }
    if (window.__VELORA_PE_MOUNTED) {
      window.__VELORA_PE_MOUNTING = false;
      return;
    }
    try {
      var stripe = window.__VELORA_STRIPE || window.Stripe(boot.publishableKey, { locale: "ar" });
      window.__VELORA_STRIPE = stripe;
      var elements = stripe.elements({
        clientSecret: boot.clientSecret,
        locale: "ar",
        appearance: ${appearance},
      });
      window.__VELORA_STRIPE_ELEMENTS = elements;
      var pe = elements.create("payment", ${peOptions});
      pe.on("ready", function () {
        window.__VELORA_PE_READY = true;
        document.dispatchEvent(new Event("velora-stripe-ready"));
      });
      pe.mount("#velora-stripe-payment-mount");
      window.__VELORA_PE_MOUNTED = true;
    } catch (e) {
      console.error("[velora-stripe-mount]", e);
      window.__VELORA_PE_MOUNTING = false;
      return;
    }
    window.__VELORA_PE_MOUNTING = false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
`;
}
