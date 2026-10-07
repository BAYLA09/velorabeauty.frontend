"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutFunnelShell } from "@/components/checkout/CheckoutFunnelShell";
import {
  codFee,
  currencyLabel,
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import { buildCheckoutPath } from "@/lib/checkoutRoutes";

type Props = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  initialMethod?: PaymentMethod;
};

export function CheckoutPaymentStepClient({
  productSlug,
  productName,
  quantity,
  initialMethod = "card",
}: Props) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>(initialMethod);
  const query = { product: productSlug, quantity };
  const total = getCheckoutTotal(quantity, method);

  function continueCheckout() {
    router.push(buildCheckoutPath(method, query));
  }

  return (
    <CheckoutFunnelShell currentStep={2} maxWidth="md">
      <div className="mx-auto max-w-xl">
        <header className="text-center">
          <h1 className="text-2xl font-black text-velora-burgundy-dark sm:text-3xl">
            اختر طريقة الدفع
          </h1>
          <p className="mt-2 text-sm text-velora-burgundy/60">جميع المعاملات آمنة ومشفّرة</p>
          <p className="mt-1 text-xs font-semibold text-velora-burgundy/45">{productName}</p>
        </header>

        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={() => setMethod("card")}
            className={`relative w-full rounded-2xl border-2 p-4 text-right transition sm:p-5 ${
              method === "card"
                ? "border-velora-burgundy bg-[#fdf2f4] shadow-md"
                : "border-velora-burgundy/12 bg-white hover:border-velora-burgundy/25"
            }`}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-lg bg-velora-champagne/25 px-2 py-0.5 text-[10px] font-extrabold text-velora-burgundy-dark">
                الأكثر اختياراً
              </span>
              <span
                className="flex items-center gap-1.5 text-[10px] font-bold text-velora-burgundy/50"
                dir="ltr"
              >
                Apple Pay · Google Pay · Visa
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  method === "card" ? "border-velora-burgundy" : "border-velora-burgundy/25"
                }`}
              >
                {method === "card" && (
                  <span className="h-2.5 w-2.5 rounded-full bg-velora-burgundy" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-base font-black text-velora-burgundy-dark">
                  <span aria-hidden>💳</span>
                  الدفع بالبطاقة
                </p>
                <p className="mt-1 text-sm font-bold text-emerald-800">شحن مجاني</p>
                <p className="mt-0.5 text-xs text-velora-burgundy/55">دفع آمن — رابط بعد تأكيد الطلب</p>
                <p className="mt-1 text-[11px] font-semibold text-velora-burgundy/45">
                  🔒 بياناتك محمية — ما كنخزّنش بيانات البطاقة
                </p>
                {method === "card" && (
                  <div className="mt-4 rounded-xl border border-velora-burgundy/10 bg-white px-3 py-3 text-center text-xs text-velora-burgundy/65">
                    <span className="font-bold text-velora-burgundy">🔒</span> دفع 100% آمن — بياناتك
                    محمية
                  </div>
                )}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod("cod")}
            className={`w-full rounded-2xl border-2 p-4 text-right transition sm:p-5 ${
              method === "cod"
                ? "border-velora-burgundy bg-[#fdf2f4] shadow-md"
                : "border-velora-burgundy/12 bg-white hover:border-velora-burgundy/25"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  method === "cod" ? "border-velora-burgundy" : "border-velora-burgundy/25"
                }`}
              >
                {method === "cod" && (
                  <span className="h-2.5 w-2.5 rounded-full bg-velora-burgundy" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-base font-black text-velora-burgundy-dark">
                  <span aria-hidden>💵</span>
                  الدفع عند الاستلام
                </p>
                <p className="mt-1 text-sm font-bold text-amber-800">
                  +{codFee} {currencyLabel} رسوم التوصيل
                </p>
                <p className="mt-0.5 text-xs text-velora-burgundy/55">تدفعين عند استلام الطلب</p>
              </div>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={continueCheckout}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-velora-burgundy py-4 text-base font-black text-velora-cream shadow-lg transition hover:bg-velora-burgundy-light"
        >
          <span aria-hidden>🔒</span>
          {method === "card"
            ? `الدفع بالبطاقة الآن — ${formatPrice(total)}`
            : `متابعة COD — ${formatPrice(total)}`}
          <span aria-hidden className="text-lg">
            ←
          </span>
        </button>
        <p className="mt-3 text-center text-[11px] text-velora-burgundy/50">
          {method === "card"
            ? "سيتم إرسال رابط الدفع الآمن بعد تأكيد الطلب (واتساب / SMS)."
            : `رسوم التوصيل ${codFee} ${currencyLabel} — تُضاف للمجموع.`}
        </p>
      </div>
    </CheckoutFunnelShell>
  );
}
