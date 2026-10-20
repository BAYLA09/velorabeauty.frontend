import type { BundleQuantity } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { resolveCheckoutTotalAed } from "@/lib/checkoutTotals";
import { getSiteUrl } from "@/lib/siteUrl";
import {
  snapshotFromCheckoutFields,
  stripeMetadataFromOrderSnapshot,
} from "@/lib/stripe/paymentIntentOrderMetadata";
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
  eligibleUnits?: number;
  cartLines?: CartLine[];
  paymentIntentId?: string;
}): Promise<CardPaymentIntentResult> {
  const { productSlug, productName, quantity, eligibleUnits, cartLines, paymentIntentId } =
    input;
  const totalAed = resolveCheckoutTotalAed(
    quantity,
    "card",
    eligibleUnits,
    cartLines,
    productSlug,
  );
  const amountFils = Math.round(totalAed * 100);
  const stripe = getStripe();

  if (paymentIntentId) {
    const current = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (current.status === "succeeded" || current.status === "canceled") {
      throw new Error("payment_intent_expired");
    }
    const snapshot = snapshotFromCheckoutFields({
      productSlug,
      productName,
      quantity,
      eligibleUnits,
      cartLines,
    });
    const updated = await stripe.paymentIntents.update(paymentIntentId, {
      amount: amountFils,
      metadata: stripeMetadataFromOrderSnapshot(snapshot),
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

  const snapshot = snapshotFromCheckoutFields({
    productSlug,
    productName,
    quantity,
    eligibleUnits,
    cartLines,
  });
  const intent = await stripe.paymentIntents.create({
    amount: amountFils,
    currency: "aed",
    payment_method_types: ["card"],
    metadata: stripeMetadataFromOrderSnapshot(snapshot, { siteUrl: getSiteUrl() }),
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
