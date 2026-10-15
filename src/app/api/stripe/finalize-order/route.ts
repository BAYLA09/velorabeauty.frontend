import { NextResponse } from "next/server";
import { checkoutEmirates } from "@/config/productCheckout";
import type { BundleQuantity } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";
import {
  checkoutLinesForSync,
  enqueueStorefrontCheckout,
} from "@/lib/backendCheckout/capture";
import { kickBackendCheckoutWorker } from "@/lib/backendCheckout/worker";
import { isStorefrontOrderId, readMarketingConsent } from "@/lib/backendCheckout/contract";
import {
  createOrder,
  setOrderStripePaymentIntent,
} from "@/lib/ordersRepository";
import { validateUaeMobilePhone } from "@/lib/phone/uaePhone";
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
    let productSlug = String(body.productSlug ?? "").trim();
    let productName = String(body.productName ?? "").trim();
    let eligibleUnits: number | undefined;
    const quantity = body.quantity;
    const rawCartLines = body.cartLines;
    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const emirate = String(body.emirate ?? "").trim();
    const address = String(body.address ?? "").trim();
    const email = String(body.email ?? "").trim();
    const marketingConsent = readMarketingConsent(body.marketingConsent);
    const externalCheckoutId = String(body.externalCheckoutId ?? "").trim();
    let syncLines: CartLine[] | null = null;

    if (!paymentIntentId) {
      return NextResponse.json({ error: "جلسة الدفع غير جاهزة." }, { status: 400 });
    }
    if (Array.isArray(rawCartLines) && rawCartLines.length > 0) {
      const lines: CartLine[] = rawCartLines
        .map((row) => {
          if (!row || typeof row !== "object") return null;
          const r = row as Record<string, unknown>;
          return {
            slug: String(r.slug ?? "").trim(),
            quantity: Number(r.quantity),
          };
        })
        .filter((l): l is CartLine => Boolean(l?.slug && l.quantity >= 1));
      syncLines = lines;
      const validated = validateCartForCheckout(lines);
      if (!validated.ok) {
        return NextResponse.json({ error: validated.error }, { status: 400 });
      }
      if (!isBundleQuantity(quantity) || quantity !== validated.cart.bundleQuantity) {
        return NextResponse.json({ error: "بيانات المنتج غير صالحة." }, { status: 400 });
      }
      productSlug = validated.cart.productSlug;
      productName = validated.cart.productName;
      eligibleUnits = validated.cart.eligibleUnits;
    }

    if (!productSlug || !productName || !isBundleQuantity(quantity)) {
      return NextResponse.json({ error: "بيانات المنتج غير صالحة." }, { status: 400 });
    }
    if (!customerName || !phone || !address) {
      return NextResponse.json({ error: "أكملي الاسم والهاتف وعنوان التوصيل." }, { status: 400 });
    }
    const phoneCheck = validateUaeMobilePhone(phone);
    if (!phoneCheck.ok) {
      return NextResponse.json({ error: phoneCheck.error }, { status: 400 });
    }
    const resolvedPhone = phoneCheck.normalized;

    const resolvedEmirate =
      emirate && checkoutEmirates.includes(emirate as (typeof checkoutEmirates)[number])
        ? emirate
        : (checkoutEmirates[0] ?? "دبي");

    const order = createOrder({
      productSlug,
      productName,
      quantity,
      eligibleUnits,
      cartLines: syncLines ?? undefined,
      paymentMethod: "card",
      customerName,
      phone: resolvedPhone,
      emirate: resolvedEmirate,
      address,
      customerEmail: email || undefined,
      marketingConsent,
      id: isStorefrontOrderId(externalCheckoutId) ? externalCheckoutId : undefined,
      backendExternalCheckoutId: isStorefrontOrderId(externalCheckoutId)
        ? externalCheckoutId
        : undefined,
    });

    setOrderStripePaymentIntent(order.id, paymentIntentId);

    const metadata: Record<string, string> = {
      orderId: order.id,
      productSlug,
      productName,
      quantity: String(quantity),
      phone: resolvedPhone,
    };
    if (email) metadata.email = email;

    await getStripe().paymentIntents.update(paymentIntentId, {
      metadata,
      ...(email ? { receipt_email: email } : {}),
    });

    if (email) {
      try {
        enqueueStorefrontCheckout({
          email,
          marketingConsent,
          customerName,
          phone,
          emirate: resolvedEmirate,
          paymentMethod: "card",
          externalCheckoutId: order.backendExternalCheckoutId ?? order.id,
          orderId: order.id,
          stripePaymentIntentId: paymentIntentId,
          lines: checkoutLinesForSync({
            productSlug,
            quantity,
            cartLines: syncLines,
          }),
          phase: "order_open",
        });
        kickBackendCheckoutWorker();
      } catch (syncErr) {
        console.error("[api/stripe/finalize-order] backend sync enqueue failed", syncErr);
      }
    }

    return NextResponse.json({ orderId: order.id, order });
  } catch (err) {
    console.error("[api/stripe/finalize-order]", err);
    return NextResponse.json({ error: "تعذّر حفظ الطلب قبل الدفع." }, { status: 500 });
  }
}
