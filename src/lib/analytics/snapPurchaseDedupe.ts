const STORAGE_PREFIX = "velora_snap_purchase_";

/** Returns true if this orderId has not been sent yet (and marks it sent). */
export function claimSnapPurchaseSend(orderId: string): boolean {
  if (typeof window === "undefined") return false;
  const id = orderId.trim();
  if (!id) return false;
  const key = `${STORAGE_PREFIX}${id}`;
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, String(Date.now()));
    return true;
  } catch {
    return false;
  }
}
