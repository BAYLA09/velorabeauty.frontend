import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SnapProductAdLanding } from "@/components/lp/SnapProductAdLanding";
import { productSlugs } from "@/config/productPages";
import { getSnapLpSkinGummiesOverride } from "@/config/snapLpSkinGummiesCompliance";
import { getProductBySlug } from "@/lib/productCatalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const snapOverride = getSnapLpSkinGummiesOverride(slug);
  if (snapOverride) {
    return {
      title: snapOverride.metaTitle,
      description: snapOverride.metaDescription,
      openGraph: {
        title: snapOverride.openGraphTitle,
        description: snapOverride.openGraphDescription,
        images: [
          {
            url: snapOverride.heroImageSrc,
            alt: snapOverride.heroImageAlt,
          },
        ],
      },
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${product.name} | ${product.ingredient}`,
    description: product.description,
    robots: { index: false, follow: false },
  };
}

function snapHeroImageSrc(product: NonNullable<ReturnType<typeof getProductBySlug>>): string {
  const snapOverride = getSnapLpSkinGummiesOverride(product.slug);
  if (snapOverride) return snapOverride.heroImageSrc;

  const slot = product.pageImage.upsellSlotSrc?.[1];
  if (slot) return slot;
  if (product.pageImage.src) return product.pageImage.src;
  return product.image.src;
}

export default async function SnapProductAdPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const snapOverride = getSnapLpSkinGummiesOverride(slug);

  if (snapOverride) {
    return (
      <SnapProductAdLanding
        productSlug={product.slug}
        priceLabel={product.priceLabel}
        cta={product.cta}
        heroImageSrc={snapHeroImageSrc(product)}
        snapDisplayOverride={{
          heroImageAlt: snapOverride.heroImageAlt,
          ingredientLine: snapOverride.ingredientLine,
          headline: snapOverride.headline,
          body: snapOverride.body,
        }}
      />
    );
  }

  return (
    <SnapProductAdLanding
      productSlug={product.slug}
      priceLabel={product.priceLabel}
      cta={product.cta}
      heroImageSrc={snapHeroImageSrc(product)}
      catalogDisplay={{
        heroImageAlt: product.name,
        ingredientLine: product.ingredient,
        headline: product.name,
        body: product.description,
      }}
    />
  );
}
