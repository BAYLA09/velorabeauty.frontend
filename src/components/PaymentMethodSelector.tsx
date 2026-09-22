"use client";

import { checkout } from "@/config/content";
import {
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";

type Props = {
  method: PaymentMethod;
  quantity: BundleQuantity;
  onChange: (m: PaymentMethod) => void;
};

const methods: { id: PaymentMethod; title: string; note: string }[] = [
  { id: "card", title: "الدفع بالبطاقة", note: checkout.cardNote },
  { id: "cod", title: "الدفع عند الاستلام", note: checkout.codNote },
];

export function PaymentMethodSelector({ method, quantity, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-velora-burgundy">{checkout.paymentLabel}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {methods.map((m) => {
          const active = method === m.id;
          const total = getCheckoutTotal(quantity, m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`rounded-2xl border-2 p-4 text-right transition-all ${
                active
                  ? "border-velora-burgundy bg-velora-cream-dark shadow-md"
                  : "border-velora-burgundy/10 bg-white hover:border-velora-champagne/60"
              }`}
            >
              <p className="font-semibold text-velora-burgundy">{m.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-velora-burgundy/65">{m.note}</p>
              <p className="mt-3 text-2xl font-bold text-velora-burgundy">{formatPrice(total)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
