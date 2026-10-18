/** Keep in sync with `productPages` slugs (avoids heavy config import in server paths). */
const CORE_PRODUCT_SLUGS = ["hair-gummies", "skin-gummies", "eye-serum"] as const;

export const REDIRECTKILLER_COOKIE_SESSION = "rk_session";
export const REDIRECTKILLER_COOKIE_CSRF = "rk_csrf";
export const REDIRECTKILLER_CSRF_HEADER = "x-rk-csrf";

export const REDIRECT_PUBLIC_PREFIX = "/ads";

export type RedirectDestinationOption = { label: string; path: string };

export const REDIRECT_PRESET_DESTINATIONS: RedirectDestinationOption[] = [
  { label: "Brand landing (EN)", path: "/lp" },
  { label: "Homepage", path: "/" },
  { label: "Hair Gummies", path: "/products/hair-gummies" },
  { label: "Skin Gummies", path: "/products/skin-gummies" },
  { label: "Eye Serum", path: "/products/eye-serum" },
];

/** Presets plus any other allowlisted internal paths (for admin dropdown). */
export function getRedirectDestinationOptions(): RedirectDestinationOption[] {
  const presetPaths = new Set(REDIRECT_PRESET_DESTINATIONS.map((p) => p.path));
  const extras = listAllowedInternalPaths()
    .filter((path) => !presetPaths.has(path))
    .map((path) => ({ label: path, path }));
  return [...REDIRECT_PRESET_DESTINATIONS, ...extras];
}

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
