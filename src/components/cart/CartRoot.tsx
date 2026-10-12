"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import { CartProvider } from "@/context/CartProvider";
import { StripeGlobalWarmup } from "@/components/checkout/StripeGlobalWarmup";

export function CartRoot({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <StripeGlobalWarmup />
      {children}
      <FloatingCartButton />
      <CartDrawer />
    </CartProvider>
  );
}
