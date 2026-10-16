import { exportPaidCardOrderToGoogleSheetsById } from "@/lib/ordersSheets/exportOrder";
import { getDb } from "@/lib/db";
import { markOrderPaid, wasOrderSheetExported } from "@/lib/ordersRepository";
import { getStripe } from "@/lib/stripeServer";

/** Stripe PI succeeded but order still awaiting_payment (missed confirm) — mark paid + sheet export. */
export async function repairAwaitingCardOrders(limit = 20): Promise<{
  scanned: number;
  markedPaid: number;
  exported: number;
}> {
  const capped = Math.min(Math.max(1, limit), 50);
  const rows = getDb()
    .prepare(
      `SELECT id, stripe_payment_intent_id FROM orders
       WHERE payment_method = 'card'
         AND status IN ('awaiting_payment', 'pending')
         AND stripe_payment_intent_id IS NOT NULL
         AND TRIM(stripe_payment_intent_id) != ''
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .all(capped) as { id: string; stripe_payment_intent_id: string }[];

  const stripe = getStripe();
  let markedPaid = 0;
  let exported = 0;

  for (const row of rows) {
    const piId = row.stripe_payment_intent_id?.trim();
    if (!piId) continue;
    try {
      const intent = await stripe.paymentIntents.retrieve(piId);
      if (intent.status !== "succeeded") continue;
      const metaOrderId = intent.metadata?.orderId?.trim();
      if (metaOrderId && metaOrderId !== row.id) continue;
      markOrderPaid(row.id);
      markedPaid += 1;
      await exportPaidCardOrderToGoogleSheetsById(row.id);
      if (wasOrderSheetExported(row.id, "card")) exported += 1;
    } catch (err) {
      console.error("[repair-awaiting-card]", row.id, err);
    }
  }

  return { scanned: rows.length, markedPaid, exported };
}
