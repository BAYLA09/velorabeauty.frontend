import { NextResponse } from "next/server";
import type { PaymentMethod } from "@/config/pricing";
import { computeCartPricing, normalizeCartLines } from "@/lib/cart/cartPricing";
import type { CartLine } from "@/lib/cart/cartTypes";

function isPaymentMethod(m: unknown): m is PaymentMethod {
  return m === "card" || m === "cod";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const rawLines = body.lines;
    const paymentMethod = body.paymentMethod;

    if (!Array.isArray(rawLines)) {
      return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
    }

    const lines: CartLine[] = rawLines
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const r = row as Record<string, unknown>;
        return {
          slug: String(r.slug ?? "").trim(),
          quantity: Number(r.quantity),
        };
      })
      .filter((l): l is CartLine => Boolean(l?.slug && l.quantity >= 1));

    const normalized = normalizeCartLines(lines);
    const pricing = computeCartPricing(
      normalized,
      isPaymentMethod(paymentMethod) ? paymentMethod : null,
    );

    return NextResponse.json({ lines: normalized, pricing });
  } catch (err) {
    console.error("[api/cart/quote]", err);
    return NextResponse.json({ error: "Quote failed." }, { status: 500 });
  }
}
