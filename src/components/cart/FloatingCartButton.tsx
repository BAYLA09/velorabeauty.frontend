"use client";

import { usePathname } from "next/navigation";
import { ShoppingBagIcon } from "@/components/ui/ShoppingBagIcon";
import { useCart } from "@/context/CartProvider";

/** Panier flottant — visible partout sauf funnel checkout */
export function FloatingCartButton() {
  const pathname = usePathname();
  const { openCart, eligibleUnits, open } = useCart();

  if (pathname.startsWith("/checkout") || pathname.startsWith("/order/thank-you")) {
    return null;
  }

  if (open) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`السلة، ${eligibleUnits} منتج`}
      className="fixed bottom-6 end-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#650D20] text-white shadow-[0_8px_28px_rgba(101,13,32,0.45)] transition hover:scale-105 hover:bg-[#291A1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AD65] motion-safe:animate-[cartFabPulse_2.5s_ease-in-out_infinite] sm:bottom-8 sm:end-6"
    >
      <ShoppingBagIcon className="h-6 w-6 sm:h-7 sm:w-7" />
      {eligibleUnits > 0 ? (
        <span className="absolute -left-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D6AD65] px-1 text-[10px] font-bold text-[#291A1C]">
          {eligibleUnits}
        </span>
      ) : null}
    </button>
  );
}
