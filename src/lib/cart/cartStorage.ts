import type { CartState } from "@/lib/cart/cartTypes";
import { CART_STORAGE_KEY } from "@/lib/cart/cartTypes";
import { normalizeCartLines } from "@/lib/cart/cartPricing";

export function readCartFromStorage(): CartState {
  if (typeof window === "undefined") {
    return { lines: [], updatedAt: new Date(0).toISOString() };
  }
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { lines: [], updatedAt: new Date(0).toISOString() };
    const parsed = JSON.parse(raw) as CartState;
    return {
      lines: normalizeCartLines(parsed.lines ?? []),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return { lines: [], updatedAt: new Date(0).toISOString() };
  }
}

export function writeCartToStorage(state: CartState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
}
