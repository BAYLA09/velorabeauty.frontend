"use client";

import {
  BUNDLE_OPTIONS,
  CARD_PRICES,
  COD_PRICES,
  type BundleQuantity,
  formatAed,
} from "@/lib/pricing";

type Props = {
  selected: BundleQuantity;
  onChange: (q: BundleQuantity) => void;
};

export function BundleSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-stone-900">
        اختر العرض <span className="text-stone-500 font-normal">/ Choose bundle</span>
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {BUNDLE_OPTIONS.map((qty) => {
          const isActive = selected === qty;
          return (
            <button
              key={qty}
              type="button"
              onClick={() => onChange(qty)}
              className={`rounded-2xl border-2 p-4 text-right transition-all ${
                isActive
                  ? "border-rose-500 bg-rose-50 shadow-md shadow-rose-100"
                  : "border-stone-200 bg-white hover:border-rose-200"
              }`}
            >
              <p className="text-sm text-stone-600">
                {qty === 1 ? "حبة واحدة" : `${qty} حبات`}
              </p>
              <p className="mt-1 text-2xl font-bold text-stone-900">
                {formatAed(CARD_PRICES[qty])}
              </p>
              <p className="mt-2 text-xs text-stone-500">
                بطاقة · COD {formatAed(COD_PRICES[qty])}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
