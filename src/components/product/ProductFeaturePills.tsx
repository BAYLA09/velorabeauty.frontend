import type { ProductForm } from "@/config/productPages";
import { productPageFlags } from "@/config/productPageFlags";

export function ProductFeaturePills({ form }: { form: ProductForm }) {
  const isSerum = form === "serum";

  const certItems = isSerum
    ? [
        { main: "حلال", sub: "جودة معتمدة" },
        { main: "GMP", sub: "تصنيع مدروس" },
      ]
    : [
        { main: "حلال", sub: "بكتين نباتي" },
        { main: "GMP", sub: "جودة معتمدة" },
      ];

  const safeItems = isSerum
    ? [
        { main: "30 مل", sub: "حجم العبوة" },
        { main: "يومي", sub: "استخدام منتظم" },
        { main: "UAE", sub: "توصيل الإمارات" },
        { main: "لطيف", sub: "قوام خفيف" },
      ]
    : [
        { main: "60", sub: "علكة في العلبة" },
        { main: "30", sub: "يوم لكل علبة" },
        { main: "UAE", sub: "توصيل الإمارات" },
        { main: "روتين", sub: "خطوة يومية" },
      ];

  const items = productPageFlags.showCertBadges
    ? isSerum
      ? [
          { main: "30 مل", sub: "حجم العبوة" },
          { main: "يومي", sub: "استخدام منتظم" },
          ...certItems,
        ]
      : [
          { main: "60", sub: "علكة في العلبة" },
          { main: "30", sub: "يوم لكل علبة" },
          ...certItems,
        ]
    : safeItems;

  return (
    <div className="mt-3 grid grid-cols-4 gap-2 text-center sm:mt-4">
      {items.map((item) => (
        <div
          key={`${item.main}-${item.sub}`}
          className="rounded-2xl border border-velora-burgundy/10 bg-white px-1.5 py-2.5 shadow-sm sm:px-2"
        >
          <p className="text-sm font-extrabold text-velora-burgundy-dark sm:text-base">{item.main}</p>
          <p className="mt-0.5 text-[9px] font-semibold text-velora-burgundy/70 sm:text-[10px]">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
