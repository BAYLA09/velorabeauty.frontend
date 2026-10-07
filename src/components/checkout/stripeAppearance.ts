import type { Appearance } from "@stripe/stripe-js";

/** Lara / Stripe Checkout–style fields (Arabic locale on Elements). */
export const stripeElementsAppearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#1773b0",
    colorText: "#1a1a1a",
    colorTextPlaceholder: "#737373",
    borderRadius: "6px",
    fontFamily: "system-ui, sans-serif",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #d9d9d9",
      boxShadow: "none",
      padding: "12px",
    },
    ".Input:focus": {
      border: "1px solid #1773b0",
      boxShadow: "0 0 0 1px #1773b0",
    },
    ".Label": {
      fontWeight: "500",
      marginBottom: "6px",
    },
  },
};
