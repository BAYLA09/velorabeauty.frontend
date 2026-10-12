export type CartLine = {
  slug: string;
  quantity: number;
};

export type CartState = {
  lines: CartLine[];
  updatedAt: string;
};

export const CART_STORAGE_KEY = "velora-cart-v1";
export const MAX_BUNDLE_UNITS = 3;

export const MIXED_CART_PRODUCT_SLUG = "velora-mixed-cart";
