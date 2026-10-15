"use client";

import { usePathname } from "next/navigation";
import { ShoppingBagIcon } from "@/components/ui/ShoppingBagIcon";
import { useCart } from "@/context/CartProvider";

/** Panier flottant — même icône / style bouton que larabeauty.store (shopping-bag) */
export function FloatingCartButton() {
  const pathname = usePathname();
  const { openCart, eligibleUnits, open } = useCart();

  if (
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/order/thank-you")
  ) {
    return null;
  }

  if (open) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`السلة (${eligibleUnits} عناصر)`}
      className="fixed bottom-6 end-4 z-[90] relative rounded-full border border-[#650D20]/10 bg-white/95 p-3 text-[#291A1C] shadow-[0_8px_28px_rgba(41,26,28,0.12)] backdrop-blur-md transition hover:bg-[#FCE8E5]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AD65] sm:bottom-8 sm:end-6 sm:p-3.5"
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
