"use client";

import { checkout } from "@/config/content";
import {
  codFee,
  currencyLabel,
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";

type Props = {
  quantity: BundleQuantity;
  method: PaymentMethod;
  submitLabel?: string;
  submitType?: "button" | "submit";
  onSubmit?: () => void;
  variant?: "light" | "dark";
};

const quantityLabels: Record<BundleQuantity, string> = {
  1: "منتج واحد",
  2: "منتجان",
  3: "المجموعة الكاملة (٣ منتجات)",
};

export function CheckoutSummary({
  quantity,
  method,
  submitLabel = checkout.submit,
  submitType = "button",
  onSubmit,
  variant = "light",
}: Props) {
  const total = getCheckoutTotal(quantity, method);
  const isDark = variant === "dark";

  return (
    <aside
      className={
        isDark
          ? "rounded-[2rem] border border-white/15 bg-white p-6 shadow-2xl lg:sticky lg:top-28"
          : "rounded-[2rem] border border-velora-burgundy/10 bg-white p-6 shadow-xl shadow-velora-burgundy/5 lg:sticky lg:top-28"
      }
    >
      <h3 className="text-xl font-bold text-velora-burgundy">{checkout.summaryTitle}</h3>

      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-velora-burgundy/65">العرض</dt>
          <dd className="font-medium text-velora-burgundy">{quantityLabels[quantity]}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-velora-burgundy/65">طريقة الدفع</dt>
          <dd className="font-medium text-velora-burgundy">
            {method === "card" ? "الدفع بالبطاقة" : "الدفع عند الاستلام"}
          </dd>
        </div>
        {method === "cod" && (
          <div className="rounded-xl bg-velora-champagne/15 px-3 py-2 text-velora-burgundy">
            <div className="flex justify-between gap-4">
              <dt>رسوم الدفع عند الاستلام</dt>
              <dd className="font-semibold">
                +{codFee} {currencyLabel}
              </dd>
            </div>
          </div>
        )}
      </dl>

      <div className="mt-6 border-t border-velora-burgundy/10 pt-5">
        <div className="flex items-end justify-between">
          <span className="text-velora-burgundy/65">المجموع</span>
          <span className="text-3xl font-bold text-velora-burgundy">{formatPrice(total)}</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-velora-burgundy/60">
          {method === "card" ? checkout.cardNote : checkout.codNote}
        </p>
      </div>

      <button
        type={submitType}
        onClick={submitType === "button" ? onSubmit : undefined}
        className="mt-6 w-full rounded-full bg-velora-burgundy py-4 text-sm font-semibold text-velora-cream transition hover:bg-velora-burgundy-light"
      >
        {submitLabel}
      </button>
    </aside>
  );
}
