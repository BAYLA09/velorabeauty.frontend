import type { Stripe, StripeElements } from "@stripe/stripe-js";

export type StripeBillingDetails = {
  name: string;
  email?: string;
  phone?: string;
};

/** Payment Element requires `elements.submit()` before `confirmPayment` (Stripe.js). */
export async function submitAndConfirmStripePayment(
  stripe: Stripe,
  elements: StripeElements,
  input: {
    clientSecret?: string;
    returnUrl: string;
    billingDetails: StripeBillingDetails;
  },
): Promise<{ ok: true } | { ok: false; message: string }> {
  const submitResult = await elements.submit();
  if (submitResult.error) {
    return {
      ok: false,
      message: submitResult.error.message ?? "تعذّر التحقق من بيانات البطاقة.",
    };
  }

  const confirmParams = {
    return_url: input.returnUrl,
    payment_method_data: {
      billing_details: input.billingDetails,
    },
  };

  const confirmResult = input.clientSecret
    ? await stripe.confirmPayment({
        elements,
        clientSecret: input.clientSecret,
        confirmParams,
      })
    : await stripe.confirmPayment({
        elements,
        confirmParams,
      });

  if (confirmResult.error) {
    return {
      ok: false,
      message: confirmResult.error.message ?? "تعذّر إتمام الدفع.",
    };
  }

  return { ok: true };
}
