import type { PaymentMethod } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";
import type { EnqueueCheckoutInput } from "@/lib/backendCheckout/capture";
import { checkoutLinesForSync } from "@/lib/backendCheckout/capture";
import {
  isCheckoutEmail,
  isStorefrontOrderId,
  readMarketingConsent,
} from "@/lib/backendCheckout/contract";

export type BackendSyncSkipReason = "email" | "external_id" | "cart" | "unavailable";

export type BackendSyncEvaluation =
  | { action: "enqueue"; input: EnqueueCheckoutInput }
  | { action: "skip"; reason: BackendSyncSkipReason };

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "card" || value === "cod";
}

export function evaluateBackendSyncRequest(
  body: Record<string, unknown>,
): BackendSyncEvaluation {
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
    return { action: "skip", reason: "email" };
  }
  if (!isStorefrontOrderId(externalCheckoutId)) {
    return { action: "skip", reason: "external_id" };
  }
  if (!isPaymentMethod(paymentMethod) || !productSlug || !Number.isFinite(quantity)) {
    return { action: "skip", reason: "cart" };
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
    return { action: "skip", reason: "cart" };
  }

  return {
    action: "enqueue",
    input: {
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
    },
  };
}
