import Image from "next/image";
import type { ReactNode } from "react";
import { CheckoutTrustCard } from "@/components/checkout/CheckoutTrustCard";
import {
  cardBundlePrices,
  codFee,
  currencyLabel,
  formatPrice,
  getCheckoutTotal,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import { bundleOfferLabel } from "@/lib/checkoutProductMeta";

type Props = {
  productName: string;
  productImageSrc?: string;
  quantity: BundleQuantity;
  paymentMethod: PaymentMethod;
  totalLabel?: string;
  footer?: ReactNode;
  showTrust?: boolean;
};

export function CheckoutSummarySidebar({
  productName,
  productImageSrc,
  quantity,
  paymentMethod,
  totalLabel = "الإجمالي",
  footer,
  showTrust = false,
}: Props) {
  const subtotal = cardBundlePrices[quantity];
  const deliveryFee = paymentMethod === "cod" ? codFee : 0;
  const total = getCheckoutTotal(quantity, paymentMethod);

  return (
    <div className="space-y-4 lg:sticky lg:top-28">
      <aside className="h-fit rounded-xl border border-[#d9d9d9] bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-extrabold text-neutral-900">ملخص الطلب</h2>

        <div className="mt-4 flex gap-3 border-b border-neutral-100 pb-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
            {productImageSrc ? (
              <Image
                src={productImageSrc}
                alt=""
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] font-bold text-neutral-300">
                VELORA
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 text-right">
            <p className="text-sm font-bold leading-snug text-neutral-900">{productName}</p>
            <p className="mt-1 text-xs text-neutral-500">{bundleOfferLabel(quantity)}</p>
            <p className="mt-2 text-sm font-extrabold tabular-nums text-neutral-900">
              {formatPrice(subtotal)}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center justify-center rounded-md border border-neutral-200 px-2 py-1">
            <span className="text-[10px] font-bold text-neutral-400">الكمية</span>
            <span className="text-sm font-extrabold text-neutral-900">{quantity}</span>
          </div>
        </div>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">المجموع الفرعي</dt>
            <dd className="font-semibold tabular-nums text-neutral-900">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">التوصيل</dt>
            <dd
              className={`font-semibold tabular-nums ${deliveryFee > 0 ? "text-neutral-900" : "text-emerald-700"}`}
            >
              {deliveryFee > 0 ? formatPrice(deliveryFee) : "مجاني"}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-end justify-between border-t border-neutral-100 pt-4">
          <span className="text-sm font-bold text-neutral-600">{totalLabel}</span>
          <span className="text-2xl font-extrabold tabular-nums text-neutral-900">
            {formatPrice(total)}
          </span>
        </div>

        {paymentMethod === "cod" && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-[11px] font-bold text-amber-900/80">
            +{codFee} {currencyLabel} رسوم التوصيل (COD)
          </p>
        )}

        {footer ? <div className="mt-4">{footer}</div> : null}
      </aside>

      {showTrust ? <CheckoutTrustCard /> : null}
    </div>
  );
}
