import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SnapProductAdLanding } from "@/components/lp/SnapProductAdLanding";
import { productSlugs } from "@/config/productPages";
import { getProductBySlug } from "@/lib/productCatalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | ${product.ingredient}`,
    description: product.description,
    robots: { index: false, follow: false },
  };
}

function snapHeroImageSrc(product: NonNullable<ReturnType<typeof getProductBySlug>>): string {
  const slot = product.pageImage.upsellSlotSrc?.[1];
  if (slot) return slot;
  if (product.pageImage.src) return product.pageImage.src;
  return product.image.src;
}

export default async function SnapProductAdPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return <SnapProductAdLanding product={product} heroImageSrc={snapHeroImageSrc(product)} />;
}
