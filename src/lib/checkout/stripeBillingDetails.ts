/**
 * Payment Element sets billingDetails.name, email, phone, and address to `never`.
 * Stripe.js then requires each of those values on confirmPayment.
 * Checkout email is optional and many UAE addresses have no postal code.
 */
export const STRIPE_BILLING_POSTAL_CODE_FALLBACK = "00000";
export const STRIPE_BILLING_NAME_FALLBACK = "Velora Customer";
export const STRIPE_BILLING_PHONE_FALLBACK = "+971500000000";
/** Valid address Stripe accepts when the customer leaves email blank. */
export const STRIPE_BILLING_EMAIL_FALLBACK = "checkout@velorabeauty.world";

const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

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

/** Stripe rejects confirmPayment when email is missing or not a real address. */
export function resolveStripeBillingEmail(email: string | undefined): string {
  const trimmed = nonempty(email);
  if (trimmed && EMAIL_PATTERN.test(trimmed)) return trimmed;
  return STRIPE_BILLING_EMAIL_FALLBACK;
}

/**
 * billing_details for confirmPayment when the Payment Element hides billing fields.
 * name, email, and phone are always set. Address always includes line1, city, state,
 * postal_code, and country. line2 is included only when the form has a building.
 */
export function buildConfirmPaymentBillingDetails(input: StripeBillingDetails) {
  const city = nonempty(input.addressCity);
  const line1 = nonempty(input.addressLine1) || city || "UAE";
  const line2 = nonempty(input.addressLine2);
  const state = nonempty(input.addressState) || city || line1;
  const postalCode = nonempty(input.addressPostalCode) || STRIPE_BILLING_POSTAL_CODE_FALLBACK;
  const country = (nonempty(input.addressCountry) || "AE").toUpperCase();

  return {
    name: nonempty(input.name) || STRIPE_BILLING_NAME_FALLBACK,
    email: resolveStripeBillingEmail(input.email),
    phone: nonempty(input.phone) || STRIPE_BILLING_PHONE_FALLBACK,
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
