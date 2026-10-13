import { NextResponse } from "next/server";
import type { PaymentMethod } from "@/config/pricing";
import { checkoutLinesForSync, enqueueStorefrontCheckout } from "@/lib/backendCheckout/capture";
import {
  isCheckoutEmail,
  isStorefrontOrderId,
  readMarketingConsent,
} from "@/lib/backendCheckout/contract";
import type { CartLine } from "@/lib/cart/cartTypes";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";

export const runtime = "nodejs";

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "card" || value === "cod";
}

/**
 * Browser-facing capture. The store API key stays on the server.
 * Backend failures are swallowed inside enqueueStorefrontCheckout.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = String(body.email ?? "");
    const marketingConsent = readMarketingConsent(body.marketingConsent);
    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const emirate = String(body.emirate ?? "").trim();
    const paymentMethod = body.paymentMethod;
    const externalCheckoutId = String(body.externalCheckoutId ?? "").trim();
    const paymentIntentId = String(body.paymentIntentId ?? "").trim();
    const productSlug = String(body.productSlug ?? "").trim();
    const quantity = Number(body.quantity);

    if (!isCheckoutEmail(email)) {
      return NextResponse.json({ ok: true, skipped: "email" });
    }
    if (!isStorefrontOrderId(externalCheckoutId)) {
      return NextResponse.json({ ok: true, skipped: "external_id" });
    }
    if (!isPaymentMethod(paymentMethod) || !productSlug || !Number.isFinite(quantity)) {
      return NextResponse.json({ ok: true, skipped: "cart" });
    }

    const rawLines = Array.isArray(body.cartLines) ? body.cartLines : null;
    const cartLines: CartLine[] | null = rawLines
      ? rawLines
          .map((row) => {
            if (!row || typeof row !== "object") return null;
            const record = row as Record<string, unknown>;
            return {
              slug: String(record.slug ?? "").trim(),
              quantity: Number(record.quantity),
            };
          })
          .filter((line): line is CartLine => Boolean(line?.slug && line.quantity >= 1))
      : null;

    const lines = checkoutLinesForSync({ productSlug, quantity, cartLines });
    const validated = validateCartForCheckout(lines);
    if (!validated.ok) {
      return NextResponse.json({ ok: true, skipped: "cart" });
    }

    enqueueStorefrontCheckout({
      email,
      marketingConsent,
      customerName,
      phone,
      emirate,
      paymentMethod,
      externalCheckoutId,
      stripePaymentIntentId: paymentIntentId || undefined,
      lines: validated.cart.lines,
      phase: "browsing",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "[backend-checkout] sync route failed",
      err instanceof Error ? err.message : "unknown",
    );
    return NextResponse.json({ ok: true, skipped: "unavailable" });
  }
}
