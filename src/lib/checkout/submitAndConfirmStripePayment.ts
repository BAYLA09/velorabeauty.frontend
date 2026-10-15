import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { formatCheckoutPayError } from "@/lib/checkout/formatCheckoutPayError";

export type StripeBillingDetails = {
  name: string;
  email?: string;
  phone?: string;
  /** Required when Payment Element has `billingDetails.address: never` (UAE store). */
  addressLine1?: string;
  addressCity?: string;
  addressCountry?: string;
};

/** Stripe.js billing_details for confirmPayment when address is not collected in the Element. */
export function buildConfirmPaymentBillingDetails(input: StripeBillingDetails) {
  const line1 = input.addressLine1?.trim();
  const city = input.addressCity?.trim();
  return {
    name: input.name,
    ...(input.email ? { email: input.email } : {}),
    ...(input.phone ? { phone: input.phone } : {}),
    address: {
      country: (input.addressCountry?.trim() || "AE").toUpperCase(),
      ...(line1 ? { line1 } : {}),
      ...(city ? { city, state: city } : {}),
    },
  };
}

/** Payment Element requires `elements.submit()` before `confirmPayment` (Stripe.js). */
export async function submitAndConfirmStripePayment(
  stripe: Stripe,
  elements: StripeElements,
  input: {
    returnUrl: string;
    billingDetails: StripeBillingDetails;
  },
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const submitResult = await elements.submit();
    if (submitResult.error) {
      return {
        ok: false,
        message: submitResult.error.message ?? "تعذّر التحقق من بيانات البطاقة.",
      };
    }

    const confirmResult = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: input.returnUrl,
        payment_method_data: {
          billing_details: buildConfirmPaymentBillingDetails(input.billingDetails),
        },
      },
      redirect: "if_required",
    });

    if (confirmResult.error) {
      return {
        ok: false,
        message: confirmResult.error.message ?? "تعذّر إتمام الدفع.",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("[submitAndConfirmStripePayment]", err);
    return { ok: false, message: formatCheckoutPayError(err) };
  }
}
