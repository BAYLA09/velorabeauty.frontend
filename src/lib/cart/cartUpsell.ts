import { getAllProductsWithPages } from "@/lib/productCatalog";
import type { CartLine } from "@/lib/cart/cartTypes";
import { countEligibleUnits } from "@/lib/cart/cartPricing";
import { targetBundleTotalAfterUpsell, upsellMerchandiseDelta } from "@/lib/cart/cartPricing";

export type UpsellProduct = {
  slug: string;
  name: string;
  description: string;
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
      description: p.description,
      imageSrc: p.image.src,
      imageAlt: p.image.placeholder,
    }));
}

export function getUpsellOfferCopy(eligibleUnits: number): {
  title: string;
  body: string;
  targetTotal: number | null;
  delta: number | null;
} | null {
  if (eligibleUnits >= 3) return null;
  const targetTotal = targetBundleTotalAfterUpsell(eligibleUnits);
  const delta = upsellMerchandiseDelta(eligibleUnits);
  if (targetTotal === null || delta === null) return null;
  if (eligibleUnits === 1) {
    return {
      title: "Passez à 249 AED",
      body: `Ajoutez un produit éligible — votre total produits passe à ${targetTotal} AED (au lieu de 398 AED à l’unité).`,
      targetTotal,
      delta,
    };
  }
  return {
    title: "Complétez le trio à 339 AED",
    body: `Ajoutez un troisième produit éligible — total produits ${targetTotal} AED pour votre routine complète.`,
    targetTotal,
    delta,
  };
}

export function canAddMoreUnits(lines: CartLine[]): boolean {
  return countEligibleUnits(lines) < 3;
}
