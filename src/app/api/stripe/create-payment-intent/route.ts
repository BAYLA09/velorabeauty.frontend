import { NextResponse } from "next/server";
import type { BundleQuantity } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
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
    const rawEligible = body.eligibleUnits;
    const eligibleUnits =
      typeof rawEligible === "number" && rawEligible >= 1 && rawEligible <= 4
        ? rawEligible
        : undefined;
    const existingPi = String(body.paymentIntentId ?? "").trim();
    const rawCartLines = body.cartLines;
    let cartLines: CartLine[] | undefined;
    if (Array.isArray(rawCartLines) && rawCartLines.length > 0) {
      cartLines = rawCartLines
        .map((row) => {
          if (!row || typeof row !== "object") return null;
          const r = row as Record<string, unknown>;
          return {
            slug: String(r.slug ?? "").trim(),
            quantity: Number(r.quantity),
          };
        })
        .filter((l): l is CartLine => Boolean(l?.slug && l.quantity >= 1));
    }

    if (!productSlug || !productName || !isBundleQuantity(quantity)) {
      return NextResponse.json({ error: "بيانات المنتج غير صالحة." }, { status: 400 });
    }

    const result = await createOrUpdateCardPaymentIntent({
      productSlug,
      productName,
      quantity,
      eligibleUnits,
      cartLines,
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
