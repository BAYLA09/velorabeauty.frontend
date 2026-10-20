import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type Stripe from "stripe";
import { getDb } from "@/lib/db";
import {
  claimCardSheetExport,
  completeCardSheetExportClaim,
  createCardOrderWithPaymentIntent,
  getOrderByStripePaymentIntentId,
  markOrderPaid,
  wasOrderSheetExported,
} from "@/lib/ordersRepository";
import { ensureCardOrderForPaymentIntent } from "@/lib/stripe/cardPaymentIntentOrder";
import {
  snapshotFromCheckoutFields,
  stripeMetadataFromOrderSnapshot,
} from "@/lib/stripe/paymentIntentOrderMetadata";

function buildIntent(paymentIntentId: string): Stripe.PaymentIntent {
  const snapshot = snapshotFromCheckoutFields({
    productSlug: "eye-serum",
    productName: "Eye Serum",
    quantity: 1,
    customerName: "Webhook Customer",
    phone: "+971501234567",
    address: "Test Address",
    emirate: "دبي",
    email: "paid@example.com",
    marketingConsent: true,
  });
  const metadata = stripeMetadataFromOrderSnapshot(snapshot);
  return {
    id: paymentIntentId,
    object: "payment_intent",
    metadata,
  } as Stripe.PaymentIntent;
}

describe("card payment intent fulfillment", () => {
  it("webhook-only path creates an order from metadata", () => {
    const pi = `pi_test_webhook_${Date.now()}`;
    const order = ensureCardOrderForPaymentIntent(buildIntent(pi));
    assert.ok(order);
    assert.equal(getOrderByStripePaymentIntentId(pi)?.id, order!.id);
    markOrderPaid(order!.id);
    assert.equal(getOrderByStripePaymentIntentId(pi)?.status, "paid");
  });

  it("finalize-style create is idempotent for the same payment intent", () => {
    const pi = `pi_test_finalize_${Date.now()}`;
    const input = {
      productSlug: "eye-serum",
      productName: "Eye Serum",
      quantity: 1 as const,
      paymentMethod: "card" as const,
      customerName: "Finalize",
      phone: "+971501234567",
      emirate: "دبي",
      address: "Addr",
    };
    const first = createCardOrderWithPaymentIntent(pi, input);
    const second = createCardOrderWithPaymentIntent(pi, input);
    assert.equal(first.created, true);
    assert.equal(second.created, false);
    assert.equal(first.order.id, second.order.id);
  });

  it("racing webhook and finalize share one order row", () => {
    const pi = `pi_test_race_${Date.now()}`;
    const intent = buildIntent(pi);
    const fromWebhook = ensureCardOrderForPaymentIntent(intent);
    const fromFinalize = createCardOrderWithPaymentIntent(pi, {
      productSlug: "eye-serum",
      productName: "Eye Serum",
      quantity: 1,
      paymentMethod: "card",
      customerName: "Webhook Customer",
      phone: "+971501234567",
      emirate: "دبي",
      address: "Test Address",
    });
    assert.ok(fromWebhook);
    assert.equal(fromWebhook!.id, fromFinalize.order.id);
  });

  it("replayed ensure does not create a second order", () => {
    const pi = `pi_test_replay_${Date.now()}`;
    const intent = buildIntent(pi);
    ensureCardOrderForPaymentIntent(intent);
    ensureCardOrderForPaymentIntent(intent);
    const rows = getDb()
      .prepare(`SELECT COUNT(*) AS n FROM orders WHERE stripe_payment_intent_id = ?`)
      .get(pi) as { n: number };
    assert.equal(rows.n, 1);
  });

  it("card sheet export claim allows only one winner", () => {
    const pi = `pi_test_claim_${Date.now()}`;
    const { order } = createCardOrderWithPaymentIntent(pi, {
      productSlug: "eye-serum",
      productName: "Eye Serum",
      quantity: 1,
      paymentMethod: "card",
      customerName: "Claim",
      phone: "+971501234567",
      emirate: "دبي",
      address: "Addr",
    });
    getDb().prepare(`UPDATE orders SET status = 'paid' WHERE id = ?`).run(order.id);

    const claimA = claimCardSheetExport(order.id);
    const claimB = claimCardSheetExport(order.id);
    assert.ok(claimA);
    assert.equal(claimB, null);
    completeCardSheetExportClaim(order.id, claimA!);
    assert.equal(wasOrderSheetExported(order.id, "card"), true);
  });
});
