import type Stripe from "stripe";
import { isStorefrontOrderId } from "@/lib/backendCheckout/contract";
import {
  createCardOrderWithPaymentIntent,
  getOrderById,
  getOrderByStripePaymentIntentId,
  type OrderRecord,
} from "@/lib/ordersRepository";
import { parseFinalizeCardOrderFromSnapshot, type ParsedCardOrderFields } from "@/lib/stripe/snapshotCardOrder";
import { parsePaymentIntentOrderSnapshot } from "@/lib/stripe/paymentIntentOrderMetadata";

export function resolveOrderForPaymentIntent(intent: Stripe.PaymentIntent): OrderRecord | null {
  const orderId = intent.metadata?.orderId?.trim();
  if (orderId) {
    const byId = getOrderById(orderId);
    if (byId) return byId;
  }
  if (intent.id) {
    const byPi = getOrderByStripePaymentIntentId(intent.id);
    if (byPi) return byPi;
  }
  return null;
}

function createInputFromParsed(
  parsed: ParsedCardOrderFields,
): Parameters<typeof createCardOrderWithPaymentIntent>[1] {
  return {
    productSlug: parsed.productSlug,
    productName: parsed.productName,
    quantity: parsed.quantity,
    eligibleUnits: parsed.eligibleUnits,
    cartLines: parsed.cartLines ?? undefined,
    paymentMethod: "card",
    customerName: parsed.customerName,
    phone: parsed.phone,
    emirate: parsed.emirate,
    address: parsed.address,
    customerEmail: parsed.email || undefined,
    marketingConsent: parsed.marketingConsent,
    attribution: parsed.attribution,
    id: isStorefrontOrderId(parsed.externalCheckoutId) ? parsed.externalCheckoutId : undefined,
    backendExternalCheckoutId: isStorefrontOrderId(parsed.externalCheckoutId)
      ? parsed.externalCheckoutId
      : undefined,
  };
}

export function ensureCardOrderForPaymentIntent(intent: Stripe.PaymentIntent): OrderRecord | null {
  const existing = resolveOrderForPaymentIntent(intent);
  if (existing) return existing;

  const snapshot = parsePaymentIntentOrderSnapshot(intent.metadata ?? {});
  if (!snapshot) return null;
  const parsed = parseFinalizeCardOrderFromSnapshot(snapshot);
  if (!parsed) return null;

  const { order } = createCardOrderWithPaymentIntent(intent.id, createInputFromParsed(parsed));
  return order;
}
