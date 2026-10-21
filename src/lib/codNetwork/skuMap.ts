import { isWarmTeeSlug, resolveOrderSheetSku } from "@/config/warmTeeProduct";

const DEFAULT_COD_NETWORK_SKU_MAP: Record<string, string> = {
  "hair-gummies": "HAIRAMIN",
  "eye-serum": "vitaminamin",
  "skin-gummies": "WHITEAMIN",
};

function parseSkuMapJson(raw: string): Record<string, string> | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const slug = String(key).trim();
      const sku = String(value ?? "").trim();
      if (slug && sku) out[slug] = sku;
    }
    return out;
  } catch {
    return null;
  }
}

/** Slug → COD Network product SKU (push + sheet). Env `COD_NETWORK_SKU_MAP_JSON` overrides defaults. */
export function readCodNetworkSkuMap(): Record<string, string> {
  const raw = process.env.COD_NETWORK_SKU_MAP_JSON?.trim();
  if (!raw) return { ...DEFAULT_COD_NETWORK_SKU_MAP };
  const parsed = parseSkuMapJson(raw);
  return parsed ? { ...DEFAULT_COD_NETWORK_SKU_MAP, ...parsed } : { ...DEFAULT_COD_NETWORK_SKU_MAP };
}

/** COD Network SKU when mapped; `null` if unmapped. */
export function resolveCodNetworkSkuForSlug(slug: string): string | null {
  const key = slug.trim();
  if (!key) return null;
  const map = readCodNetworkSkuMap();
  return map[key] ?? null;
}

/** Value for Google Sheets `sku` column: mapped COD SKU, else legacy (slug or WARMTEE). */
export function resolveCodSheetSku(slug: string): string {
  const mapped = resolveCodNetworkSkuForSlug(slug);
  if (mapped) return mapped;
  return resolveOrderSheetSku(slug);
}

export function isCodNetworkPushBlockedSlug(slug: string): boolean {
  return isWarmTeeSlug(slug);
}

export function orderLinesPushableToCodNetwork(slugs: string[]): {
  ok: true;
} | { ok: false; reason: string } {
  if (slugs.some((s) => isCodNetworkPushBlockedSlug(s))) {
    return { ok: false, reason: "warm_not_pushable" };
  }
  const unmapped = slugs.filter((s) => !resolveCodNetworkSkuForSlug(s));
  if (unmapped.length > 0) {
    return { ok: false, reason: `unmapped_sku:${unmapped.join(",")}` };
  }
  return { ok: true };
}
