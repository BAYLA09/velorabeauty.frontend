import type { ProductPageConfig } from "@/config/productPages";
import { sharedProductPageBlocks } from "@/config/productPageShared";
import type { ProductImageRef } from "@/lib/productCatalog";
import type { PaymentMethod } from "@/config/pricing";

/** Matches {@link codFee} in pricing — kept local to avoid import cycles. */
const WARM_TEE_COD_SURCHARGE_AED = 20;

export const WARM_TEE_SLUG = "warm";
export const WARM_TEE_SKU = "WARMTEE";
export const WARM_TEE_PRICE_AED = 79;

export const WARM_TEE_IMAGE_SRC = "/images/products/warm-tee.webp?v=20261020";

export const WARM_TEE_NAME_AR = "تيشيرت أسود سادة";
export const WARM_TEE_NAME_EN = "Plain Black T-Shirt";

export const WARM_TEE_DESCRIPTION_AR =
  "قطن ناعم، مقاس عادي، للجنسين — المقاسات من S إلى XL.";

export function isWarmTeeSlug(slug: string): boolean {
  return slug.trim() === WARM_TEE_SLUG;
}

export function warmTeeMerchandiseAed(quantity: number): number | null {
  if (quantity !== 1) return null;
  return WARM_TEE_PRICE_AED;
}

export function warmTeeCheckoutTotalAed(method: PaymentMethod): number {
  return WARM_TEE_PRICE_AED + (method === "cod" ? WARM_TEE_COD_SURCHARGE_AED : 0);
}

/** Sheet / fulfillment SKU (URL slug stays `warm`). */
export function resolveOrderSheetSku(slug: string): string {
  return isWarmTeeSlug(slug) ? WARM_TEE_SKU : slug;
}

export function resolveProductSlugFromSheetSku(sku: string): string {
  const trimmed = sku.trim();
  if (trimmed.toUpperCase() === WARM_TEE_SKU) return WARM_TEE_SLUG;
  return trimmed;
}

/** Snap Ads catalog item id */
export function snapCatalogContentId(slug: string): string | null {
  if (isWarmTeeSlug(slug)) return WARM_TEE_SKU;
  return slug;
}

export type WarmTeeCatalogProduct = {
  id: "warm";
  number: string;
  name: string;
  ingredient: string;
  description: string;
  price: number;
  priceLabel: string;
  image: { src: string; placeholder: string };
  cta: string;
};

export const warmTeeProduct: WarmTeeCatalogProduct = {
  id: "warm",
  number: "—",
  name: WARM_TEE_NAME_AR,
  ingredient: WARM_TEE_NAME_EN,
  description: WARM_TEE_DESCRIPTION_AR,
  price: WARM_TEE_PRICE_AED,
  priceLabel: `${WARM_TEE_PRICE_AED} د.إ`,
  image: {
    src: WARM_TEE_IMAGE_SRC,
    placeholder: WARM_TEE_NAME_AR,
  },
  cta: "اطلب الآن",
};

const warmShared = sharedProductPageBlocks("gummy");

export const warmTeePageConfig: ProductPageConfig = {
  ...warmShared,
  slug: WARM_TEE_SLUG,
  form: "gummy",
  seoTitle: `${WARM_TEE_NAME_AR} | فيلورا`,
  seoDescription: `${WARM_TEE_NAME_EN} — ${WARM_TEE_DESCRIPTION_AR}`,
  headlineQuestion: WARM_TEE_NAME_AR,
  subhook: WARM_TEE_NAME_EN,
  heroBullets: [
    "قطن مريح",
    "مقاس عادي — للجنسين",
    "المقاسات S · M · L · XL",
  ],
  mechanismSteps: [],
  resultsPromiseTitle: "",
  resultsPromiseLead: "",
  statChips: [],
  urgencyLine: "",
  hook: WARM_TEE_NAME_AR,
  hookSub: WARM_TEE_DESCRIPTION_AR,
  highlightStat: { value: String(WARM_TEE_PRICE_AED), label: "د.إ" },
  problemImagePlaceholder: "",
  painEyebrow: "",
  painTitle: "",
  painLead: "",
  painItems: [],
  formulaEyebrow: "",
  formulaTitle: "",
  formulaSubtitle: "",
  formulaCards: [],
  notIncludedTitle: "",
  notIncluded: [],
  brandQuoteTitle: "",
  brandQuote: "",
  statHighlightGrid: [],
  timelineTitle: "",
  timelineNote: "",
  timelineSteps: [],
  usageTitle: "",
  usageSubtitle: "",
  usageSteps: [],
  galleryPlaceholders: [],
  faq: [],
  emotionalProof: { title: "", subtitle: "", lines: [] },
};

export const warmTeePageImage: ProductImageRef = {
  src: WARM_TEE_IMAGE_SRC,
  placeholder: WARM_TEE_NAME_AR,
};
