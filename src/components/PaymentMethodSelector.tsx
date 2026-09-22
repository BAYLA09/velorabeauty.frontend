"use client";

import {
  PAYMENT_METHOD_COPY,
  type BundleQuantity,
  type PaymentMethod,
  formatAed,
  getTotalAed,
} from "@/lib/pricing";

type Props = {
  method: PaymentMethod;
  quantity: BundleQuantity;
  onChange: (m: PaymentMethod) => void;
};

export function PaymentMethodSelector({ method, quantity, onChange }: Props) {
  const methods: PaymentMethod[] = ["card", "cod"];

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-stone-900">
        طريقة الدفع <span className="text-stone-500 font-normal">/ Payment</span>
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {methods.map((m) => {
          const copy = PAYMENT_METHOD_COPY[m];
          const isActive = method === m;
          const total = getTotalAed(quantity, m);
          return (
            <button
              key={m}
              type="button"
              onClick={() => onChange(m)}
              className={`rounded-2xl border-2 p-4 text-right transition-all ${
                isActive
                  ? "border-rose-500 bg-rose-50 shadow-md shadow-rose-100"
                  : "border-stone-200 bg-white hover:border-rose-200"
              }`}
            >
              <p className="font-semibold text-stone-900">{copy.titleAr}</p>
              <p className="text-sm text-stone-600">{copy.titleEn}</p>
              <p
                className={`mt-2 text-sm font-medium ${
                  m === "cod" ? "text-amber-800" : "text-emerald-700"
                }`}
              >
                {copy.subtitleAr}
              </p>
              <p className="text-xs text-stone-500">{copy.subtitleEn}</p>
              <p className="mt-3 text-xl font-bold text-stone-900">
                {formatAed(total)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
