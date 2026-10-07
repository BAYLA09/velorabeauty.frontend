"use client";

import { useRouter } from "next/navigation";
import type { BundleQuantity } from "@/config/pricing";
import { buildCheckoutPaymentStepPath } from "@/lib/checkoutRoutes";

type Props = {
  ctaLabel: string;
  productSlug: string;
  quantity: BundleQuantity;
};

/** Mobile: CTA → صفحة اختيار طريقة الدفع */
export function ProductMobileStickyBar({ ctaLabel, productSlug, quantity }: Props) {
  const router = useRouter();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-velora-burgundy/10 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(58,24,32,0.12)] backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <button
        type="button"
        onClick={() =>
          router.push(buildCheckoutPaymentStepPath({ product: productSlug, quantity }))
        }
        className="w-full rounded-2xl bg-[#2c1318] py-4 text-base font-black text-white shadow-lg"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
