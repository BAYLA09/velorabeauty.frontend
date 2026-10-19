"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/context/CartProvider";
import { StripeGlobalWarmup } from "@/components/checkout/StripeGlobalWarmup";

export function CartRoot({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <StripeGlobalWarmup />
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
