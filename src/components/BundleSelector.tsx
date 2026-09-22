"use client";

import {
  bundleQuantities,
  cardBundlePrices,
  codBundlePrices,
  formatPrice,
  type BundleQuantity,
} from "@/config/pricing";
import { checkout } from "@/config/content";

type Props = {
  selected: BundleQuantity;
  onChange: (q: BundleQuantity) => void;
};

const bundleLabels: Record<BundleQuantity, string> = {
  1: "منتج واحد",
  2: "منتجان",
  3: "المجموعة الكاملة",
};

export function BundleSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-velora-burgundy">{checkout.bundleLabel}</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {bundleQuantities.map((qty) => {
          const active = selected === qty;
          return (
            <button
              key={qty}
              type="button"
              onClick={() => onChange(qty)}
              className={`rounded-2xl border-2 p-4 text-right transition-all ${
                active
                  ? "border-velora-burgundy bg-velora-cream-dark shadow-md"
                  : "border-velora-burgundy/10 bg-white hover:border-velora-champagne/60"
              }`}
            >
              <p className="text-sm font-medium text-velora-burgundy">{bundleLabels[qty]}</p>
              <p className="mt-2 text-xl font-bold text-velora-burgundy">
                {formatPrice(cardBundlePrices[qty])}
              </p>
              <p className="mt-2 text-xs text-velora-burgundy/55">
                عند الاستلام: {formatPrice(codBundlePrices[qty])}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
