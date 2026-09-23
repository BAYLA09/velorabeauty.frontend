"use client";

import { IconCheckCircle, IconTruck } from "@/components/product/ProductFunnelIcons";

/** Sticky bar: trust + CTA on mobile (Velora colors) */
export function ProductMobileStickyBar({ ctaLabel }: { ctaLabel: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="grid grid-cols-2 divide-x divide-white/15 bg-[#2c1318] text-velora-cream">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <IconCheckCircle className="h-5 w-5 shrink-0 text-velora-champagne" />
          <div className="min-w-0 text-right">
            <p className="text-[11px] font-extrabold leading-tight">الدفع عند الاستلام</p>
            <p className="text-[9px] text-velora-cream/65">بدون دفع أونلاين</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <IconTruck className="h-5 w-5 shrink-0 text-velora-champagne" />
          <div className="min-w-0 text-right">
            <p className="text-[11px] font-extrabold leading-tight">توصيل 1–3 أيام</p>
            <p className="text-[9px] text-velora-cream/65">كل مدن الإمارات</p>
          </div>
        </div>
      </div>
      <div className="border-t border-velora-burgundy/10 bg-white p-3 shadow-[0_-8px_30px_rgba(58,24,32,0.12)]">
        <button
          type="button"
          onClick={() => {
            document.getElementById("purchase")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full rounded-2xl bg-[#2c1318] py-4 text-base font-black text-white shadow-lg"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
