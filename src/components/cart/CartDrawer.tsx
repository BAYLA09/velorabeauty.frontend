"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { codFee, formatPrice } from "@/config/pricing";
import { useCart } from "@/context/CartProvider";
import {
  computeCartPricing,
  targetBundleTotalAfterUpsell,
} from "@/lib/cart/cartPricing";
import { buildMixedCartSummary } from "@/lib/cart/cartCheckoutMeta";
import { encodeCartItemsParam } from "@/lib/cart/cartSerialization";
import { normalizeCartLines } from "@/lib/cart/cartPricing";
import { prefetchStripeCardCheckout } from "@/lib/stripeCheckoutPrefetch";
import { CartUpsellSection } from "@/components/cart/CartUpsellSection";
import { buildCartCheckoutPath } from "@/lib/checkoutRoutes";
import { getProductBySlug } from "@/lib/productCatalog";
import { cartDrawerCopy as t } from "@/components/cart/cartDrawerCopy";
import { ShoppingBagIcon } from "@/components/ui/ShoppingBagIcon";

function QuantityStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center rounded-full border border-[#650D20]/15 bg-[#FFF9F5] p-0.5">
      <button
        type="button"
        aria-label={`${label} — نقصان`}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#650D20] transition hover:bg-[#FCE8E5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AD65]"
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span className="min-w-[2rem] text-center text-sm font-bold tabular-nums text-[#291A1C]">
        {value}
      </span>
      <button
        type="button"
        aria-label={`${label} — زيادة`}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#650D20] transition hover:bg-[#FCE8E5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AD65]"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}

export function CartDrawer() {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    lines,
    open,
    closeCart,
    eligibleUnits,
    ui,
    setLineQuantity,
    removeLine,
    addItem,
  } = useCart();

  const pricing = computeCartPricing(lines, null);
  const canCheckout = pricing.ok;
  const itemCount = eligibleUnits;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeCart]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-[#291A1C]/45 backdrop-blur-[2px] motion-reduce:transition-none"
        aria-label={t.close}
        onClick={closeCart}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex h-full w-full max-w-md flex-col bg-[#FFF9F5] shadow-[-8px_0_40px_rgba(41,26,28,0.18)] motion-safe:animate-[cartSlideIn_0.32s_ease-out] max-sm:max-w-none"
      >
        <header className="flex items-center justify-between border-b border-[#650D20]/10 px-5 py-4">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 rounded-full bg-[#FCE8E5] p-2 text-[#650D20]">
              <ShoppingBagIcon className="h-5 w-5" />
            </span>
            <div>
            <h2 id={titleId} className="text-xl font-bold tracking-tight text-[#650D20]">
              {t.title}
            </h2>
            <p className="mt-0.5 text-sm text-[#291A1C]/65">
              {itemCount === 0 ? t.none : t.productCount(itemCount)}
            </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 text-[#650D20] transition hover:bg-[#FCE8E5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6AD65]"
            aria-label={t.closeBtn}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" stroke="currentColor" fill="none" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {ui.status === "error" && ui.message ? (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
              {ui.message}
            </p>
          ) : null}
          {ui.status === "success" && ui.message ? (
            <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 motion-safe:animate-[fadeIn_0.25s_ease]">
              {ui.message}
            </p>
          ) : null}

          {lines.length === 0 ? (
            <div className="pb-2 pt-2">
              <p className="text-center text-base font-extrabold text-[#291A1C]">{t.empty}</p>
              <p className="mt-2 text-center text-sm text-[#291A1C]/60">{t.pricingHint}</p>
              <CartUpsellSection
                lines={lines}
                eligibleUnits={eligibleUnits}
                onAdd={(slug) => addItem(slug, 1)}
              />
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => {
                const product = getProductBySlug(line.slug);
                if (!product) return null;
                return (
                  <li
                    key={line.slug}
                    className="flex gap-3 rounded-2xl border border-[#650D20]/10 bg-white p-3 shadow-sm"
                  >
                    <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-[#FCE8E5]">
                      <Image
                        src={product.image.src}
                        alt={product.image.placeholder}
                        fill
                        className="object-contain p-1"
                        sizes="72px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold leading-snug text-[#291A1C]">{product.name}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-[#291A1C]/55">
                        {product.ingredient}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <QuantityStepper
                          label={product.name}
                          value={line.quantity}
                          onChange={(n) => setLineQuantity(line.slug, n)}
                        />
                        <button
                          type="button"
                          onClick={() => removeLine(line.slug)}
                          className="text-xs font-semibold text-[#650D20]/70 underline-offset-2 hover:text-[#650D20] hover:underline"
                        >
                          {t.remove}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {lines.length === 1 && lines[0]?.quantity === 3 ? (
            <p className="mt-6 rounded-2xl border border-[#D6AD65]/40 bg-[#FCE8E5]/80 px-4 py-3 text-sm leading-relaxed text-[#291A1C]">
              {t.bundleComplete(formatPrice(339))}
            </p>
          ) : null}
          {lines.length > 0 && eligibleUnits === 4 ? (
            <p className="mt-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm leading-relaxed text-emerald-950">
              {t.cartFull(formatPrice(pricing.ok ? pricing.merchandiseAed : 538))}
            </p>
          ) : null}

          {lines.length > 0 ? (
            <CartUpsellSection
              lines={lines}
              eligibleUnits={eligibleUnits}
              onAdd={(slug) => addItem(slug, 1)}
            />
          ) : null}
        </div>

        {lines.length > 0 ? (
          <footer className="border-t border-[#650D20]/10 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {pricing.ok ? (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#291A1C]/70">{t.subtotal(pricing.eligibleUnits)}</dt>
                  <dd className="font-bold tabular-nums text-[#291A1C]">
                    {formatPrice(pricing.merchandiseAed)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#291A1C]/70">{t.shipping}</dt>
                  <dd className="text-xs text-[#291A1C]/60">
                    {t.shippingHint(formatPrice(0), formatPrice(codFee))}
                  </dd>
                </div>
                {eligibleUnits < 3 && targetBundleTotalAfterUpsell(eligibleUnits) ? (
                  <p className="text-[11px] leading-relaxed text-[#650D20]/80">
                    {t.bundleNote}
                  </p>
                ) : null}
              </dl>
            ) : (
              <p className="text-sm text-red-800">
                {pricing.reason === "too_many_units"
                  ? t.maxProducts
                  : t.invalid}
              </p>
            )}

            {canCheckout ? (
              <Link
                href={buildCartCheckoutPath(encodeCartItemsParam(lines))}
                onClick={closeCart}
                onMouseEnter={() => {
                  if (!pricing.ok) return;
                  const itemsParam = encodeCartItemsParam(lines);
                  const meta = buildMixedCartSummary(normalizeCartLines(lines));
                  void prefetchStripeCardCheckout({
                    productSlug: meta.productSlug,
                    productName: meta.productName,
                    quantity: pricing.bundleQuantity,
                    eligibleUnits: pricing.eligibleUnits,
                    itemsParam,
                  });
                }}
                onFocus={() => {
                  if (!pricing.ok) return;
                  const itemsParam = encodeCartItemsParam(lines);
                  const meta = buildMixedCartSummary(normalizeCartLines(lines));
                  void prefetchStripeCardCheckout({
                    productSlug: meta.productSlug,
                    productName: meta.productName,
                    quantity: pricing.bundleQuantity,
                    eligibleUnits: pricing.eligibleUnits,
                    itemsParam,
                  });
                }}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-[#650D20] py-3.5 text-base font-bold text-[#FFF9F5] shadow-[0_8px_24px_rgba(101,13,32,0.35)] transition hover:bg-[#291A1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AD65]"
              >
                {t.checkout}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-4 w-full cursor-not-allowed rounded-full bg-[#291A1C]/20 py-3.5 text-base font-bold text-[#291A1C]/50"
              >
                {t.checkout}
              </button>
            )}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
