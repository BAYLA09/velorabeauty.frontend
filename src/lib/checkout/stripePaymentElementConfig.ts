/** UAE storefront — required on confirmPayment when Payment Element skips address. */
export const STRIPE_CHECKOUT_BILLING_COUNTRY = "AE";

/** Shared by React PaymentElement and vanilla mount (keep in sync). */
export const stripePaymentElementFields = {
  billingDetails: {
    name: "never" as const,
    email: "never" as const,
    phone: "never" as const,
    address: "never" as const,
  },
};

export const stripePaymentElementCreateOptions = {
  layout: "accordion" as const,
  paymentMethodOrder: ["card"],
  wallets: {
    applePay: "never" as const,
    googlePay: "never" as const,
    link: "never" as const,
  },
  fields: stripePaymentElementFields,
  terms: { card: "never" as const },
};
