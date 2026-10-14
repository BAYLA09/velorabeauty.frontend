"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { CheckoutTrustCard } from "@/components/checkout/CheckoutTrustCard";
import { CheckoutUpsellPanel } from "@/components/checkout/CheckoutUpsellPanel";
import { encodeCartItemsParam } from "@/lib/cart/cartSerialization";
import { validateCartForCheckout } from "@/lib/cart/validateCartCheckout";
import {
  cardBundlePrices,
  codFee,
  currencyLabel,
  formatPrice,
  getCheckoutTotal,
  getCheckoutTotalForUnits,
  getMerchandiseAedForUnits,
  type BundleQuantity,
  type PaymentMethod,
} from "@/config/pricing";
import {
  allocateCartLinePrices,
  bundleOfferLabel,
  getCheckoutProductImage,
} from "@/lib/checkoutProductMeta";
import {
  buildCheckoutPath,
  buildCheckoutPaymentStepPath,
} from "@/lib/checkoutRoutes";
import {
  addComplementaryLine,
  parseCheckoutLines,
  setCheckoutLineQuantity,
} from "@/lib/checkoutUpsell";
import { countEligibleUnits } from "@/lib/cart/cartPricing";
import { MAX_CART_UNITS } from "@/lib/cart/cartTypes";
import { getProductBySlug, getProductPath } from "@/lib/productCatalog";

type Props = {
  productName: string;
  productImageSrc?: string;
  productSlug?: string;
  quantity: BundleQuantity;
  paymentMethod: PaymentMethod;
  totalLabel?: string;
  footer?: ReactNode;
  showTrust?: boolean;
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
  const searchParams = useSearchParams();
  const cartItemsParam = searchParams.get("items") ?? undefined;
  const lines =
    productSlug && editableBasket
      ? parseCheckoutLines(cartItemsParam, productSlug, quantity)
      : [];
  const mixedCart = Boolean(cartItemsParam?.trim());
  const validated = mixedCart ? validateCartForCheckout(lines) : null;
  const bundleQty = validated?.ok ? validated.cart.bundleQuantity : quantity;

  const totalUnits = countEligibleUnits(lines);
  const subtotal =
    validated?.ok && mixedCart
      ? validated.cart.merchandiseAed
      : mixedCart && totalUnits > 0
        ? getMerchandiseAedForUnits(totalUnits) ?? cardBundlePrices[bundleQty]
        : cardBundlePrices[bundleQty];
  const linePrices = allocateCartLinePrices(lines, subtotal);
  const singleLineBasket = lines.length === 1 && !mixedCart;
  const deliveryFee = paymentMethod === "cod" ? codFee : 0;
  const total =
    totalUnits > 0
      ? (getCheckoutTotalForUnits(totalUnits, paymentMethod) ?? getCheckoutTotal(bundleQty, paymentMethod))
      : getCheckoutTotal(bundleQty, paymentMethod);

  function checkoutQueryFromLines(nextLines: typeof lines, bundleQuantity: BundleQuantity) {
    const v = validateCartForCheckout(nextLines);
    if (!v.ok || !productSlug) return null;
    const items = encodeCartItemsParam(nextLines);
    return {
      product: v.cart.productSlug,
      quantity: bundleQuantity,
      items,
    };
  }

  function setBundleQuantity(next: BundleQuantity) {
    if (!productSlug || next === quantity || mixedCart) return;
    router.push(buildCheckoutPath(paymentMethod, { product: productSlug, quantity: next }));
  }

  function adjustLineQuantity(slug: string, delta: number) {
    if (!productSlug || !editableBasket) return;
    const line = lines.find((l) => l.slug === slug);
    if (!line) return;
    const nextQty = line.quantity + delta;

    if (singleLineBasket && !mixedCart) {
      if (nextQty < 1 || nextQty > MAX_CART_UNITS) return;
      setBundleQuantity(nextQty as BundleQuantity);
      return;
    }

    const result = setCheckoutLineQuantity(lines, slug, nextQty);
    if (!result.ok) return;
    const query = checkoutQueryFromLines(result.lines, result.bundleQuantity);
    if (!query) return;
    router.push(buildCheckoutPath(paymentMethod, query));
  }

  function addUpsell(addSlug: string) {
    if (!productSlug) return;
    const result = addComplementaryLine(lines, addSlug);
    if (!result.ok) return;
    const query = checkoutQueryFromLines(result.lines, result.bundleQuantity);
    if (!query) return;
    router.push(buildCheckoutPath(paymentMethod, query));
  }

  return (
    <div className="space-y-4 lg:sticky lg:top-28">
      <aside className="h-fit rounded-xl border border-[#d9d9d9] bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-extrabold text-neutral-900">ملخص الطلب</h2>

        {productSlug && lines.length > 0 ? (
          <ul className="mt-4 space-y-3 border-b border-neutral-100 pb-4">
            {lines.map((line) => {
              const product = getProductBySlug(line.slug);
              const imageSrc =
                getCheckoutProductImage(line.slug) ??
                product?.pageImage.upsellSlotSrc?.[1] ??
                productImageSrc;
              const lineTotal = linePrices.get(line.slug) ?? subtotal;
              return (
                <li key={line.slug} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-neutral-100">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={product?.image.placeholder ?? ""}
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
                    <p className="text-sm font-bold leading-snug text-neutral-900">
                      {product?.name ?? line.slug}
                    </p>
                    {product?.ingredient ? (
                      <p className="mt-0.5 text-xs text-neutral-500">{product.ingredient}</p>
                    ) : null}
                    {!mixedCart && lines.length === 1 ? (
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        {bundleOfferLabel(bundleQty)}
                      </p>
                    ) : null}
                    <p className="mt-2 text-sm font-extrabold tabular-nums text-neutral-900">
                      {formatPrice(lineTotal)}
                    </p>
                  </div>
                  {editableBasket ? (
                    <div className="flex shrink-0 flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-neutral-400">الكمية</span>
                      <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
                        <button
                          type="button"
                          aria-label={`نقصان — ${product?.name ?? line.slug}`}
                          disabled={
                            line.quantity <= 1 &&
                            (lines.length <= 1 || totalUnits <= 1)
                          }
                          onClick={() => adjustLineQuantity(line.slug, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-lg font-bold text-neutral-700 transition hover:bg-white disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="min-w-[1.25rem] text-center text-sm font-extrabold tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`زيادة — ${product?.name ?? line.slug}`}
                          disabled={totalUnits >= MAX_CART_UNITS}
                          onClick={() => adjustLineQuantity(line.slug, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-lg font-bold text-neutral-700 transition hover:bg-white disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex shrink-0 flex-col items-center justify-center rounded-md border border-neutral-200 px-2 py-1">
                      <span className="text-[10px] font-bold text-neutral-400">الكمية</span>
                      <span className="text-sm font-extrabold tabular-nums text-neutral-900">
                        {line.quantity}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}

        {editableBasket && productSlug && lines.length > 0 ? (
          <CheckoutUpsellPanel
            lines={lines}
            eligibleUnits={totalUnits}
            merchandiseAed={subtotal}
            paymentMethod={paymentMethod}
            onAdd={addUpsell}
          />
        ) : null}

        {!(productSlug && lines.length > 0) ? (
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
              ) : null}
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="text-sm font-bold text-neutral-900">{productName}</p>
              <p className="mt-2 text-sm font-extrabold tabular-nums text-neutral-900">
                {formatPrice(subtotal)}
              </p>
            </div>
          </div>
        ) : null}

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
              href={buildCheckoutPaymentStepPath(
                { product: productSlug, quantity: bundleQty, items: cartItemsParam },
                paymentMethod,
              )}
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

        {footer ? <div className="mt-4">{footer}</div> : null}
      </aside>

      {showTrust ? <CheckoutTrustCard /> : null}
    </div>
  );
}
