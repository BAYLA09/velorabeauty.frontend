import type { BundleQuantity } from "@/config/pricing";
import { getMerchandiseAedForLineQuantity, getMerchandiseAedForUnits } from "@/config/pricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { getAllProductsWithPages, getProductBySlug } from "@/lib/productCatalog";
import { resolveOrderProductImage } from "@/lib/order/resolveOrderProductImage";

export type OrderDisplayLine = {
  slug: string;
  name: string;
  quantity: number;
  lineMerchandiseAed: number;
  image: { src: string; alt: string } | null;
};

function parseCombinedProductName(productName: string): { name: string; quantity: number }[] {
  return productName
    .split(" · ")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(.+?)\s×(\d+)$/);
      if (match) {
        return { name: match[1]!.trim(), quantity: Number.parseInt(match[2]!, 10) };
      }
      return { name: part, quantity: 1 };
    });
}

function slugForProductName(name: string): string | null {
  const products = getAllProductsWithPages();
  const exact = products.find((p) => p.name === name);
  if (exact) return exact.slug;
  const partial = products.find((p) => name.includes(p.name) || p.name.includes(name));
  return partial?.slug ?? null;
}

export function buildOrderDisplayLines(input: {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  cartLines?: CartLine[] | null;
}): OrderDisplayLine[] {
  if (input.cartLines && input.cartLines.length > 0) {
    return input.cartLines.map((line) => {
      const product = getProductBySlug(line.slug);
      const qty = Math.max(1, Math.floor(line.quantity));
      return {
        slug: line.slug,
        name: product?.name ?? line.slug,
        quantity: qty,
        lineMerchandiseAed: getMerchandiseAedForLineQuantity(qty) ?? 0,
        image: resolveOrderProductImage(line.slug, qty),
      };
    });
  }

  const parsed = parseCombinedProductName(input.productName);
  if (parsed.length > 1) {
    return parsed.map((part) => {
      const slug = slugForProductName(part.name);
      return {
        slug: slug ?? input.productSlug,
        name: part.name,
        quantity: part.quantity,
        lineMerchandiseAed: getMerchandiseAedForLineQuantity(part.quantity) ?? 0,
        image: slug ? resolveOrderProductImage(slug, part.quantity) : null,
      };
    });
  }

  const product = getProductBySlug(input.productSlug);
  const qty = input.quantity;
  const merchandise =
    getMerchandiseAedForLineQuantity(qty) ?? getMerchandiseAedForUnits(qty) ?? 0;

  return [
    {
      slug: input.productSlug,
      name: product?.name ?? input.productName,
      quantity: qty,
      lineMerchandiseAed: merchandise,
      image: resolveOrderProductImage(input.productSlug, qty),
    },
  ];
}
