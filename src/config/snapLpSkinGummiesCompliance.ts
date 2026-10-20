/**
 * Snap ad landing compliance copy — ONLY for `/lp/snap/skin-gummies`.
 * Do not use on catalog PDP, cart, or shared product config.
 */
export const SKIN_GUMMIES_SNAP_LP_SLUG = "skin-gummies";

const LIFESTYLE_HERO = "/images/products/pdp/skin-timeline-slot.webp?v=20261007";

export type SnapLpSkinGummiesOverride = {
  metaTitle: string;
  metaDescription: string;
  openGraphTitle: string;
  openGraphDescription: string;
  heroImageSrc: string;
  heroImageAlt: string;
  ingredientLine: string;
  headline: string;
  body: string;
};

export const snapLpSkinGummiesOverride: SnapLpSkinGummiesOverride = {
  metaTitle: "علكات فيلورا للبشرة | فيلورا",
  metaDescription:
    "خطوة يومية بسيطة لروتين العناية — ترطيب ومظهر بشرة مرتاحة. توصيل 2–4 أيام داخل الإمارات، دفع عند الاستلام أو بالبطاقة.",
  openGraphTitle: "علكات فيلورا للبشرة — روتين يومي",
  openGraphDescription:
    "عناية يومية خفيفة للبشرة — فيتامين C والكولاجين والبيوتين ضمن روتينك، بلا ادعاءات طبية.",
  heroImageSrc: LIFESTYLE_HERO,
  heroImageAlt: "علكات فيلورا للبشرة — عناية يومية",
  ingredientLine: "بفيتامين C والكولاجين والبيوتين",
  headline: "علكات فيلورا للبشرة",
  body:
    "خطوة يومية بسيطة لروتين العناية — ترطيب ومظهر بشرة مرتاحة ومعتنى بها، بلا ادعاءات طبية أو نتائج مضمونة.",
};

export function getSnapLpSkinGummiesOverride(
  slug: string,
): SnapLpSkinGummiesOverride | undefined {
  return slug === SKIN_GUMMIES_SNAP_LP_SLUG ? snapLpSkinGummiesOverride : undefined;
}
