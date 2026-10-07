import { NextResponse } from "next/server";
import type { BundleQuantity } from "@/config/pricing";
import { createOrUpdateCardPaymentIntent } from "@/lib/stripePaymentIntent";
import { isStripeCardCheckoutEnabled } from "@/lib/stripeServer";

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

    const result = await createOrUpdateCardPaymentIntent({
      productSlug,
      productName,
      quantity,
      paymentIntentId: existingPi || undefined,
    });

    return NextResponse.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      amount: result.amountAed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "payment_intent_expired") {
      return NextResponse.json({ error: "جلسة الدفع منتهية — حدّثي الصفحة." }, { status: 400 });
    }
    console.error("[api/stripe/create-payment-intent]", err);
    return NextResponse.json({ error: "تعذّر تجهيز نموذج الدفع." }, { status: 500 });
  }
}
