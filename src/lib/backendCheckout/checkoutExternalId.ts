export const CHECKOUT_EXTERNAL_ID_STORAGE_KEY = "velora-checkout-external-id";

const STOREFRONT_ORDER_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isStoredCheckoutOrderId(value: string): boolean {
  return STOREFRONT_ORDER_UUID.test(value.trim());
}

/** Same id for backend-sync and order create. Persists for the tab session. */
export function readStableCheckoutExternalId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(CHECKOUT_EXTERNAL_ID_STORAGE_KEY);
    if (existing && isStoredCheckoutOrderId(existing)) return existing;
    const created = window.crypto.randomUUID();
    window.sessionStorage.setItem(CHECKOUT_EXTERNAL_ID_STORAGE_KEY, created);
    return created;
  } catch {
    return "";
  }
}

/**
 * Use on order / finalize submit. The hook value can still be empty on the first
 * paint; sessionStorage holds the id created for POST /api/checkouts.
 */
export function resolveCheckoutExternalId(hookValue?: string): string {
  const trimmed = hookValue?.trim() ?? "";
  if (trimmed && isStoredCheckoutOrderId(trimmed)) return trimmed;
  return readStableCheckoutExternalId();
}

export function clearStoredCheckoutExternalId(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CHECKOUT_EXTERNAL_ID_STORAGE_KEY);
  } catch {
    /* private mode */
  }
}
