/** Legacy 3-product composite packshot — do not render in UI or galleries. */
export const RETIRED_BUNDLE_IMAGE_PATH = "/images/products/bundle.webp";

export function isRetiredBundleImageSrc(src?: string | null): boolean {
  const s = src?.trim();
  if (!s) return false;
  return s.includes("products/bundle.") || s.includes("products/bundle?");
}
