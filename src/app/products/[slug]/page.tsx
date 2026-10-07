import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageClient } from "@/components/product/ProductPageClient";
import { productSlugs } from "@/config/productPages";
import {
  getAllProductsWithPages,
  getProductBySlug,
} from "@/lib/productCatalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.page.seoTitle,
    description: product.page.seoDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const all = getAllProductsWithPages();
  const mainSrc = product.pageImage.src?.trim();

  return (
    <>
      {mainSrc ? <link rel="preload" as="image" href={mainSrc} fetchPriority="high" /> : null}
      <ProductPageClient product={product} allProducts={all} />
    </>
  );
}
