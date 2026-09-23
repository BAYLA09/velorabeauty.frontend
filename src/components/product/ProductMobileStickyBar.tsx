"use client";

/** Mobile: زر CTA ثابت فقط — الثقة (COD/توصيل) فوق في الصفحة، ماشي ملصوق بالزر */
export function ProductMobileStickyBar({ ctaLabel }: { ctaLabel: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-velora-burgundy/10 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(58,24,32,0.12)] backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
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
  );
}
