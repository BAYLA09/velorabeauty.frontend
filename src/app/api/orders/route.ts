import { NextResponse } from "next/server";
import { checkoutEmirates } from "@/config/productCheckout";
import type { BundleQuantity, PaymentMethod } from "@/config/pricing";
import { createOrder } from "@/lib/ordersRepository";

function isBundleQuantity(n: unknown): n is BundleQuantity {
  return n === 1 || n === 2 || n === 3;
}

function isPaymentMethod(m: unknown): m is PaymentMethod {
  return m === "card" || m === "cod";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const productSlug = String(body.productSlug ?? "").trim();
    const productName = String(body.productName ?? "").trim();
    const quantity = body.quantity;
    const paymentMethod = body.paymentMethod;
    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const emirate = String(body.emirate ?? "").trim();
    const address = String(body.address ?? "").trim();

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
    if (paymentMethod === "cod" && !address) {
      return NextResponse.json({ error: "أدخلي عنوان التوصيل." }, { status: 400 });
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
      paymentMethod,
      customerName,
      phone,
      emirate: resolvedEmirate,
      address: resolvedAddress,
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error("[api/orders POST]", err);
    return NextResponse.json({ error: "تعذّر حفظ الطلب. حاولي مرة أخرى." }, { status: 500 });
  }
}
