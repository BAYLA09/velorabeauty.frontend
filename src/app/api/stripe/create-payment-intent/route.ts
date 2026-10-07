import { NextResponse } from "next/server";
import type { BundleQuantity } from "@/config/pricing";
import { getCheckoutTotal } from "@/config/pricing";
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
    const existingPi = String(body.paymentIntentId ?? "").trim();

    if (!productSlug || !productName || !isBundleQuantity(quantity)) {
      return NextResponse.json({ error: "بيانات المنتج غير صالحة." }, { status: 400 });
    }

    const totalAed = getCheckoutTotal(quantity, "card");
    const amountFils = totalAed * 100;
    const stripe = getStripe();

    if (existingPi) {
      const current = await stripe.paymentIntents.retrieve(existingPi);
      if (current.status === "succeeded" || current.status === "canceled") {
        return NextResponse.json({ error: "جلسة الدفع منتهية — حدّثي الصفحة." }, { status: 400 });
      }
      const updated = await stripe.paymentIntents.update(existingPi, {
        amount: amountFils,
        metadata: {
          productSlug,
          productName,
          quantity: String(quantity),
        },
      });
      if (!updated.client_secret) {
        return NextResponse.json({ error: "تعذّر تحديث الدفع." }, { status: 500 });
      }
      return NextResponse.json({
        clientSecret: updated.client_secret,
        paymentIntentId: updated.id,
        amount: totalAed,
      });
    }

    const intent = await stripe.paymentIntents.create({
      amount: amountFils,
      currency: "aed",
      automatic_payment_methods: { enabled: true },
      metadata: {
        productSlug,
        productName,
        quantity: String(quantity),
        siteUrl: getSiteUrl(),
      },
    });

    if (!intent.client_secret) {
      return NextResponse.json({ error: "تعذّر إنشاء الدفع." }, { status: 500 });
    }

    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: totalAed,
    });
  } catch (err) {
    console.error("[api/stripe/create-payment-intent]", err);
    return NextResponse.json({ error: "تعذّر تجهيز نموذج الدفع." }, { status: 500 });
  }
}
