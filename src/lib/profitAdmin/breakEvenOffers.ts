import {
  cardBundlePrices,
  codBundlePrices,
  type BundleQuantity,
} from "@/config/pricing";
import type { BreakEvenUnitEconomics } from "@/lib/profitAdmin/breakEvenSimulator";
import type { FeeConfig } from "@/lib/profitAdmin/feesDefaults";

export type SiteOfferTier = BundleQuantity;

export type SiteOfferDefinition = {
  tier: SiteOfferTier;
  label: string;
  units: number;
  cardAed: number;
  codAed: number;
};

export const SITE_STORE_OFFERS: SiteOfferDefinition[] = [
  {
    tier: 1,
    label: "1 product",
    units: 1,
    cardAed: cardBundlePrices[1],
    codAed: codBundlePrices[1],
  },
  {
    tier: 2,
    label: "2 products",
    units: 2,
    cardAed: cardBundlePrices[2],
    codAed: codBundlePrices[2],
  },
  {
    tier: 3,
    label: "3 products",
    units: 3,
    cardAed: cardBundlePrices[3],
    codAed: codBundlePrices[3],
  },
];

function avgUnitCogsUsd(fees: FeeConfig): number {
  return (
    fees.products.hairGummies + fees.products.skinGummies + fees.products.eyeSerum
  ) / 3;
}

export function siteOfferUnitEconomics(
  fees: FeeConfig,
  tier: SiteOfferTier,
): BreakEvenUnitEconomics {
  const offer = SITE_STORE_OFFERS.find((o) => o.tier === tier)!;
  const rate = fees.aedPerUsd > 0 ? fees.aedPerUsd : 3.6725;
  const cogsPerOrderUsd = avgUnitCogsUsd(fees) * offer.units;
  return {
    avgCardRevenueUsd: offer.cardAed / rate,
    avgCardProductCostUsd: cogsPerOrderUsd,
    codSellingPriceUsd: offer.codAed / rate,
    codProductCostUsd: cogsPerOrderUsd,
  };
}

export function normalizeOfferMix(pcts: {
  offer1Pct: number;
  offer2Pct: number;
  offer3Pct: number;
}): Record<SiteOfferTier, number> {
  const raw = {
    1: Math.max(0, pcts.offer1Pct),
    2: Math.max(0, pcts.offer2Pct),
    3: Math.max(0, pcts.offer3Pct),
  } as Record<SiteOfferTier, number>;
  const sum = raw[1] + raw[2] + raw[3];
  if (sum <= 0) return { 1: 100, 2: 0, 3: 0 };
  return {
    1: (raw[1] / sum) * 100,
    2: (raw[2] / sum) * 100,
    3: (raw[3] / sum) * 100,
  };
}

/** Weighted average order economics when leads buy different site bundles. */
export function blendedSiteOfferEconomics(
  fees: FeeConfig,
  mix: Record<SiteOfferTier, number>,
): BreakEvenUnitEconomics {
  let cardRev = 0;
  let cardCog = 0;
  let codPrice = 0;
  let codCog = 0;
  for (const offer of SITE_STORE_OFFERS) {
    const w = mix[offer.tier] / 100;
    if (w <= 0) continue;
    const e = siteOfferUnitEconomics(fees, offer.tier);
    cardRev += w * e.avgCardRevenueUsd;
    cardCog += w * e.avgCardProductCostUsd;
    codPrice += w * e.codSellingPriceUsd;
    codCog += w * e.codProductCostUsd;
  }
  return {
    avgCardRevenueUsd: cardRev,
    avgCardProductCostUsd: cardCog,
    codSellingPriceUsd: codPrice,
    codProductCostUsd: codCog,
  };
}

export function formatOfferAedLine(offer: SiteOfferDefinition): string {
  return `${offer.label}: Card ${offer.cardAed} AED · COD ${offer.codAed} AED`;
}
