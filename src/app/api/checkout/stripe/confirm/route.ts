import { NextResponse } from "next/server";
import { getOrderById, markOrderPaid } from "@/lib/ordersRepository";
import { getStripe, isStripeCardCheckoutEnabled } from "@/lib/stripeServer";

/** Fallback when webhook is delayed — verifies Checkout Session after redirect. */
export async function POST(request: Request) {
  if (!isStripeCardCheckoutEnabled()) {
    return NextResponse.json({ paid: false }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { orderId?: string; sessionId?: string };
    const orderId = String(body.orderId ?? "").trim();
    const sessionId = String(body.sessionId ?? "").trim();
    if (!orderId || !sessionId) {
      return NextResponse.json({ error: "معرّفات ناقصة." }, { status: 400 });
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
    }
    if (order.status === "paid") {
      return NextResponse.json({ paid: true, order });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const matchesOrder =
      session.metadata?.orderId === orderId ||
      session.client_reference_id === orderId ||
      order.stripeCheckoutSessionId === sessionId;

    if (!matchesOrder) {
      return NextResponse.json({ error: "جلسة غير مطابقة." }, { status: 400 });
    }

    const paid =
      session.payment_status === "paid" ||
      (session.status === "complete" && session.payment_status !== "unpaid");

    if (paid) {
      markOrderPaid(orderId);
      const updated = getOrderById(orderId);
      return NextResponse.json({ paid: true, order: updated });
    }

    return NextResponse.json({ paid: false, order });
  } catch (err) {
    console.error("[api/checkout/stripe/confirm]", err);
    return NextResponse.json({ error: "تعذّر التحقق من الدفع." }, { status: 500 });
  }
}
