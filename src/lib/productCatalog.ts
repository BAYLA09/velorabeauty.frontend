import { productPages } from "@/config/productPages";
import { products, type Product, type ProductId } from "@/config/products";

export type ProductWithPage = Product & {
  slug: string;
  page: (typeof productPages)[ProductId];
};

export function getAllProductsWithPages(): ProductWithPage[] {
  return products.map((p) => ({
    ...p,
    slug: productPages[p.id].slug,
    page: productPages[p.id],
  }));
}

export function getProductBySlug(slug: string): ProductWithPage | undefined {
  const entry = getAllProductsWithPages().find((p) => p.slug === slug);
  return entry;
}

export function getProductPath(slug: string): string {
  return `/products/${slug}`;
}
