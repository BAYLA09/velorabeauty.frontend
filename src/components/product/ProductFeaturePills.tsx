import type { ProductForm } from "@/config/productPages";

export function ProductFeaturePills({ form }: { form: ProductForm }) {
  const isSerum = form === "serum";

  const items = isSerum
    ? [
        { main: "30 مل", sub: "حجم العبوة" },
        { main: "يومي", sub: "استخدام منتظم" },
        { main: "فيتامين E", sub: "تركيز مركّز" },
        { main: "مرخّص", sub: "معتمد رسمياً" },
      ]
    : [
        { main: "60", sub: "علكة في العلبة" },
        { main: "30", sub: "يوم لكل علبة" },
        { main: "حلال", sub: "بكتين نباتي" },
        { main: "مرخّص", sub: "معتمد رسمياً" },
      ];

  return (
    <div className="mt-4 grid grid-cols-4 gap-2 text-center">
      {items.map((item) => (
        <div
          key={item.sub}
          className="rounded-2xl border border-velora-burgundy/10 bg-white px-2 py-2.5 shadow-sm"
        >
          <p className="text-sm font-extrabold text-velora-burgundy-dark sm:text-base">
            {item.main}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-velora-burgundy/70 sm:text-xs">
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
