/** COD PURCHASE — only after /api/orders confirmed the order exists (pending is OK). */
export function shouldFireCodSnapPurchase(input: {
  purchaseVerified: boolean;
  orderId: string | null | undefined;
  paymentMethod?: string | null;
}): boolean {
  if (!input.purchaseVerified) return false;
  if (!input.orderId?.trim()) return false;
  if (input.paymentMethod && input.paymentMethod !== "cod") return false;
  return true;
}

/** Card PURCHASE — API-verified order and Stripe status paid (not awaiting/failed). */
export function shouldFireCardSnapPurchase(input: {
  purchaseVerified: boolean;
  orderId: string | null | undefined;
  status?: string | null;
  paymentMethod?: string | null;
}): boolean {
  if (!input.purchaseVerified) return false;
  if (!input.orderId?.trim()) return false;
  if (input.paymentMethod && input.paymentMethod !== "card") return false;
  return input.status === "paid";
}
