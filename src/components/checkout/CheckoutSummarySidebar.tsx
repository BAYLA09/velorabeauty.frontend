import Image from "next/image";
import type { ReactNode } from "react";
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
};

export function CheckoutSummarySidebar({
  productName,
  productImageSrc,
  quantity,
  paymentMethod,
  totalLabel = "الإجمالي",
  footer,
}: Props) {
  const subtotal = cardBundlePrices[quantity];
  const deliveryFee = paymentMethod === "cod" ? codFee : 0;
  const total = getCheckoutTotal(quantity, paymentMethod);

  return (
    <aside className="h-fit rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-28">
      <h2 className="text-base font-semibold text-neutral-900">ملخص الطلب</h2>

      <div className="mt-4 flex gap-3 border-b border-velora-burgundy/8 pb-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-velora-cream-dark">
          {productImageSrc ? (
            <Image
              src={productImageSrc}
              alt=""
              fill
              className="object-contain p-1"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] font-bold text-velora-burgundy/35">
              VELORA
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 text-right">
          <p className="text-sm font-bold leading-snug text-velora-burgundy-dark">{productName}</p>
          <p className="mt-1 text-xs text-velora-burgundy/55">{bundleOfferLabel(quantity)}</p>
          <p className="mt-2 text-sm font-black tabular-nums text-velora-burgundy">
            {formatPrice(subtotal)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center justify-center rounded-lg border border-velora-burgundy/10 px-2 py-1">
          <span className="text-[10px] font-bold text-velora-burgundy/45">الكمية</span>
          <span className="text-sm font-black text-velora-burgundy-dark">{quantity}</span>
        </div>
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-velora-burgundy/60">المجموع الفرعي</dt>
          <dd className="font-semibold tabular-nums text-velora-burgundy">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-velora-burgundy/60">التوصيل</dt>
          <dd
            className={`font-semibold tabular-nums ${deliveryFee > 0 ? "text-velora-burgundy" : "text-emerald-700"}`}
          >
            {deliveryFee > 0 ? formatPrice(deliveryFee) : "مجاني"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-end justify-between border-t border-velora-burgundy/10 pt-4">
        <span className="text-sm font-bold text-velora-burgundy/65">{totalLabel}</span>
        <span className="text-2xl font-black tabular-nums text-velora-burgundy-dark">
          {formatPrice(total)}
        </span>
      </div>

      {paymentMethod === "cod" && (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-center text-[11px] font-bold text-amber-900/80">
          +{codFee} {currencyLabel} رسوم التوصيل (COD)
        </p>
      )}

      {footer ? <div className="mt-4">{footer}</div> : null}
    </aside>
  );
}
