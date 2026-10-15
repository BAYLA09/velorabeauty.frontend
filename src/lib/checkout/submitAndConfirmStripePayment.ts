import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { formatCheckoutPayError } from "@/lib/checkout/formatCheckoutPayError";

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
          billing_details: input.billingDetails,
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
