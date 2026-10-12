import { cardBundlePrices, singleProductPrice } from "@/config/pricing";
import type { ProductId } from "@/config/products";
import { getAllProductsWithPages } from "@/lib/productCatalog";
import type { CartLine } from "@/lib/cart/cartTypes";
import { countEligibleUnits } from "@/lib/cart/cartPricing";
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
  if (eligibleUnits >= 3) return null;
  const nextUnits = eligibleUnits + 1;
  const target = targetBundleTotalAfterUpsell(eligibleUnits);
  if (target === null) return null;
  const retail = singleProductPrice * nextUnits;
  return Math.max(0, retail - target);
}

export function getUpsellOfferCopy(eligibleUnits: number): {
  title: string;
  body: string;
  targetTotal: number | null;
  delta: number | null;
} | null {
  if (eligibleUnits >= 3) return null;
  if (eligibleUnits === 0) {
    return {
      title: "كمّلي الروتين — عرض لمرة واحدة",
      body: `منتج ${cardBundlePrices[1]} · منتجان ${cardBundlePrices[2]} · 3 منتجات ${cardBundlePrices[3]} — يمكن خلط الشعر، البشرة، والعين.`,
      targetTotal: cardBundlePrices[1],
      delta: null,
    };
  }
  const targetTotal = targetBundleTotalAfterUpsell(eligibleUnits);
  const delta = upsellMerchandiseDelta(eligibleUnits);
  if (targetTotal === null || delta === null) return null;
  if (eligibleUnits === 1) {
    const saveTwo = singleProductPrice * 2 - targetTotal;
    return {
      title: `زيدي منتجاً — وفّري ${saveTwo} د.إ`,
      body: `عرض منتجان بـ ${targetTotal} د.إ بدل ${singleProductPrice * 2} د.إ — اختاري الشعر، البشرة، أو العين.`,
      targetTotal,
      delta,
    };
  }
  const saveThree = singleProductPrice * 3 - targetTotal;
  return {
    title: `خطوة أخيرة — وفّري ${saveThree} د.إ`,
    body: `أكملي 3 منتجات بـ ${targetTotal} د.إ (بدل ${singleProductPrice * 3} د.إ) — أقوى توفير في فيلورا.`,
    targetTotal,
    delta,
  };
}

export function canAddMoreUnits(lines: CartLine[]): boolean {
  return countEligibleUnits(lines) < 3;
}
