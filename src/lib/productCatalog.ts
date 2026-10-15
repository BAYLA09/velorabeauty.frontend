import { images } from "@/config/images";
import { productPages } from "@/config/productPages";
import { products, type Product, type ProductId } from "@/config/products";
import {
  isStripeTestCheckoutEnabled,
  isStripeTestProductSlug,
  STRIPE_TEST_PRICE_AED,
  STRIPE_TEST_PRODUCT_NAME,
  STRIPE_TEST_PRODUCT_SLUG,
} from "@/config/stripeTestCheckout";

export type ProductImageRef = {
  /** فارغ = مساحة محجوزة على PDP */
  src?: string;
  placeholder: string;
  /** الصورة الثانية (قسم hook / before-after) */
  storySrc?: string;
  /** صور بطاقات upsell — خلفية بيضاء / packshot (legacy single URL) */
  upsellSrc?: string;
  /** صورة لكل بطاقة عرض: 1 / 2 / 3 منتجات (اختياري لكل slot) */
  upsellSlotSrc?: Partial<Record<1 | 2 | 3, string>>;
  /** صورة marketing واحدة (تحت التركيبة) — اختيارية */
  marketingSpotlight?: string;
  /** صورة تحت قسم التركيبة (GMP / البيوتين…) — اختيارية */
  formulaSectionImageSrc?: string;
  /** صورة تحت قسم «مع الاستمرار» / timeline — اختيارية */
  timelineSectionImageSrc?: string;
};

export type ProductWithPage = Product & {
  slug: string;
  page: (typeof productPages)[ProductId];
  /** صور PDP — منفصلة عن الصفحة الرئيسية */
  pageImage: ProductImageRef;
};

function mapProduct(p: Product): ProductWithPage {
  return {
    ...p,
    slug: productPages[p.id].slug,
    page: productPages[p.id],
    pageImage: images.productPage[p.id],
  };
}

export function getAllProductsWithPages(): ProductWithPage[] {
  return products.map(mapProduct);
}

export function getProductBySlug(slug: string): ProductWithPage | undefined {
  if (isStripeTestCheckoutEnabled() && isStripeTestProductSlug(slug)) {
    const hair = mapProduct(products.find((p) => p.id === "hair")!);
    return {
      ...hair,
      slug: STRIPE_TEST_PRODUCT_SLUG,
      name: STRIPE_TEST_PRODUCT_NAME,
      price: STRIPE_TEST_PRICE_AED,
      priceLabel: `${STRIPE_TEST_PRICE_AED} د.إ`,
      description: "اختبار دفع Stripe — غير معروض في المتجر.",
    };
  }
  return getAllProductsWithPages().find((p) => p.slug === slug);
}

export function getProductPath(slug: string): string {
  return `/products/${slug}`;
}
