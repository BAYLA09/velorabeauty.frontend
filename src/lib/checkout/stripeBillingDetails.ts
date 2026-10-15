/**
 * Checkout does not collect a postal code (UAE addresses usually have none).
 * Stripe.js still requires `address.postal_code` when the Payment Element
 * is created with `fields.billingDetails.address: "never"`.
 */
export const STRIPE_BILLING_POSTAL_CODE_FALLBACK = "00000";

export type StripeBillingDetails = {
  name: string;
  email?: string;
  phone?: string;
  /** Street / delivery details from the checkout form. */
  addressLine1?: string;
  /** Building or apartment. Omitted when blank — Stripe rejects an empty line2. */
  addressLine2?: string;
  addressCity?: string;
  addressState?: string;
  /** Used when the customer entered one. Otherwise {@link STRIPE_BILLING_POSTAL_CODE_FALLBACK}. */
  addressPostalCode?: string;
  addressCountry?: string;
};

function nonempty(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Stripe.js billing_details for confirmPayment when address is not collected in the Element.
 * Every address key Stripe treats as required is always present: line1, city, state,
 * postal_code, and country. line2 is included only when the form has a building.
 */
export function buildConfirmPaymentBillingDetails(input: StripeBillingDetails) {
  const email = nonempty(input.email);
  const phone = nonempty(input.phone);
  const city = nonempty(input.addressCity);
  const line1 = nonempty(input.addressLine1) || city || "UAE";
  const line2 = nonempty(input.addressLine2);
  const state = nonempty(input.addressState) || city || line1;
  const postalCode = nonempty(input.addressPostalCode) || STRIPE_BILLING_POSTAL_CODE_FALLBACK;
  const country = (nonempty(input.addressCountry) || "AE").toUpperCase();

  return {
    name: input.name.trim(),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    address: {
      line1,
      ...(line2 ? { line2 } : {}),
      city: city || line1,
      state,
      postal_code: postalCode,
      country,
    },
  };
}
