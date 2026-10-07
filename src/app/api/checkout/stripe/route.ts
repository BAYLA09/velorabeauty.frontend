import { NextResponse } from "next/server";
import { checkoutEmirates } from "@/config/productCheckout";
import type { BundleQuantity } from "@/config/pricing";
import {
  createOrder,
  setOrderStripeSession,
} from "@/lib/ordersRepository";
import { getSiteUrl } from "@/lib/siteUrl";
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

    const productSlug = String(body.productSlug ?? "").trim();
    const productName = String(body.productName ?? "").trim();
    const quantity = body.quantity;
    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const emirate = String(body.emirate ?? "").trim();
    const address = String(body.address ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (!productSlug || !productName) {
      return NextResponse.json({ error: "المنتج غير معروف." }, { status: 400 });
    }
    if (!isBundleQuantity(quantity)) {
      return NextResponse.json({ error: "العرض غير صالح." }, { status: 400 });
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

    const base = getSiteUrl();
    const cancelQuery = new URLSearchParams({
      product: productSlug,
      quantity: String(quantity),
    });

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
        productSlug,
        phone,
      },
      line_items: [
        {
          price_data: {
            currency: "aed",
            unit_amount: order.totalAed * 100,
            product_data: {
              name: productName,
              description: `Velora · عرض ${quantity}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${base}/order/thank-you?id=${encodeURIComponent(order.id)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout/card?${cancelQuery.toString()}`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "تعذّر إنشاء جلسة الدفع." }, { status: 500 });
    }

    setOrderStripeSession(order.id, session.id);

    return NextResponse.json({
      orderId: order.id,
      checkoutUrl: session.url,
    });
  } catch (err) {
    console.error("[api/checkout/stripe POST]", err);
    return NextResponse.json({ error: "تعذّر بدء الدفع. حاولي مجدداً." }, { status: 500 });
  }
}
