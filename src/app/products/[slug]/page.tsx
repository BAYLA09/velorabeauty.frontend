import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageClient } from "@/components/product/ProductPageClient";
import { StripeTestProductPage } from "@/components/product/StripeTestProductPage";
import { productSlugs } from "@/config/productPages";
import {
  isStripeTestCheckoutEnabled,
  isStripeTestProductSlug,
  STRIPE_TEST_PRODUCT_NAME,
  stripeTestCardCheckoutPath,
} from "@/config/stripeTestCheckout";
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
  if (isStripeTestProductSlug(slug) && isStripeTestCheckoutEnabled()) {
    return {
      title: `${STRIPE_TEST_PRODUCT_NAME} | فيلورا`,
      description: "صفحة اختبار دفع Stripe — 20 د.إ — غير معروضة في المتجر.",
      robots: { index: false, follow: false },
    };
  }
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.page.seoTitle,
    description: product.page.seoDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (isStripeTestProductSlug(slug)) {
    if (!isStripeTestCheckoutEnabled()) notFound();
    return <StripeTestProductPage cardCheckoutHref={stripeTestCardCheckoutPath()} />;
  }
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
