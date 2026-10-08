"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  buildCheckoutPath,
  buildCheckoutPaymentStepPath,
} from "@/lib/checkoutRoutes";
import { getAllProductsWithPages, getProductPath } from "@/lib/productCatalog";

type Props = {
  productName: string;
  productImageSrc?: string;
  productSlug?: string;
  quantity: BundleQuantity;
  paymentMethod: PaymentMethod;
  totalLabel?: string;
  footer?: ReactNode;
  showTrust?: boolean;
  /** Quantity +/- and upsell links (checkout card/COD). */
  editableBasket?: boolean;
};

export function CheckoutSummarySidebar({
  productName,
  productImageSrc,
  productSlug,
  quantity,
  paymentMethod,
  totalLabel = "الإجمالي",
  footer,
  showTrust = false,
  editableBasket = false,
}: Props) {
  const router = useRouter();
  const subtotal = cardBundlePrices[quantity];
  const deliveryFee = paymentMethod === "cod" ? codFee : 0;
  const total = getCheckoutTotal(quantity, paymentMethod);

  const upsellProducts =
    editableBasket && productSlug
      ? getAllProductsWithPages().filter((p) => p.slug !== productSlug)
      : [];

  function setQuantity(next: BundleQuantity) {
    if (!productSlug || next === quantity) return;
    router.push(buildCheckoutPath(paymentMethod, { product: productSlug, quantity: next }));
  }

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
          {editableBasket && productSlug ? (
            <div className="flex shrink-0 flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-neutral-400">الكمية</span>
              <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
                <button
                  type="button"
                  aria-label="نقصان الكمية"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((quantity - 1) as BundleQuantity)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-lg font-bold text-neutral-700 disabled:opacity-30"
                >
                  −
                </button>
                <span className="min-w-[1.25rem] text-center text-sm font-extrabold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="زيادة الكمية"
                  disabled={quantity >= 3}
                  onClick={() => setQuantity((quantity + 1) as BundleQuantity)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-lg font-bold text-neutral-700 disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div className="flex shrink-0 flex-col items-center justify-center rounded-md border border-neutral-200 px-2 py-1">
              <span className="text-[10px] font-bold text-neutral-400">الكمية</span>
              <span className="text-sm font-extrabold text-neutral-900">{quantity}</span>
            </div>
          )}
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

        {editableBasket && productSlug ? (
          <nav className="mt-4 space-y-2 border-t border-neutral-100 pt-4 text-sm" aria-label="تعديل الطلب">
            <Link
              href={buildCheckoutPaymentStepPath({ product: productSlug, quantity })}
              className="block font-semibold text-[#134E3A] underline-offset-2 hover:underline"
            >
              ← تغيير طريقة الدفع (بطاقة / COD)
            </Link>
            <Link
              href={`${getProductPath(productSlug)}#purchase`}
              className="block font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
            >
              ← العودة إلى صفحة المنتج
            </Link>
          </nav>
        ) : null}

        {upsellProducts.length > 0 ? (
          <div className="mt-4 border-t border-neutral-100 pt-4">
            <p className="text-xs font-extrabold text-neutral-800">أكملي روتين VELORA</p>
            <ul className="mt-2 space-y-2">
              {upsellProducts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={buildCheckoutPaymentStepPath({ product: p.slug, quantity: 2 })}
                    className="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/80 p-2 transition hover:border-[#134E3A]/30 hover:bg-white"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white">
                      {p.image.src ? (
                        <Image
                          src={p.image.src}
                          alt=""
                          fill
                          className="object-contain p-0.5"
                          sizes="40px"
                        />
                      ) : null}
                    </div>
                    <span className="min-w-0 flex-1 text-right text-[11px] font-bold leading-snug text-neutral-800">
                      {p.name}
                    </span>
                    <span className="shrink-0 text-[10px] font-extrabold text-[#134E3A]">+ أضيفي</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {footer ? <div className="mt-4">{footer}</div> : null}
      </aside>

      {showTrust ? <CheckoutTrustCard /> : null}
    </div>
  );
}
