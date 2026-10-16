const STORAGE_PREFIX = "velora_snap_purchase_";

export function hasSnapPurchaseBeenSent(orderId: string): boolean {
  if (typeof window === "undefined") return true;
  const id = orderId.trim();
  if (!id) return true;
  try {
    return Boolean(sessionStorage.getItem(`${STORAGE_PREFIX}${id}`));
  } catch {
    return false;
  }
}

/** Call only after Snap PURCHASE was queued/sent successfully. */
export function markSnapPurchaseSent(orderId: string): void {
  if (typeof window === "undefined") return;
  const id = orderId.trim();
  if (!id) return;
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${id}`, String(Date.now()));
  } catch {
    /* ignore */
  }
}
