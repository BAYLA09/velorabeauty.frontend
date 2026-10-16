"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CheckoutBackActions } from "@/components/checkout/CheckoutBackActions";
import { CheckoutFunnelShell } from "@/components/checkout/CheckoutFunnelShell";
import { IconBanknote, IconCard } from "@/components/product/ProductFunnelIcons";
import {
  codFee,
  currencyLabel,
  formatPrice,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import { useStripeCheckoutPrefetch } from "@/components/checkout/useStripeCheckoutPrefetch";
import { buildCheckoutPath } from "@/lib/checkoutRoutes";
import { resolveCheckoutTotalAed } from "@/lib/checkoutTotals";
import { trackSnapStartCheckout } from "@/lib/analytics/trackSnapCommerce";
import { parseCheckoutLines } from "@/lib/checkoutUpsell";

type Props = {
  productSlug: string;
  productName: string;
  quantity: BundleQuantity;
  eligibleUnits: number;
  cartItemsParam?: string;
  initialMethod?: PaymentMethod;
};

function PaymentOption({
  selected,
  onSelect,
  title,
  subtitle,
  detail,
  badge,
  icon,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  detail?: string;
  badge?: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border bg-white p-4 text-right transition sm:p-5 ${
        selected
          ? "border-[#1773b0] shadow-[0_0_0_1px_#1773b0]"
          : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      {badge ? (
        <div className="mb-3 flex justify-end">
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            {badge}
          </span>
        </div>
      ) : null}
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[6px] ${
            selected ? "border-[#1773b0] bg-white" : "border-neutral-300 bg-white"
          }`}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center justify-end gap-2 text-base font-semibold text-neutral-900">
            {icon}
            {title}
          </p>
          <p className="mt-1 text-sm font-medium text-emerald-800">{subtitle}</p>
          {detail ? <p className="mt-1 text-xs text-neutral-500">{detail}</p> : null}
        </div>
      </div>
    </button>
  );
}

export function CheckoutPaymentStepClient({
  productSlug,
  productName,
  quantity,
  eligibleUnits,
  cartItemsParam,
  initialMethod = "card",
}: Props) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>(initialMethod);
  const query = useMemo(
    () => ({ product: productSlug, quantity, items: cartItemsParam }),
    [productSlug, quantity, cartItemsParam],
  );
  const cartLines = parseCheckoutLines(cartItemsParam, productSlug, quantity);
  const total = resolveCheckoutTotalAed(
    quantity,
    method,
    eligibleUnits,
    cartItemsParam ? cartLines : undefined,
    productSlug,
  );
  useStripeCheckoutPrefetch({
    productSlug,
    productName,
    quantity,
    eligibleUnits,
    itemsParam: cartItemsParam,
  });

  useEffect(() => {
    router.prefetch(buildCheckoutPath("card", query));
  }, [router, query]);

  function continueCheckout() {
    trackSnapStartCheckout({
      productSlug,
      quantity,
      valueAed: total,
      cartLines: cartItemsParam ? cartLines : undefined,
    });
    router.push(buildCheckoutPath(method, query));
  }

  return (
    <CheckoutFunnelShell currentStep={2} maxWidth="md">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
          <CheckoutBackActions
            productSlug={productSlug}
            quantity={quantity}
            cartItemsParam={cartItemsParam}
            backTo="product"
            className="mb-6"
          />

          <header className="border-b border-neutral-100 pb-5 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.65rem]">
              طريقة الدفع
            </h1>
            <p className="mt-2 text-sm text-neutral-500">جميع المعاملات آمنة ومشفّرة</p>
            <p className="mt-1 text-xs font-medium text-neutral-400">{productName}</p>
          </header>

          <div className="mt-6 space-y-3">
            <PaymentOption
              selected={method === "card"}
              onSelect={() => setMethod("card")}
              badge="الأكثر اختياراً"
              title="الدفع بالبطاقة"
              subtitle="شحن مجاني"
              detail="Visa · Mastercard · Apple Pay · Google Pay"
              icon={<IconCard className="h-5 w-5 text-neutral-600" />}
            />
            <PaymentOption
              selected={method === "cod"}
              onSelect={() => setMethod("cod")}
              title="الدفع عند الاستلام"
              subtitle={`+${codFee} ${currencyLabel} رسوم التوصيل`}
              detail="تدفعين نقداً عند استلام الطلب"
              icon={<IconBanknote className="h-5 w-5 text-neutral-600" />}
            />
          </div>

          <button
            type="button"
            onClick={continueCheckout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-4 text-base font-bold text-white shadow-sm transition hover:bg-neutral-800"
          >
            {method === "card"
              ? `متابعة — ${formatPrice(total)}`
              : `متابعة COD — ${formatPrice(total)}`}
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-neutral-500">
            {method === "card"
              ? "الخطوة التالية: معلومات التوصيل ثم رابط الدفع الآمن."
              : `رسوم التوصيل ${codFee} ${currencyLabel} مضافة للمجموع.`}
          </p>
        </div>
      </div>
    </CheckoutFunnelShell>
  );
}
