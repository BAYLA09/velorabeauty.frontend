import type { CartLine } from "@/lib/cart/cartTypes";
import { normalizeCartLines } from "@/lib/cart/cartPricing";

/** Compact checkout query: `hair-gummies:1,skin-gummies:1` */
export function encodeCartItemsParam(lines: CartLine[]): string {
  return normalizeCartLines(lines)
    .map((l) => `${encodeURIComponent(l.slug)}:${l.quantity}`)
    .join(",");
}

export function parseCartItemsParam(raw: string | null | undefined): CartLine[] | null {
  if (!raw?.trim()) return null;
  const lines: CartLine[] = [];
  for (const part of raw.split(",")) {
    const [slugEnc, qtyRaw] = part.split(":");
    if (!slugEnc || !qtyRaw) return null;
    const slug = decodeURIComponent(slugEnc.trim());
    const quantity = Number(qtyRaw);
    if (!slug || !Number.isFinite(quantity) || quantity < 1) return null;
    lines.push({ slug, quantity: Math.floor(quantity) });
  }
  const normalized = normalizeCartLines(lines);
  if (normalized.length === 0) return null;
  return normalized;
}
