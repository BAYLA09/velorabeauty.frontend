/** Keep in sync with `productPages` slugs (avoids heavy config import in server paths). */
const CORE_PRODUCT_SLUGS = ["hair-gummies", "skin-gummies", "eye-serum"] as const;

export const REDIRECTKILLER_COOKIE_SESSION = "rk_session";
export const REDIRECTKILLER_COOKIE_CSRF = "rk_csrf";
export const REDIRECTKILLER_CSRF_HEADER = "x-rk-csrf";

export const REDIRECT_PUBLIC_PREFIX = "/ads";

export const REDIRECT_PRESET_DESTINATIONS = [
  { label: "Hair Gummies", path: "/products/hair-gummies" },
  { label: "Skin Gummies", path: "/products/skin-gummies" },
  { label: "Eye Serum", path: "/products/eye-serum" },
] as const;

const productPathSet = new Set(CORE_PRODUCT_SLUGS.map((slug) => `/products/${slug}`));

/** Internal paths allowed as redirect targets (open redirect protection). */
export function listAllowedInternalPaths(): string[] {
  const extra = (process.env.REDIRECTKILLER_EXTRA_DESTINATIONS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const base = [
    "/",
    "/lp",
    "/checkout",
    "/checkout/cod",
    "/checkout/card",
    ...CORE_PRODUCT_SLUGS.map((slug) => `/products/${slug}`),
  ];
  const merged = new Set([...base, ...extra]);
  return [...merged].sort();
}

export function isKnownProductPath(path: string): boolean {
  return productPathSet.has(path);
}
