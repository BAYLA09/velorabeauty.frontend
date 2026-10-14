import { cardBundlePrices, formatPrice, singleProductPrice } from "@/config/pricing";
import type { ProductId } from "@/config/products";
import { getAllProductsWithPages } from "@/lib/productCatalog";
import type { CartLine } from "@/lib/cart/cartTypes";
import {
  countEligibleUnits,
  getMerchandiseAedForCart,
  normalizeCartLines,
  upsellDeltaAddingProduct,
} from "@/lib/cart/cartPricing";

const ROUTINE_LABEL: Record<ProductId, string> = {
  hair: "روتين الشعر",
  skin: "روتين البشرة",
  eye: "روتين العين",
};

export type UpsellProduct = {
  slug: string;
  name: string;
  tagline: string;
  routineLabel: string;
  imageSrc: string;
  imageAlt: string;
};

export function getUpsellRecommendations(lines: CartLine[]): UpsellProduct[] {
  const inCart = new Set(lines.map((l) => l.slug));
  return getAllProductsWithPages()
    .filter((p) => !inCart.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.ingredient,
      routineLabel: ROUTINE_LABEL[p.id],
      imageSrc: p.pageImage.upsellSlotSrc?.[1] ?? p.pageImage.upsellSrc ?? p.image.src,
      imageAlt: p.image.placeholder,
    }));
}

/** Savings vs paying 199 × units (display at checkout). */
export function getBundleSavingsVsRetail(
  eligibleUnits: number,
  merchandiseAed: number,
): number {
  if (eligibleUnits <= 0) return 0;
  return Math.max(0, singleProductPrice * eligibleUnits - merchandiseAed);
}

export function getNextTierSavingsForAdd(lines: CartLine[], addSlug: string): number | null {
  const delta = upsellDeltaAddingProduct(lines, addSlug);
  if (delta === null) return null;
  return Math.max(0, singleProductPrice - delta);
}

export function getUpsellOfferCopy(lines: CartLine[]): {
  title: string;
  body: string;
  targetTotal: number | null;
  delta: number | null;
} | null {
  const eligibleUnits = countEligibleUnits(lines);
  if (eligibleUnits >= 4) return null;

  const normalized = normalizeCartLines(lines);
  const distinctSkus = normalized.length;
  const currentTotal = getMerchandiseAedForCart(lines);
  if (currentTotal === null) return null;

  const sampleSlug = getUpsellRecommendations(lines)[0]?.slug;
  const delta = sampleSlug ? upsellDeltaAddingProduct(lines, sampleSlug) : singleProductPrice;
  const targetTotal =
    sampleSlug && delta !== null ? currentTotal + delta : currentTotal + singleProductPrice;

  if (eligibleUnits === 0) {
    return {
      title: "كمّلي روتين VELORA",
      body: `كل منتج مختلف يُضاف بـ ${formatPrice(singleProductPrice)} (مثال: شعر + بشرة = ${formatPrice(singleProductPrice * 2)}). عروض 249 / 339 لنفس المنتج من «اختاري الكمية» في صفحة المنتج.`,
      targetTotal: cardBundlePrices[1],
      delta: null,
    };
  }

  const primary = normalized[0];
  const sameSkuOnly = distinctSkus === 1 && primary;

  if (sameSkuOnly && primary.quantity === 2) {
    return {
      title: `أضيفي منتجاً مختلفاً — ${formatPrice(targetTotal)}`,
      body: `عندك ${formatPrice(currentTotal)} (علبتان من نفس المنتج). أضيفي skincare أو غيره — +${formatPrice(delta ?? singleProductPrice)} → المجموع ${formatPrice(targetTotal)}.`,
      targetTotal,
      delta,
    };
  }

  if (sameSkuOnly && primary.quantity >= 3) {
    return {
      title: `خطوة إضافية — +${formatPrice(delta ?? singleProductPrice)}`,
      body: `عندك عرض 3 علب (${formatPrice(currentTotal)}). منتج مختلف رابع يُضاف بـ ${formatPrice(singleProductPrice)}.`,
      targetTotal,
      delta,
    };
  }

  if (sameSkuOnly && primary.quantity === 1) {
    return {
      title: `منتج مختلف — +${formatPrice(delta ?? singleProductPrice)}`,
      body: `علبة واحدة ${formatPrice(currentTotal)}. للتوفير على نفس المنتج: 249 / 339 من صفحة المنتج. هنا: أضيفي خطوة أخرى من فيلورا → ${formatPrice(targetTotal)}.`,
      targetTotal,
      delta,
    };
  }

  return {
    title: `أضيفي خطوة — ${formatPrice(targetTotal)}`,
    body: `المجموع الحالي ${formatPrice(currentTotal)} — كل منتج جديد مختلف +${formatPrice(delta ?? singleProductPrice)}.`,
    targetTotal,
    delta,
  };
}

export function targetTotalAfterAddingSlug(lines: CartLine[], slug: string): number | null {
  const delta = upsellDeltaAddingProduct(lines, slug);
  const current = getMerchandiseAedForCart(lines);
  if (current === null || delta === null) return null;
  return current + delta;
}

export function canAddMoreUnits(lines: CartLine[]): boolean {
  return countEligibleUnits(lines) < 4;
}
