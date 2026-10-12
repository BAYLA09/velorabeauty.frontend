import { cardBundlePrices, formatPrice, type BundleQuantity } from "@/config/pricing";

const tiers: { qty: BundleQuantity; label: string }[] = [
  { qty: 1, label: "منتج" },
  { qty: 2, label: "منتجان" },
  { qty: 3, label: "3 منتجات" },
];

type Props = {
  eligibleUnits: number;
};

/** Lara-style tier strip — 199 / 249 / 339 mixed bundle */
export function CartBundleProgress({ eligibleUnits }: Props) {
  return (
    <div
      className="rounded-2xl border border-[#650D20]/12 bg-white p-3 shadow-sm"
      aria-label="عروض السلة المختلطة"
    >
      <p className="text-center text-[11px] font-bold text-[#291A1C]/55">اختاري حجم العرض</p>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {tiers.map(({ qty, label }) => {
          const done = eligibleUnits > qty;
          const current =
            eligibleUnits === 0 ? qty === 1 : eligibleUnits === qty;
          const price = cardBundlePrices[qty];
          return (
            <div
              key={qty}
              className={`rounded-xl border-2 px-1 py-2 text-center transition ${
                current
                  ? "border-[#650D20] bg-[#fdf2f4] shadow-sm"
                  : done
                    ? "border-emerald-200 bg-emerald-50/80"
                    : "border-[#650D20]/10 bg-[#FFF9F5]"
              }`}
            >
              {done ? (
                <span className="mx-auto mb-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                  ✓
                </span>
              ) : current ? (
                <span
                  className="mx-auto mb-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#650D20] bg-white"
                  aria-hidden
                >
                  <span className="h-2 w-2 rounded-full bg-[#650D20]" />
                </span>
              ) : (
                <span
                  className="mx-auto mb-0.5 block h-4 w-4 rounded-full border-2 border-[#650D20]/20 bg-white"
                  aria-hidden
                />
              )}
              <p className="text-[9px] font-bold leading-tight text-[#291A1C]/70">{label}</p>
              <p className="mt-0.5 text-xs font-black tabular-nums text-[#650D20]">
                {formatPrice(price)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
