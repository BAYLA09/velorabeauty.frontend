"use client";

import {
  COD_FEE_AED,
  PAYMENT_METHOD_COPY,
  type BundleQuantity,
  type PaymentMethod,
  formatAed,
  getTotalAed,
} from "@/lib/pricing";

type Props = {
  quantity: BundleQuantity;
  method: PaymentMethod;
};

export function CheckoutSummary({ quantity, method }: Props) {
  const total = getTotalAed(quantity, method);
  const copy = PAYMENT_METHOD_COPY[method];

  return (
    <aside className="rounded-3xl border border-stone-200 bg-white p-6 shadow-lg shadow-stone-200/50">
      <h2 className="text-xl font-semibold text-stone-900">ملخص الطلب</h2>
      <p className="text-sm text-stone-500">Order summary</p>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-stone-600">الكمية / Quantity</dt>
          <dd className="font-medium text-stone-900">{quantity}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone-600">طريقة الدفع / Payment</dt>
          <dd className="text-right font-medium text-stone-900">
            {copy.titleAr}
            <br />
            <span className="text-xs font-normal text-stone-500">{copy.titleEn}</span>
          </dd>
        </div>
        {method === "cod" && (
          <div className="flex justify-between gap-4 rounded-xl bg-amber-50 px-3 py-2 text-amber-900">
            <dt>رسوم الشحن (COD)</dt>
            <dd className="font-medium">+{formatAed(COD_FEE_AED)}</dd>
          </div>
        )}
        {method === "card" && (
          <div className="flex justify-between gap-4 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">
            <dt>رسوم إضافية</dt>
            <dd className="font-medium">لا يوجد / None</dd>
          </div>
        )}
      </dl>

      <div className="mt-6 border-t border-stone-100 pt-4">
        <div className="flex items-end justify-between">
          <span className="text-stone-600">المجموع / Total</span>
          <span className="text-3xl font-bold text-rose-600">{formatAed(total)}</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-stone-500">
          {method === "card"
            ? "الدفع بالبطاقة — بدون رسوم إضافية"
            : `الدفع عند الاستلام — +${COD_FEE_AED} AED رسوم الشحن`}
        </p>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-full bg-stone-900 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
      >
        إتمام الطلب · Complete order
      </button>
    </aside>
  );
}
