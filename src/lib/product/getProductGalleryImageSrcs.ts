import { isRetiredBundleImageSrc } from "@/config/retiredBundleImage";
import type { ProductImageRef } from "@/lib/productCatalog";

const GALLERY_SLOT_COUNT = 4;

/** PDP hero gallery — main, story, formula, timeline, then upsell/home fallbacks. */
export function getProductGalleryImageSrcs(
  pageImage: ProductImageRef,
  homePackshotSrc?: string,
): string[] {
  const pool = [
    pageImage.src,
    pageImage.storySrc,
    pageImage.formulaSectionImageSrc,
    pageImage.timelineSectionImageSrc,
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

  if (unique.length === 0) return [];

  const result = [...unique];
  while (result.length < GALLERY_SLOT_COUNT) {
    result.push(unique[result.length % unique.length]);
  }
  return result.slice(0, GALLERY_SLOT_COUNT);
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
