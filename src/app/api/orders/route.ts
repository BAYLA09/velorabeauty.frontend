import { NextResponse } from "next/server";
import { checkoutEmirates } from "@/config/productCheckout";
import type { BundleQuantity, PaymentMethod } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";
import {
  checkoutLinesForSync,
  enqueueStorefrontCheckoutAndFlush,
} from "@/lib/backendCheckout/capture";
import { isStorefrontOrderId, readMarketingConsent } from "@/lib/backendCheckout/contract";
import { createOrder } from "@/lib/ordersRepository";
import { queueOrderSheetExport } from "@/lib/ordersSheets/exportOrder";

function isBundleQuantity(n: unknown): n is BundleQuantity {
  return n === 1 || n === 2 || n === 3;
}

function isPaymentMethod(m: unknown): m is PaymentMethod {
  return m === "card" || m === "cod";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    let productSlug = String(body.productSlug ?? "").trim();
    let productName = String(body.productName ?? "").trim();
    let eligibleUnits: number | undefined;
    const quantity = body.quantity;
    const rawCartLines = body.cartLines;
    const paymentMethod = body.paymentMethod;
    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const emirate = String(body.emirate ?? "").trim();
    const address = String(body.address ?? "").trim();
    const email = String(body.email ?? "").trim();
    const marketingConsent = readMarketingConsent(body.marketingConsent);
    const externalCheckoutId = String(body.externalCheckoutId ?? "").trim();
    let syncLines: CartLine[] | null = null;

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
        return NextResponse.json({ error: "العرض غير صالح." }, { status: 400 });
      }
      productSlug = validated.cart.productSlug;
      productName = validated.cart.productName;
      eligibleUnits = validated.cart.eligibleUnits;
    }

    if (!productSlug || !productName) {
      return NextResponse.json({ error: "المنتج غير معروف." }, { status: 400 });
    }
    if (!isBundleQuantity(quantity)) {
      return NextResponse.json({ error: "العرض غير صالح." }, { status: 400 });
    }
    if (!isPaymentMethod(paymentMethod)) {
      return NextResponse.json({ error: "طريقة الدفع غير صالحة." }, { status: 400 });
    }
    if (!customerName || !phone) {
      return NextResponse.json({ error: "أكملي الاسم ورقم الهاتف." }, { status: 400 });
    }
    if (!address) {
      return NextResponse.json({ error: "أدخلي عنوان التوصيل." }, { status: 400 });
    }
    if (email && !isStorefrontOrderId(externalCheckoutId)) {
      return NextResponse.json(
        { error: "تعذّر ربط الطلب بجلسة الشراء. أعدي تحميل الصفحة." },
        { status: 400 },
      );
    }

    const resolvedEmirate =
      emirate && checkoutEmirates.includes(emirate as (typeof checkoutEmirates)[number])
        ? emirate
        : (checkoutEmirates[0] ?? "دبي");
    const resolvedAddress =
      address || (paymentMethod === "card" ? "يُؤكَّد بعد التواصل" : "");

    const order = createOrder({
      productSlug,
      productName,
      quantity,
      eligibleUnits,
      cartLines: syncLines ?? undefined,
      paymentMethod,
      customerName,
      phone,
      emirate: resolvedEmirate,
      address: resolvedAddress,
      customerEmail: email || undefined,
      marketingConsent,
      id: isStorefrontOrderId(externalCheckoutId) ? externalCheckoutId : undefined,
      backendExternalCheckoutId: isStorefrontOrderId(externalCheckoutId)
        ? externalCheckoutId
        : undefined,
    });

    if (paymentMethod === "cod") {
      queueOrderSheetExport({
        order,
        channel: "cod",
        cartLines: syncLines,
      });
    }

    if (email) {
      await enqueueStorefrontCheckoutAndFlush({
        email,
        marketingConsent,
        customerName,
        phone,
        emirate: resolvedEmirate,
        paymentMethod,
        externalCheckoutId: order.backendExternalCheckoutId ?? order.id,
        orderId: order.id,
        lines: checkoutLinesForSync({
          productSlug,
          quantity,
          cartLines: syncLines,
        }),
        phase: paymentMethod === "cod" ? "cod_placed" : "order_open",
      });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("[api/orders POST]", err);
    return NextResponse.json({ error: "تعذّر حفظ الطلب. حاولي مرة أخرى." }, { status: 500 });
  }
}
