import type { ProductForm } from "@/config/productPages";

export function ProductFeaturePills({
  form,
  variant = "velora",
}: {
  form: ProductForm;
  variant?: "velora" | "lara";
}) {
  const isSerum = form === "serum";
  const accent = variant === "lara" ? "text-lara-green" : "text-velora-burgundy-dark";
  const border = variant === "lara" ? "border-lara-green/12" : "border-velora-burgundy/10";
  const sub = variant === "lara" ? "text-lara-green/70" : "text-velora-burgundy/70";

  const items = isSerum
    ? [
        { main: "30 مل", sub: "حجم العبوة" },
        { main: "يومي", sub: "استخدام منتظم" },
        { main: "حلال", sub: "جودة معتمدة" },
        { main: "GMP", sub: "تصنيع مدروس" },
      ]
    : [
        { main: "60", sub: "علكة في العلبة" },
        { main: "30", sub: "يوم لكل علبة" },
        { main: "حلال", sub: "بكتين نباتي" },
        { main: "GMP", sub: "جودة معتمدة" },
      ];

  return (
    <div className="mt-3 grid grid-cols-4 gap-2 text-center sm:mt-4">
      {items.map((item) => (
        <div
          key={item.sub}
          className={`rounded-2xl border ${border} bg-white px-1.5 py-2.5 shadow-sm sm:px-2`}
        >
          <p className={`text-sm font-extrabold sm:text-base ${accent}`}>{item.main}</p>
          <p className={`mt-0.5 text-[9px] font-semibold sm:text-[10px] ${sub}`}>{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
