export type CartLine = {
  slug: string;
  quantity: number;
};

export type CartState = {
  lines: CartLine[];
  updatedAt: string;
};

export const CART_STORAGE_KEY = "velora-cart-v1";
/** Bundle tiers 1 / 2 / 3 (199 / 249 / 339 AED). */
export const MAX_BUNDLE_UNITS = 3;
/** Max units in cart — 4th unit billed on top of 3-pack ( +199 AED ). */
export const MAX_CART_UNITS = 4;

export const MIXED_CART_PRODUCT_SLUG = "velora-mixed-cart";
