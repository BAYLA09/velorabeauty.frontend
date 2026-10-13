import type { PaymentMethod } from "@/config/pricing";
import type { OrderRecord } from "@/lib/ordersRepository";
import {
  buildBackendOrderBody,
  buildCreateCheckoutBody,
  isCheckoutEmail,
  isExternalCheckoutId,
  isStorefrontOrderId,
  normalizeCheckoutEmail,
  redactEmail,
  type BackendOrderStatus,
  type CaptureDraft,
  type StoredCheckoutJob,
} from "@/lib/backendCheckout/contract";
import { readBackendCheckoutConfig } from "@/lib/backendCheckout/config";
import { computeCartPricing } from "@/lib/cart/cartPricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";
import { getProductBySlug } from "@/lib/productCatalog";
import {
  getBackendCheckoutLink,
  saveBackendCheckoutProgress,
  upsertBackendCheckoutLink,
} from "@/lib/backendCheckout/store";
import { kickBackendCheckoutWorker, startBackendCheckoutWorker } from "@/lib/backendCheckout/worker";

export type CheckoutSyncPhase = "browsing" | "order_open" | "paid" | "cod_placed";

export type EnqueueCheckoutInput = {
  email: string;
  marketingConsent: boolean;
  customerName?: string;
  phone?: string;
  emirate?: string;
  paymentMethod: PaymentMethod;
  externalCheckoutId: string;
  orderId?: string;
  lines: CartLine[];
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  /**
   * browsing: email captured, no order yet.
   * order_open: order row exists, payment not captured.
   * paid: Stripe payment succeeded. POST /api/orders with status "paid".
   * cod_placed: cash on delivery. POST /api/orders pending, then /recover.
   */
  phase: CheckoutSyncPhase;
};

function logCheckout(message: string, extra?: Record<string, unknown>): void {
  if (extra) {
    console.error("[backend-checkout]", message, extra);
    return;
  }
  console.error("[backend-checkout]", message);
}

let loggedDisabled = false;

export function draftFromLines(input: EnqueueCheckoutInput): CaptureDraft | null {
  if (!isCheckoutEmail(input.email) || !isExternalCheckoutId(input.externalCheckoutId)) {
    return null;
  }
  const validated = validateCartForCheckout(input.lines);
  if (!validated.ok) return null;
  const pricing = computeCartPricing(validated.cart.lines, input.paymentMethod);
  if (!pricing.ok || pricing.totalAed === null || pricing.shippingAed === null) return null;

  return {
    email: normalizeCheckoutEmail(input.email),
    marketingConsent: input.marketingConsent === true,
    customerName: input.customerName,
    phone: input.phone,
    emirate: input.emirate,
    paymentMethod: input.paymentMethod,
    externalCheckoutId: input.externalCheckoutId,
    orderId: input.orderId ?? input.externalCheckoutId,
    stripePaymentIntentId: input.stripePaymentIntentId,
    stripeCheckoutSessionId: input.stripeCheckoutSessionId,
    eligibleUnits: pricing.eligibleUnits,
    subtotalAmount: pricing.merchandiseAed,
    deliveryFeeAmount: pricing.shippingAed,
    totalAmount: pricing.totalAed,
    items: validated.cart.lines.map((line) => ({
      slug: line.slug,
      name: getProductBySlug(line.slug)?.name ?? line.slug,
      quantity: line.quantity,
    })),
  };
}

/**
 * Persist the checkout and sync it to the backend without affecting the customer.
 * Failures are logged and retried by the server worker.
 */
export function enqueueStorefrontCheckout(input: EnqueueCheckoutInput): void {
  try {
    const config = readBackendCheckoutConfig();
    if (!config.enabled) {
      if (!loggedDisabled) {
        loggedDisabled = true;
        logCheckout(`skipped (${config.reason})`);
      }
      return;
    }

    const draft = draftFromLines(input);
    const checkout = draft ? buildCreateCheckoutBody(draft) : null;
    if (!draft || !checkout) {
      logCheckout("skipped (invalid email, cart, or external id)", {
        externalCheckoutId: input.externalCheckoutId,
        email: redactEmail(input.email),
      });
      return;
    }

    const orderStatus: BackendOrderStatus | null =
      input.phase === "paid"
        ? "paid"
        : input.phase === "cod_placed"
          ? "pending"
          : input.phase === "order_open"
            ? "awaiting_payment"
            : null;
    const recover = input.phase === "paid" || input.phase === "cod_placed";
    const order = orderStatus ? buildBackendOrderBody(draft, orderStatus) : null;
    const job: StoredCheckoutJob = {
      checkout,
      ...(order ? { order } : {}),
      recover,
    };

    startBackendCheckoutWorker();
    upsertBackendCheckoutLink({
      externalCheckoutId: checkout.externalCheckoutId,
      email: checkout.email,
      marketingConsent: checkout.marketingConsent,
      orderId: input.orderId ?? input.externalCheckoutId,
      desiredStatus: recover ? "recovered" : "active",
      requestJson: JSON.stringify(job),
      nowIso: new Date().toISOString(),
    });
    kickBackendCheckoutWorker();
  } catch (err) {
    logCheckout("enqueue failed", {
      externalCheckoutId: input.externalCheckoutId,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
}

export function checkoutLinesForSync(input: {
  productSlug: string;
  quantity: number;
  cartLines?: CartLine[] | null;
}): CartLine[] {
  if (input.cartLines && input.cartLines.length > 0) return input.cartLines;
  return [{ slug: input.productSlug, quantity: input.quantity }];
}

export function recoverPaidOrderCheckout(order: OrderRecord): void {
  const externalCheckoutId = isStorefrontOrderId(order.id)
    ? order.id
    : order.backendExternalCheckoutId && isExternalCheckoutId(order.backendExternalCheckoutId)
      ? order.backendExternalCheckoutId
      : "";
  if (!externalCheckoutId) return;
  if (!order.customerEmail) {
    requestBackendCheckoutRecovery({ externalCheckoutId });
    return;
  }
  enqueueStorefrontCheckout({
    email: order.customerEmail,
    marketingConsent: order.marketingConsent,
    customerName: order.customerName,
    phone: order.phone,
    emirate: order.emirate,
    paymentMethod: order.paymentMethod,
    externalCheckoutId,
    orderId: order.id,
    stripePaymentIntentId: order.stripePaymentIntentId ?? undefined,
    stripeCheckoutSessionId: order.stripeCheckoutSessionId ?? undefined,
    lines: [{ slug: order.productSlug, quantity: order.quantity }],
    phase: "paid",
  });
}

export function requestBackendCheckoutRecovery(input: {
  externalCheckoutId: string;
  fallback?: EnqueueCheckoutInput;
}): void {
  if (!isExternalCheckoutId(input.externalCheckoutId)) return;
  if (input.fallback) {
    enqueueStorefrontCheckout({
      ...input.fallback,
      externalCheckoutId: input.externalCheckoutId,
      phase: "paid",
    });
    return;
  }

  try {
    const existing = getBackendCheckoutLink(input.externalCheckoutId);
    if (!existing || existing.remoteStatus === "recovered") return;
    const nowIso = new Date().toISOString();
    saveBackendCheckoutProgress(input.externalCheckoutId, {
      desiredStatus: "recovered",
      syncStatus: "pending",
      nextAttemptAt: nowIso,
      attempts: 0,
      lastError: null,
      updatedAt: nowIso,
    });
    startBackendCheckoutWorker();
    kickBackendCheckoutWorker();
  } catch (err) {
    logCheckout("recovery enqueue failed", {
      externalCheckoutId: input.externalCheckoutId,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
}
