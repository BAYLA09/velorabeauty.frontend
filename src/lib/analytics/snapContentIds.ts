import type { CartLine } from "@/lib/cart/cartTypes";
import { isSnapCatalogSlug } from "@/config/snapPixel";
import { snapCatalogContentId } from "@/config/warmTeeProduct";

function addSnapContentId(ids: Set<string>, slug: string | undefined) {
  const trimmed = slug?.trim();
  if (!trimmed || !isSnapCatalogSlug(trimmed)) return;
  const contentId = snapCatalogContentId(trimmed);
  if (contentId) ids.add(contentId);
}

export function snapContentIdsFromOrder(input: {
  productSlug: string;
  cartLines?: CartLine[];
}): string[] {
  const ids = new Set<string>();
  if (input.cartLines?.length) {
    for (const line of input.cartLines) {
      addSnapContentId(ids, line.slug);
    }
  }
  addSnapContentId(ids, input.productSlug);
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
