"use client";

import Link from "next/link";

/** Mobile: زر CTA ثابت يفتح صفحة اختيار الدفع */
export function ProductMobileStickyBar({ ctaLabel, href }: { ctaLabel: string; href: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-velora-burgundy/10 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(58,24,32,0.12)] backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <Link
        href={href}
        className="flex w-full items-center justify-center rounded-2xl bg-[#2c1318] py-4 text-base font-black text-white shadow-lg"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
