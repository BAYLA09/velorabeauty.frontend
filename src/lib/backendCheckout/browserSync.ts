import type { PaymentMethod } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";

export type BrowserBackendSyncPayload = {
  email: string;
  marketingConsent: boolean;
  customerName: string;
  phone: string;
  emirate: string;
  paymentMethod: PaymentMethod;
  productSlug: string;
  quantity: number;
  externalCheckoutId: string;
  paymentIntentId?: string;
  cartLines?: CartLine[];
};

export const BACKEND_SYNC_PATH = "/api/checkout/backend-sync";

export function postBackendCheckoutSync(payload: BrowserBackendSyncPayload): Promise<Response> {
  return fetch(BACKEND_SYNC_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email.trim(),
      marketingConsent: payload.marketingConsent === true,
      customerName: payload.customerName.trim(),
      phone: payload.phone.trim(),
      emirate: payload.emirate,
      paymentMethod: payload.paymentMethod,
      productSlug: payload.productSlug,
      quantity: payload.quantity,
      externalCheckoutId: payload.externalCheckoutId,
      paymentIntentId: payload.paymentIntentId || undefined,
      ...(payload.cartLines ? { cartLines: payload.cartLines } : {}),
    }),
    keepalive: true,
  });
}

/** Best-effort when the shopper leaves checkout before the debounce fires. */
export function beaconBackendCheckoutSync(payload: BrowserBackendSyncPayload): boolean {
  if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") {
    return false;
  }
  const body = JSON.stringify({
    email: payload.email.trim(),
    marketingConsent: payload.marketingConsent === true,
    customerName: payload.customerName.trim(),
    phone: payload.phone.trim(),
    emirate: payload.emirate,
    paymentMethod: payload.paymentMethod,
    productSlug: payload.productSlug,
    quantity: payload.quantity,
    externalCheckoutId: payload.externalCheckoutId,
    paymentIntentId: payload.paymentIntentId || undefined,
    ...(payload.cartLines ? { cartLines: payload.cartLines } : {}),
  });
  return navigator.sendBeacon(
    BACKEND_SYNC_PATH,
    new Blob([body], { type: "application/json" }),
  );
}
