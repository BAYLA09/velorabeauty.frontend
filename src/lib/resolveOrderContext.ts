import { getProductBySlug } from "@/lib/productCatalog";
import { parseQuantity, quantityLabels } from "@/lib/orderIntent";
import type { BundleQuantity } from "@/config/pricing";

export function resolveOrderContext(product: string | undefined, qty: string | undefined): {
  productSlug?: string;
  productName: string;
  quantity: BundleQuantity;
} {
  const quantity = parseQuantity(qty);
  const match = product ? getProductBySlug(product) : undefined;
  return {
    productSlug: match?.slug,
    productName: match?.name ?? quantityLabels[quantity],
    quantity,
  };
}
