import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { recoverPaidOrderCheckout } from "@/lib/backendCheckout/capture";
import {
  getOrderById,
  getOrderByStripeSessionId,
  markOrderPaid,
} from "@/lib/ordersRepository";
import { exportPaidCardOrderToGoogleSheetsById } from "@/lib/ordersSheets/exportOrder";
import { fulfillSucceededCardPaymentIntent } from "@/lib/stripe/fulfillCardPaymentIntent";
import { getStripe } from "@/lib/stripeServer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET missing");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;
      await fulfillSucceededCardPaymentIntent(intent);
    } else if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid" || session.status === "complete") {
        const orderId = session.metadata?.orderId ?? session.client_reference_id ?? undefined;
        let paidOrderId: string | null = null;
        if (orderId) {
          markOrderPaid(orderId);
          paidOrderId = orderId;
        } else if (session.id) {
          const order = getOrderByStripeSessionId(session.id);
          if (order) {
            markOrderPaid(order.id);
            paidOrderId = order.id;
          }
        }
        const paidOrder = paidOrderId ? getOrderById(paidOrderId) : null;
        if (paidOrder) {
          try {
            await exportPaidCardOrderToGoogleSheetsById(paidOrder.id);
          } catch (err) {
            console.error(
              "[stripe/webhook] card sheet export failed",
              err instanceof Error ? err.message : err,
            );
          }
          try {
            recoverPaidOrderCheckout(paidOrder);
          } catch (err) {
            console.error(
              "[stripe/webhook] backend checkout sync failed",
              err instanceof Error ? err.message : err,
            );
          }
        }
      }
    }
  } catch (err) {
    console.error("[stripe/webhook] handler error", err);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
