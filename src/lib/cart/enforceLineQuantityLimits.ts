import { maxUnitsPerProductSlug } from "@/config/merchandising";
import type { CartLine } from "@/lib/cart/cartTypes";
import { normalizeCartLines } from "@/lib/cart/cartPricing";

export function exceedsPerSlugUnitLimit(lines: CartLine[]): boolean {
  const normalized = normalizeCartLines(lines);
  if (!Number.isFinite(maxUnitsPerProductSlug)) return false;
  return normalized.some((line) => line.quantity > maxUnitsPerProductSlug);
}

export function clampLinesToPerSlugLimit(lines: CartLine[]): CartLine[] {
  if (!Number.isFinite(maxUnitsPerProductSlug)) return normalizeCartLines(lines);
  const capped = lines.map((line) => ({
    slug: line.slug,
    quantity: Math.min(Math.floor(line.quantity), maxUnitsPerProductSlug),
  }));
  return normalizeCartLines(capped).filter((line) => line.quantity >= 1);
}
