import { isRetiredBundleImageSrc } from "@/config/retiredBundleImage";
import type { ProductImageRef } from "@/lib/productCatalog";

const GALLERY_SLOT_COUNT = 4;
const CAROUSEL_SLOT_COUNT = 3;

function buildUniqueImagePool(
  pageImage: ProductImageRef,
  includeTimeline: boolean,
  homePackshotSrc?: string,
): string[] {
  const pool = [
    pageImage.src,
    pageImage.storySrc,
    pageImage.formulaSectionImageSrc,
    ...(includeTimeline ? [pageImage.timelineSectionImageSrc] : []),
    pageImage.upsellSlotSrc?.[1],
    pageImage.upsellSlotSrc?.[2],
    pageImage.upsellSlotSrc?.[3],
    pageImage.upsellSrc,
    homePackshotSrc,
  ];

  const unique: string[] = [];
  for (const raw of pool) {
    const s = raw?.trim();
    if (!s || isRetiredBundleImageSrc(s)) continue;
    if (!unique.includes(s)) unique.push(s);
  }
  return unique;
}

function padToSlotCount(unique: string[], slotCount: number): string[] {
  if (unique.length === 0) return [];
  const result = [...unique];
  while (result.length < slotCount) {
    result.push(unique[result.length % unique.length]);
  }
  return result.slice(0, slotCount);
}

/** Fixed top hero — BEFORE/AFTER creative (stored on PDP `src` / *-main.webp). */
export function getProductBeforeAfterHeroSrc(pageImage: ProductImageRef): string | undefined {
  const src = pageImage.src?.trim();
  if (!src || isRetiredBundleImageSrc(src)) return undefined;
  return src;
}

export type ProductPdpScrollImages = {
  beforeAfter: string | undefined;
  problem: string | undefined;
  timeline: string | undefined;
  formula: string | undefined;
};

function cleanPdpImageSrc(raw?: string): string | undefined {
  const s = raw?.trim();
  if (!s || isRetiredBundleImageSrc(s)) return undefined;
  return s;
}

/**
 * Exactly four static PDP images: before/after, problem (story), timeline lifestyle, formula (pre-guarantee).
 * Qty-1 upsell packshots (`upsellSlotSrc[1]`) are for bundle-offer thumbnails only — not stacked PDP heroes.
 */
export function getProductPdpScrollImages(
  pageImage: ProductImageRef,
  homePackshotSrc?: string,
): ProductPdpScrollImages {
  const beforeAfter = getProductBeforeAfterHeroSrc(pageImage);
  const problem = cleanPdpImageSrc(pageImage.storySrc);
  const timeline =
    cleanPdpImageSrc(pageImage.timelineSectionImageSrc) ??
    cleanPdpImageSrc(homePackshotSrc);
  const formula = cleanPdpImageSrc(pageImage.formulaSectionImageSrc);

  return { beforeAfter, problem, timeline, formula };
}

/** Three-image carousel below the fixed before/after hero (main, story, formula). */
export function getProductCarouselImageSrcs(
  pageImage: ProductImageRef,
  homePackshotSrc?: string,
): string[] {
  const unique = buildUniqueImagePool(pageImage, false, homePackshotSrc);
  return padToSlotCount(unique, CAROUSEL_SLOT_COUNT);
}

/** PDP hero gallery — main, story, formula, timeline, then upsell/home fallbacks. */
export function getProductGalleryImageSrcs(
  pageImage: ProductImageRef,
  homePackshotSrc?: string,
): string[] {
  const unique = buildUniqueImagePool(pageImage, true, homePackshotSrc);
  return padToSlotCount(unique, GALLERY_SLOT_COUNT);
}

export function getGalleryBenefitLines(page: {
  subhook: string;
  heroBullets: string[];
}): string[] {
  const lines = [page.subhook.trim(), ...page.heroBullets.map((l) => l.trim())].filter(
    Boolean,
  );
  const seen = new Set<string>();
  return lines.filter((line) => {
    if (seen.has(line)) return false;
    seen.add(line);
    return true;
  });
}
