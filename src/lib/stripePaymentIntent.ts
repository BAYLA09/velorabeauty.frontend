import type { BundleQuantity } from "@/config/pricing";
import { getCheckoutTotal } from "@/config/pricing";
import { getSiteUrl } from "@/lib/siteUrl";
import { getStripe } from "@/lib/stripeServer";

export type CardPaymentIntentResult = {
  clientSecret: string;
  paymentIntentId: string;
  amountAed: number;
};

export async function createOrUpdateCardPaymentIntent(input: {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  paymentIntentId?: string;
}): Promise<CardPaymentIntentResult> {
  const { productSlug, productName, quantity, paymentIntentId } = input;
  const totalAed = getCheckoutTotal(quantity, "card");
  const amountFils = totalAed * 100;
  const stripe = getStripe();

  if (paymentIntentId) {
    const current = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (current.status === "succeeded" || current.status === "canceled") {
      throw new Error("payment_intent_expired");
    }
    const updated = await stripe.paymentIntents.update(paymentIntentId, {
      amount: amountFils,
      metadata: {
        productSlug,
        productName,
        quantity: String(quantity),
      },
    });
    if (!updated.client_secret) {
      throw new Error("payment_intent_missing_secret");
    }
    return {
      clientSecret: updated.client_secret,
      paymentIntentId: updated.id,
      amountAed: totalAed,
    };
  }

  const intent = await stripe.paymentIntents.create({
    amount: amountFils,
    currency: "aed",
    automatic_payment_methods: { enabled: true },
    metadata: {
      productSlug,
      productName,
      quantity: String(quantity),
      siteUrl: getSiteUrl(),
    },
  });

  if (!intent.client_secret) {
    throw new Error("payment_intent_missing_secret");
  }

  return {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amountAed: totalAed,
  };
}
