import { NextResponse } from "next/server";
import { checkoutEmirates } from "@/config/productCheckout";
import type { BundleQuantity } from "@/config/pricing";
import {
  createOrder,
  setOrderStripePaymentIntent,
} from "@/lib/ordersRepository";
import { getStripe, isStripeCardCheckoutEnabled } from "@/lib/stripeServer";

function isBundleQuantity(n: unknown): n is BundleQuantity {
  return n === 1 || n === 2 || n === 3;
}

export async function POST(request: Request) {
  if (!isStripeCardCheckoutEnabled()) {
    return NextResponse.json({ error: "الدفع بالبطاقة غير مفعّل." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const paymentIntentId = String(body.paymentIntentId ?? "").trim();
    const productSlug = String(body.productSlug ?? "").trim();
    const productName = String(body.productName ?? "").trim();
    const quantity = body.quantity;
    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const emirate = String(body.emirate ?? "").trim();
    const address = String(body.address ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (!paymentIntentId) {
      return NextResponse.json({ error: "جلسة الدفع غير جاهزة." }, { status: 400 });
    }
    if (!productSlug || !productName || !isBundleQuantity(quantity)) {
      return NextResponse.json({ error: "بيانات المنتج غير صالحة." }, { status: 400 });
    }
    if (!customerName || !phone || !address) {
      return NextResponse.json({ error: "أكملي الاسم والهاتف وعنوان التوصيل." }, { status: 400 });
    }

    const resolvedEmirate =
      emirate && checkoutEmirates.includes(emirate as (typeof checkoutEmirates)[number])
        ? emirate
        : (checkoutEmirates[0] ?? "دبي");

    const order = createOrder({
      productSlug,
      productName,
      quantity,
      paymentMethod: "card",
      customerName,
      phone,
      emirate: resolvedEmirate,
      address,
    });

    setOrderStripePaymentIntent(order.id, paymentIntentId);

    const metadata: Record<string, string> = {
      orderId: order.id,
      productSlug,
      productName,
      quantity: String(quantity),
      phone,
    };
    if (email) metadata.email = email;

    await getStripe().paymentIntents.update(paymentIntentId, {
      metadata,
      ...(email ? { receipt_email: email } : {}),
    });

    return NextResponse.json({ orderId: order.id, order });
  } catch (err) {
    console.error("[api/stripe/finalize-order]", err);
    return NextResponse.json({ error: "تعذّر حفظ الطلب قبل الدفع." }, { status: 500 });
  }
}
