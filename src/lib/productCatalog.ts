import { images } from "@/config/images";
import { productPages } from "@/config/productPages";
import { products, type Product, type ProductId } from "@/config/products";

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
  return getAllProductsWithPages().find((p) => p.slug === slug);
}

export function getProductPath(slug: string): string {
  return `/products/${slug}`;
}
