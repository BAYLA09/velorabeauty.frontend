"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { countEligibleUnits, normalizeCartLines } from "@/lib/cart/cartPricing";
import type { CartLine } from "@/lib/cart/cartTypes";
import { MAX_CART_UNITS } from "@/lib/cart/cartTypes";
import { isEligibleProductSlug } from "@/lib/cart/eligibleCatalog";
import { readCartFromStorage, writeCartToStorage } from "@/lib/cart/cartStorage";

type CartUiState = {
  open: boolean;
  status: "idle" | "updating" | "success" | "error";
  message: string | null;
};

type State = {
  lines: CartLine[];
  ui: CartUiState;
};

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "set_open"; open: boolean }
  | { type: "set_lines"; lines: CartLine[]; flash?: "success" }
  | { type: "set_status"; status: CartUiState["status"]; message?: string | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, lines: action.lines };
    case "set_open":
      return { ...state, ui: { ...state.ui, open: action.open } };
    case "set_lines":
      return {
        ...state,
        lines: action.lines,
        ui: {
          ...state.ui,
          status: action.flash ? "success" : "idle",
          message: action.flash ? "تمت الإضافة إلى السلة" : null,
        },
      };
    case "set_status":
      return {
        ...state,
        ui: { ...state.ui, status: action.status, message: action.message ?? null },
      };
    default:
      return state;
  }
}

type CartContextValue = {
  lines: CartLine[];
  open: boolean;
  eligibleUnits: number;
  ui: CartUiState;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (slug: string, quantity?: number) => boolean;
  setLineQuantity: (slug: string, quantity: number) => void;
  removeLine: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function persist(lines: CartLine[]) {
  writeCartToStorage({ lines, updatedAt: new Date().toISOString() });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    lines: [],
    ui: { open: false, status: "idle", message: null },
  });
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readCartFromStorage();
    dispatch({ type: "hydrate", lines: stored.lines });
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    persist(state.lines);
  }, [state.lines]);

  const eligibleUnits = useMemo(() => countEligibleUnits(state.lines), [state.lines]);

  const applyLines = useCallback((lines: CartLine[], flash?: "success") => {
    dispatch({ type: "set_lines", lines: normalizeCartLines(lines), flash });
  }, []);

  const addItem = useCallback(
    (slug: string, quantity = 1): boolean => {
      if (!isEligibleProductSlug(slug)) return false;
      const addQty = Math.max(1, Math.floor(quantity));
      const current = countEligibleUnits(state.lines);
      if (current + addQty > MAX_CART_UNITS) {
        dispatch({
          type: "set_status",
          status: "error",
          message: "الحد 4 منتجات (3 بعرض + الرابع 199 د.إ).",
        });
        return false;
      }
      const next = [...state.lines];
      const idx = next.findIndex((l) => l.slug === slug);
      if (idx >= 0) next[idx] = { slug, quantity: next[idx].quantity + addQty };
      else next.push({ slug, quantity: addQty });
      applyLines(next, "success");
      return true;
    },
    [applyLines, state.lines],
  );

  const setLineQuantity = useCallback(
    (slug: string, quantity: number) => {
      const qty = Math.floor(quantity);
      if (qty < 1) {
        applyLines(state.lines.filter((l) => l.slug !== slug));
        return;
      }
      const others = countEligibleUnits(state.lines.filter((l) => l.slug !== slug));
      if (others + qty > MAX_CART_UNITS) {
        dispatch({
          type: "set_status",
          status: "error",
          message: "الحد 4 منتجات (3 بعرض + الرابع 199 د.إ).",
        });
        return;
      }
      applyLines(
        state.lines.map((l) => (l.slug === slug ? { slug, quantity: qty } : l)),
      );
    },
    [applyLines, state.lines],
  );

  const removeLine = useCallback(
    (slug: string) => {
      applyLines(state.lines.filter((l) => l.slug !== slug));
    },
    [applyLines, state.lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      open: state.ui.open,
      eligibleUnits,
      ui: state.ui,
      openCart: () => dispatch({ type: "set_open", open: true }),
      closeCart: () => dispatch({ type: "set_open", open: false }),
      toggleCart: () => dispatch({ type: "set_open", open: !state.ui.open }),
      addItem,
      setLineQuantity,
      removeLine,
      clearCart: () => applyLines([]),
    }),
    [addItem, applyLines, eligibleUnits, removeLine, setLineQuantity, state.lines, state.ui],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
