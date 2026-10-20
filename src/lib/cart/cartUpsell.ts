import { isRetiredBundleImageSrc } from "@/config/retiredBundleImage";
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
      imageSrc:
        [p.pageImage.upsellSlotSrc?.[1], p.pageImage.upsellSrc, p.image.src].find(
          (s) => s?.trim() && !isRetiredBundleImageSrc(s),
        ) ?? p.image.src,
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
      title: "كمّلي روتينك — خطوة واحدة",
      body: `عندك ${formatPrice(currentTotal)} (علبتان). أضيفي بشرة أو عين بـ ${formatPrice(delta ?? singleProductPrice)} — المجموع ${formatPrice(targetTotal)}.`,
      targetTotal,
      delta,
    };
  }

  if (sameSkuOnly && primary.quantity >= 3) {
    return {
      title: "أضيفي خطوة أخيرة لروتينك",
      body: `3 علب = ${formatPrice(currentTotal)}. منتج مختلف إضافي = +${formatPrice(singleProductPrice)} فقط.`,
      targetTotal,
      delta,
    };
  }

  if (sameSkuOnly && primary.quantity === 1) {
    return {
      title: "خطوة ثانية = روتين كامل",
      body: `${formatPrice(currentTotal)} الآن · أضيفي خطوة من فيلورا بـ ${formatPrice(delta ?? singleProductPrice)} → ${formatPrice(targetTotal)}. (249/339 لنفس المنتج من صفحة المنتج.)`,
      targetTotal,
      delta,
    };
  }

  return {
    title: "لا تكملي الدفع بدون هذي الخطوة",
    body: `${formatPrice(currentTotal)} في سلتك · كل منتج جديد +${formatPrice(delta ?? singleProductPrice)} — اختاري تحت واضغطي «أضيفي».`,
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
