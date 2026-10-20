import type Stripe from "stripe";
import { recoverPaidOrderCheckout } from "@/lib/backendCheckout/capture";
import { getOrderById, markOrderPaid, type OrderRecord } from "@/lib/ordersRepository";
import { exportPaidCardOrderToGoogleSheetsById } from "@/lib/ordersSheets/exportOrder";
import { ensureCardOrderForPaymentIntent } from "@/lib/stripe/cardPaymentIntentOrder";

export { ensureCardOrderForPaymentIntent, resolveOrderForPaymentIntent } from "@/lib/stripe/cardPaymentIntentOrder";

export async function fulfillSucceededCardPaymentIntent(
  intent: Stripe.PaymentIntent,
): Promise<OrderRecord | null> {
  const order = ensureCardOrderForPaymentIntent(intent);
  if (!order) {
    console.warn("[stripe] payment_intent.succeeded without resolvable order", {
      paymentIntentId: intent.id,
    });
    return null;
  }

  markOrderPaid(order.id);
  const paid = getOrderById(order.id);
  if (!paid) return null;

  try {
    await exportPaidCardOrderToGoogleSheetsById(paid.id);
  } catch (err) {
    console.error(
      "[stripe] card sheet export failed",
      err instanceof Error ? err.message : err,
    );
  }

  try {
    recoverPaidOrderCheckout(paid);
  } catch (err) {
    console.error(
      "[stripe] backend checkout sync failed",
      err instanceof Error ? err.message : err,
    );
  }

  return getOrderById(paid.id);
}
