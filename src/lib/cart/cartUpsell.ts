import { cardBundlePrices, formatPrice, singleProductPrice } from "@/config/pricing";
import type { ProductId } from "@/config/products";
import { getAllProductsWithPages } from "@/lib/productCatalog";
import type { CartLine } from "@/lib/cart/cartTypes";
import { countEligibleUnits, normalizeCartLines } from "@/lib/cart/cartPricing";
import { targetBundleTotalAfterUpsell, upsellMerchandiseDelta } from "@/lib/cart/cartPricing";

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

/** Savings vs paying single-product price × units (display at checkout). */
export function getBundleSavingsVsRetail(
  eligibleUnits: number,
  merchandiseAed: number,
): number {
  if (eligibleUnits <= 0) return 0;
  return Math.max(0, singleProductPrice * eligibleUnits - merchandiseAed);
}

/** Savings vs buying the next tier as separate singles (Lara-style «وفّري»). */
export function getNextTierSavings(eligibleUnits: number): number | null {
  if (eligibleUnits >= 4) return null;
  const nextUnits = eligibleUnits + 1;
  const target = targetBundleTotalAfterUpsell(eligibleUnits);
  if (target === null) return null;
  const retail = singleProductPrice * nextUnits;
  return Math.max(0, retail - target);
}

function cartDistinctSkuCount(lines: CartLine[]): number {
  return normalizeCartLines(lines).length;
}

/** Upsell = منتجات مختلفة فقط (مثال شعر + عين = 249). عروض نفس المنتج = صفحة المنتج. */
export function getUpsellOfferCopy(
  lines: CartLine[],
  eligibleUnits: number,
): {
  title: string;
  body: string;
  targetTotal: number | null;
  delta: number | null;
} | null {
  if (eligibleUnits >= 4) return null;

  const distinct = cartDistinctSkuCount(lines);
  const singleSkuOnly = distinct === 1 && lines.length > 0;

  if (eligibleUnits === 3) {
    const targetTotal = targetBundleTotalAfterUpsell(3);
    const delta = upsellMerchandiseDelta(3);
    if (targetTotal === null || delta === null) return null;
    const retailFour = singleProductPrice * 4;
    return {
      title: `منتج رابع مختلف — +${delta} د.إ`,
      body: `أضيفي خطوة أخرى من فيلورا (شعر، بشرة، أو عين) — المجموع ${formatPrice(targetTotal)} (بدل ${formatPrice(retailFour)}).`,
      targetTotal,
      delta,
    };
  }

  if (eligibleUnits === 0) {
    return {
      title: "كمّلي روتين VELORA",
      body: "العروض هنا لمنتجات مختلفة (مثال: علكة شعر + سيروم عين = 249 د.إ). علبتين أو 3 من نفس المنتج تختارينها من صفحة المنتج.",
      targetTotal: cardBundlePrices[1],
      delta: null,
    };
  }

  const targetTotal = targetBundleTotalAfterUpsell(eligibleUnits);
  const delta = upsellMerchandiseDelta(eligibleUnits);
  if (targetTotal === null || delta === null) return null;

  if (eligibleUnits === 1) {
    const saveTwo = singleProductPrice * 2 - targetTotal;
    if (singleSkuOnly) {
      return {
        title: `أضيفي منتجاً آخر — ${formatPrice(targetTotal)}`,
        body: `مثال: شعر + عين أو شعر + بشرة = ${formatPrice(targetTotal)} (وفّري ${saveTwo} د.إ). هذا العرض لمنتجين مختلفين — علبتين من نفس المنتج (${formatPrice(targetTotal)}) من «اختاري الكمية» في صفحة المنتج.`,
        targetTotal,
        delta,
      };
    }
    return {
      title: `زيدي خطوة من فيلورا — ${formatPrice(targetTotal)}`,
      body: `منتج ثانٍ مختلف — المجموع ${formatPrice(targetTotal)} (بدل ${formatPrice(singleProductPrice * 2)}).`,
      targetTotal,
      delta,
    };
  }

  const saveThree = singleProductPrice * 3 - targetTotal;
  if (singleSkuOnly) {
    return {
      title: `خطوة ثالثة مختلفة — ${formatPrice(targetTotal)}`,
      body: `عندك وحدتان من نفس المنتج. أضيفي منتجاً آخر (شعر، بشرة، أو عين) للوصول إلى ${formatPrice(targetTotal)} — وفّري ${saveThree} د.إ. (3 علب من نفس المنتج = ${formatPrice(cardBundlePrices[3])} من صفحة المنتج.)`,
      targetTotal,
      delta,
    };
  }

  return {
    title: `خطوة أخيرة — ${formatPrice(targetTotal)}`,
    body: `أكملي 3 منتجات مختلفة من فيلورا بـ ${formatPrice(targetTotal)} (بدل ${formatPrice(singleProductPrice * 3)}).`,
    targetTotal,
    delta,
  };
}

export function canAddMoreUnits(lines: CartLine[]): boolean {
  return countEligibleUnits(lines) < 4;
}
