import { images } from "@/config/images";
import { productPages } from "@/config/productPages";
import { products, type Product, type ProductId } from "@/config/products";
import {
  isWarmTeeSlug,
  warmTeePageConfig,
  warmTeePageImage,
  warmTeeProduct,
} from "@/config/warmTeeProduct";

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

/** Listed PDPs + hidden warm tee (checkout / sheets). */
export type StoreProductRef = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: { src: string; placeholder: string };
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

function mapWarmTeeStoreProduct(): StoreProductRef {
  return {
    ...warmTeeProduct,
    slug: warmTeePageConfig.slug,
    pageImage: warmTeePageImage,
  };
}

const LISTED_PRODUCT_IDS = new Set<ProductId>(["hair", "skin", "eye"]);

export function getAllProductsWithPages(): ProductWithPage[] {
  return products
    .filter((p) => LISTED_PRODUCT_IDS.has(p.id))
    .map(mapProduct);
}

export function getStoreProductBySlug(slug: string): StoreProductRef | undefined {
  if (isWarmTeeSlug(slug)) return mapWarmTeeStoreProduct();
  const listed = getAllProductsWithPages().find((p) => p.slug === slug);
  if (!listed) return undefined;
  return {
    id: listed.id,
    slug: listed.slug,
    name: listed.name,
    price: listed.price,
    image: listed.image,
    pageImage: listed.pageImage,
  };
}

export function getProductBySlug(slug: string): ProductWithPage | undefined {
  return getAllProductsWithPages().find((p) => p.slug === slug);
}

export function getProductPath(slug: string): string {
  return `/products/${slug}`;
}
