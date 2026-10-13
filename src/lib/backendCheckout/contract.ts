/**
 * Storefront mapping of the Velora backend checkout contract
 * (velorabeauty.backend `src/routes/checkouts.ts` + `checkout.service.ts`).
 *
 * POST /api/checkouts                 Bearer STORE_API_KEY — upsert by externalCheckoutId
 * POST /api/orders                    same external id; status "paid" recovers the checkout
 * POST /api/checkouts/:id/recover     COD, and a safety net after payment
 * POST /api/checkouts/:id/abandon     optional; the backend sweep owns the 30-minute quiet period
 *
 * `:id` on abandon/recover is the backend checkout id, not the storefront order UUID.
 * externalCheckoutId and externalOrderId are that order UUID.
 * Emails require marketingConsent. Do not poll /api/checkouts; each call refreshes activity.
 */

export const CHECKOUT_CURRENCY = "AED";

/** Same shape the backend validates before `isValidEmail`. */
const EMAIL_REGEX =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

const EXTERNAL_ID_REGEX = /^[A-Za-z0-9_-]{8,200}$/;

export type AbandonMode = "immediate" | "delayed" | "none";

export type CheckoutCartItem = {
  slug: string;
  name: string;
  quantity: number;
};

export type CheckoutCartData = {
  items: CheckoutCartItem[];
  paymentMethod: "card" | "cod";
  subtotalAmount: number;
  deliveryFeeAmount: number;
  totalAmount: number;
  currency: typeof CHECKOUT_CURRENCY;
  eligibleUnits: number;
  orderId?: string;
  emirate?: string;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
};

export type CreateCheckoutBody = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  marketingConsent: boolean;
  externalCheckoutId: string;
  cartData: CheckoutCartData;
  totalAmount: number;
  currency: typeof CHECKOUT_CURRENCY;
};

export type BackendOrderStatus = "pending" | "awaiting_payment" | "paid";

export type BackendOrderBody = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  externalOrderId: string;
  externalCheckoutId: string;
  totalAmount: number;
  currency: typeof CHECKOUT_CURRENCY;
  status: BackendOrderStatus;
};

export type StoredCheckoutJob = {
  checkout: CreateCheckoutBody;
  order?: BackendOrderBody;
  recover: boolean;
};

export type CaptureDraft = {
  email: string;
  marketingConsent: boolean;
  customerName?: string;
  phone?: string;
  emirate?: string;
  paymentMethod: "card" | "cod";
  externalCheckoutId: string;
  orderId?: string;
  items: CheckoutCartItem[];
  eligibleUnits: number;
  subtotalAmount: number;
  deliveryFeeAmount: number;
  totalAmount: number;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
};

export function normalizeCheckoutEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isCheckoutEmail(email: string): boolean {
  const normalized = normalizeCheckoutEmail(email);
  return normalized.length >= 3 && EMAIL_REGEX.test(normalized);
}

export function isExternalCheckoutId(value: string): boolean {
  return EXTERNAL_ID_REGEX.test(value);
}

/** Storefront order id. The backend contract uses this as externalCheckoutId and externalOrderId. */
export function isStorefrontOrderId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

export function splitCustomerName(fullName: string | undefined): {
  firstName?: string;
  lastName?: string;
} {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  const firstName = parts[0]?.slice(0, 80);
  if (parts.length === 1) return { firstName };
  return { firstName, lastName: parts.slice(1).join(" ").slice(0, 80) };
}

export function readMarketingConsent(value: unknown): boolean {
  return value === true;
}

export function buildCreateCheckoutBody(draft: CaptureDraft): CreateCheckoutBody | null {
  const email = normalizeCheckoutEmail(draft.email);
  if (!isCheckoutEmail(email)) return null;
  if (!isExternalCheckoutId(draft.externalCheckoutId)) return null;
  if (!Number.isFinite(draft.totalAmount) || draft.totalAmount < 0) return null;
  if (draft.items.length === 0) return null;

  const names = splitCustomerName(draft.customerName);
  const phone = draft.phone?.trim();
  const emirate = draft.emirate?.trim();
  const orderId = draft.orderId?.trim();

  const cartData: CheckoutCartData = {
    items: draft.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      quantity: item.quantity,
    })),
    paymentMethod: draft.paymentMethod,
    subtotalAmount: draft.subtotalAmount,
    deliveryFeeAmount: draft.deliveryFeeAmount,
    totalAmount: draft.totalAmount,
    currency: CHECKOUT_CURRENCY,
    eligibleUnits: draft.eligibleUnits,
  };
  if (orderId) cartData.orderId = orderId;
  if (emirate) cartData.emirate = emirate;
  const paymentIntentId = draft.stripePaymentIntentId?.trim();
  const sessionId = draft.stripeCheckoutSessionId?.trim();
  if (paymentIntentId) cartData.stripePaymentIntentId = paymentIntentId;
  if (sessionId) cartData.stripeCheckoutSessionId = sessionId;

  return {
    email,
    ...names,
    ...(phone ? { phone: phone.slice(0, 40) } : {}),
    country: "AE",
    marketingConsent: draft.marketingConsent === true,
    externalCheckoutId: draft.externalCheckoutId,
    cartData,
    totalAmount: draft.totalAmount,
    currency: CHECKOUT_CURRENCY,
  };
}

export function buildBackendOrderBody(
  draft: CaptureDraft,
  status: BackendOrderStatus,
): BackendOrderBody | null {
  const checkout = buildCreateCheckoutBody(draft);
  if (!checkout) return null;
  return {
    email: checkout.email,
    ...(checkout.firstName ? { firstName: checkout.firstName } : {}),
    ...(checkout.lastName ? { lastName: checkout.lastName } : {}),
    ...(checkout.phone ? { phone: checkout.phone } : {}),
    country: "AE",
    externalOrderId: draft.orderId?.trim() || checkout.externalCheckoutId,
    externalCheckoutId: checkout.externalCheckoutId,
    totalAmount: checkout.totalAmount,
    currency: CHECKOUT_CURRENCY,
    status,
  };
}

export function readStoredCheckoutJob(raw: unknown): StoredCheckoutJob | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as { checkout?: unknown; order?: unknown; recover?: unknown };
  const checkout = (record.checkout ?? raw) as CreateCheckoutBody;
  if (!checkout || typeof checkout !== "object" || typeof checkout.externalCheckoutId !== "string") {
    return null;
  }
  const order =
    record.order && typeof record.order === "object" ? (record.order as BackendOrderBody) : undefined;
  return { checkout, order, recover: record.recover === true };
}

export type RemoteCheckoutStatus = "none" | "active" | "abandoned" | "recovered";

/**
 * What to do after a successful upsert.
 * `complete` means the customer finished (Stripe paid, or COD order placed):
 * recover, and never abandon.
 *
 * `immediate` calls /abandon right after upsert. The backend then waits
 * ABANDONED_CHECKOUT_MIN_AGE_MINUTES (default 30) before the checkout is
 * eligible for email. Delaying the storefront call would stack a second wait.
 * `none` (the default) leaves the checkout ACTIVE so the backend sweep can
 * mark it abandoned 30 minutes after the last upsert.
 */
export function nextRemoteAction(input: {
  abandonMode: AbandonMode;
  desired: "active" | "recovered";
  remoteStatus: RemoteCheckoutStatus;
  abandonAfterMs: number | null;
  nowMs: number;
}): "abandon" | "recover" | "wait" | "done" {
  if (input.desired === "recovered") {
    return input.remoteStatus === "recovered" ? "done" : "recover";
  }
  if (input.remoteStatus === "recovered" || input.remoteStatus === "abandoned") return "done";
  if (input.abandonMode === "none") return "done";
  if (input.abandonMode === "immediate") return "abandon";
  if (input.abandonAfterMs === null || input.abandonAfterMs > input.nowMs) return "wait";
  return "abandon";
}

export type BackendCallInterpretation =
  | { action: "success"; checkoutId?: string }
  | { action: "retry" }
  | { action: "stop"; reason: string }
  | { action: "already_recovered" };

export function readBackendCheckoutId(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const checkout = (body as { checkout?: { id?: unknown } }).checkout;
  if (!checkout || typeof checkout.id !== "string") return undefined;
  const id = checkout.id.trim();
  return id.length > 0 ? id : undefined;
}

export function readBackendErrorCode(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const code = (body as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

export function interpretBackendCall(input: {
  op: "create" | "abandon" | "recover" | "order";
  status: number;
  body: unknown;
}): BackendCallInterpretation {
  const code = readBackendErrorCode(input.body);
  if (input.op === "abandon" && (input.status === 409 || code === "CHECKOUT_RECOVERED")) {
    return { action: "already_recovered" };
  }
  if (input.status >= 200 && input.status < 300) {
    return { action: "success", checkoutId: readBackendCheckoutId(input.body) };
  }
  if (input.status === 408 || input.status === 429 || input.status >= 500) {
    return { action: "retry" };
  }
  if (input.op === "recover" && input.status === 404) {
    return { action: "retry" };
  }
  return { action: "stop", reason: code ?? `http_${input.status}` };
}

export function backoffMs(attempts: number): number {
  const capped = Math.min(Math.max(attempts, 1), 6);
  return Math.min(60_000, 500 * 2 ** (capped - 1));
}

export function redactEmail(email: string): string {
  const normalized = normalizeCheckoutEmail(email);
  const [local, domain] = normalized.split("@");
  if (!local || !domain) return "invalid-email";
  return `${local.slice(0, 1)}***@${domain}`;
}
