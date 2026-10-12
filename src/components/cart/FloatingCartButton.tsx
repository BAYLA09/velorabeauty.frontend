"use client";

import { usePathname } from "next/navigation";
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
      className="fixed bottom-6 left-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#650D20] text-white shadow-[0_8px_28px_rgba(101,13,32,0.45)] transition hover:scale-105 hover:bg-[#291A1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AD65] motion-safe:animate-[cartFabPulse_2.5s_ease-in-out_infinite] sm:bottom-8 sm:left-6"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 7h15l-1.5 9h-12z" />
        <path d="M6 7L5 4H2" />
        <circle cx="9" cy="19" r="1" fill="currentColor" />
        <circle cx="17" cy="19" r="1" fill="currentColor" />
      </svg>
      {eligibleUnits > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D6AD65] px-1 text-[10px] font-black text-[#291A1C]">
          {eligibleUnits}
        </span>
      ) : null}
    </button>
  );
}
