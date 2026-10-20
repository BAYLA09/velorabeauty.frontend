import { NextResponse } from "next/server";
import {
  checkoutLinesForSync,
  enqueueStorefrontCheckout,
} from "@/lib/backendCheckout/capture";
import { kickBackendCheckoutWorker } from "@/lib/backendCheckout/worker";
import { isStorefrontOrderId } from "@/lib/backendCheckout/contract";
import {
  createCardOrderWithPaymentIntent,
  getOrderById,
  getOrderByStripePaymentIntentId,
  setOrderStripePaymentIntent,
  updateOrderCardCustomerDetails,
} from "@/lib/ordersRepository";
import { parseFinalizeCardOrderBody } from "@/lib/stripe/parseFinalizeCardOrder";
import { stripeMetadataFromOrderSnapshot } from "@/lib/stripe/paymentIntentOrderMetadata";
import { getStripe, isStripeCardCheckoutEnabled } from "@/lib/stripeServer";

export async function POST(request: Request) {
  if (!isStripeCardCheckoutEnabled()) {
    return NextResponse.json({ error: "الدفع بالبطاقة غير مفعّل." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = parseFinalizeCardOrderBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }

    const stripe = getStripe();
    let order =
      getOrderByStripePaymentIntentId(parsed.paymentIntentId) ??
      (isStorefrontOrderId(parsed.externalCheckoutId)
        ? getOrderById(parsed.externalCheckoutId)
        : null);

    if (order?.status === "paid") {
      const paymentIntent = await stripe.paymentIntents.retrieve(parsed.paymentIntentId);
      return NextResponse.json({
        orderId: order.id,
        order,
        paymentIntentStatus: paymentIntent.status,
      });
    }

    if (order && order.paymentMethod === "card") {
      const updated = updateOrderCardCustomerDetails(order.id, {
        customerName: parsed.customerName,
        phone: parsed.phone,
        emirate: parsed.emirate,
        address: parsed.address,
        customerEmail: parsed.email || undefined,
        marketingConsent: parsed.marketingConsent,
      });
      order = updated ?? order;
      setOrderStripePaymentIntent(order.id, parsed.paymentIntentId);
    } else {
      const created = createCardOrderWithPaymentIntent(parsed.paymentIntentId, {
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
      });
      order = created.order;
    }

    const paymentIntent = await stripe.paymentIntents.update(parsed.paymentIntentId, {
      metadata: stripeMetadataFromOrderSnapshot(parsed.snapshot, { orderId: order.id }),
      ...(parsed.email ? { receipt_email: parsed.email } : {}),
    });

    if (parsed.email) {
      try {
        enqueueStorefrontCheckout({
          email: parsed.email,
          marketingConsent: parsed.marketingConsent,
          customerName: parsed.customerName,
          phone: parsed.phone,
          emirate: parsed.emirate,
          paymentMethod: "card",
          externalCheckoutId: order.backendExternalCheckoutId ?? order.id,
          orderId: order.id,
          stripePaymentIntentId: parsed.paymentIntentId,
          lines: checkoutLinesForSync({
            productSlug: parsed.productSlug,
            quantity: parsed.quantity,
            cartLines: parsed.cartLines,
          }),
          phase: "order_open",
        });
        kickBackendCheckoutWorker();
      } catch (syncErr) {
        console.error("[api/stripe/finalize-order] backend sync enqueue failed", syncErr);
      }
    }

    return NextResponse.json({
      orderId: order.id,
      order,
      paymentIntentStatus: paymentIntent.status,
    });
  } catch (err) {
    console.error("[api/stripe/finalize-order]", err);
    return NextResponse.json({ error: "تعذّر حفظ الطلب قبل الدفع." }, { status: 500 });
  }
}
