import type { CartLine } from "@/lib/cart/cartTypes";
import { isSnapCatalogSlug } from "@/config/snapPixel";

export function snapContentIdsFromOrder(input: {
  productSlug: string;
  cartLines?: CartLine[];
}): string[] {
  const ids = new Set<string>();
  if (input.cartLines?.length) {
    for (const line of input.cartLines) {
      const slug = line.slug?.trim();
      if (slug && isSnapCatalogSlug(slug)) ids.add(slug);
    }
  }
  const primary = input.productSlug?.trim();
  if (primary && isSnapCatalogSlug(primary)) ids.add(primary);
  return [...ids];
}

export function snapItemCount(input: {
  quantity: number;
  cartLines?: CartLine[];
}): number {
  if (input.cartLines?.length) {
    return input.cartLines.reduce((sum, l) => sum + Math.max(0, l.quantity), 0);
  }
  return Math.max(1, input.quantity);
}
