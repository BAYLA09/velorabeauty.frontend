"use client";

import Link from "next/link";
import { ProductAnnouncementBar } from "@/components/product/ProductAnnouncementBar";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { ProductTrustBar } from "@/components/product/ProductTrustBar";
import { FooterSection } from "@/components/FooterSection";
import { formatPrice } from "@/config/pricing";
import {
  STRIPE_TEST_PRICE_AED,
  STRIPE_TEST_PRODUCT_HEADLINE,
  STRIPE_TEST_PRODUCT_NAME,
  STRIPE_TEST_PRODUCT_NUMBER,
  STRIPE_TEST_PRODUCT_SUBHOOK,
  STRIPE_TEST_USD_HINT,
} from "@/config/stripeTestCheckout";

type Props = {
  cardCheckoutHref: string;
  checkoutEnabled: boolean;
};

const faq = [
  {
    q: "شنو هو منتج 04؟",
    a: "صفحة دفع إلكتروني (بطاقة فقط) بسعر 20 د.إ — للتأكد من تجربة الدفع الآمنة على فيلورا.",
  },
  {
    q: "واش كاين دفع عند الاستلام؟",
    a: "لا — هاد المنتج بالبطاقة فقط (Visa / Mastercard / Apple Pay حسب البطاقة).",
  },
  {
    q: "من بعد الدفع شنو كيوقع؟",
    a: "تصلك صفحة تأكيد الطلب + تسجيل الطلب في نظام فيلورا (وGoogle Sheet للبطاقة إذا متفعّل).",
  },
];

function CardHeroVisual() {
  return (
    <div
      className="relative mx-auto flex aspect-[4/5] w-full max-w-sm items-center justify-center overflow-hidden rounded-[2rem] border-8 border-white bg-gradient-to-br from-velora-burgundy via-velora-burgundy-dark to-[#1a0a0e] p-8 shadow-2xl"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
      <div className="relative w-full max-w-[17rem] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-5 shadow-[0_24px_48px_rgba(0,0,0,0.35)] ring-1 ring-white/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Velora</span>
          <span className="rounded-full bg-emerald-600/15 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
            Secure
          </span>
        </div>
        <div className="mt-6 h-9 w-11 rounded-md bg-gradient-to-br from-amber-300 to-amber-500" />
        <p className="mt-8 font-mono text-lg tracking-[0.2em] text-slate-700">•••• •••• •••• ••••</p>
        <p className="mt-2 text-right text-xs font-semibold text-slate-600">{formatPrice(STRIPE_TEST_PRICE_AED)}</p>
      </div>
      <p className="absolute bottom-6 text-center text-[11px] font-medium text-velora-cream/70">
        الدفع الإلكتروني · Stripe
      </p>
    </div>
  );
}

export function ElectronicProduct04Page({ cardCheckoutHref, checkoutEnabled }: Props) {
  const ctaLabel = `ادفعي ${formatPrice(STRIPE_TEST_PRICE_AED)} بالبطاقة`;

  return (
    <>
      <ProductAnnouncementBar />
      <ProductStoreHeader />

      <main className="product-typography bg-velora-cream pb-28 lg:pb-12">
        <div className="mx-auto max-w-lg px-4 py-4 sm:max-w-6xl sm:px-6 sm:py-8 lg:max-w-7xl">
          {!checkoutEnabled ? (
            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-right text-sm text-amber-950">
              الدفع غير مفعّل على السيرفر — Easypanel:{" "}
              <code className="text-xs" dir="ltr">
                STRIPE_TEST_CHECKOUT_ENABLED=true
              </code>{" "}
              ثم Deploy.
            </div>
          ) : null}

          <section id="purchase" className="scroll-mt-24">
            <header className="mb-5 text-right lg:mb-8">
              <p className="text-xs font-bold tracking-[0.18em] text-velora-burgundy/55">
                منتج {STRIPE_TEST_PRODUCT_NUMBER} · غير معروض في الرئيسية
              </p>
              <h1 className="mt-2 text-[1.35rem] font-black leading-[1.35] text-velora-burgundy-dark sm:text-[1.85rem] lg:text-[2.1rem]">
                {STRIPE_TEST_PRODUCT_HEADLINE}
              </h1>
              <p className="mt-3 text-[15px] font-medium leading-[1.85] text-velora-burgundy/85 sm:text-base">
                {STRIPE_TEST_PRODUCT_SUBHOOK}
              </p>
            </header>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <div className="shrink-0 lg:w-[min(100%,380px)]">
                <CardHeroVisual />
              </div>

              <div className="min-w-0 flex-1 space-y-5">
                <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_12px_40px_rgba(58,24,32,0.08)] ring-1 ring-velora-burgundy/10 sm:p-6">
                  <p className="text-right text-sm font-semibold text-velora-burgundy/70">{STRIPE_TEST_PRODUCT_NAME}</p>
                  <p className="mt-2 text-right">
                    <span className="font-display text-3xl font-black tabular-nums text-velora-burgundy-dark">
                      {formatPrice(STRIPE_TEST_PRICE_AED)}
                    </span>
                    <span className="mr-2 text-sm text-velora-burgundy/55">· {STRIPE_TEST_USD_HINT}</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-right text-sm text-velora-burgundy/75">
                    <li>✓ دفع إلكتروني آمن (Stripe Live)</li>
                    <li>✓ تأكيد فوري على البطاقة</li>
                    <li>✓ توصيل داخل الإمارات — نفس تجربة فيلورا</li>
                  </ul>

                  {checkoutEnabled ? (
                    <Link
                      href={cardCheckoutHref}
                      className="mt-6 flex w-full items-center justify-center rounded-full bg-emerald-700 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
                    >
                      {ctaLabel}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-6 flex w-full cursor-not-allowed items-center justify-center rounded-full bg-neutral-300 py-4 text-base font-bold text-neutral-500"
                    >
                      {ctaLabel}
                    </button>
                  )}

                  <p className="mt-3 text-center text-[11px] text-velora-burgundy/45">
                    بطاقة حقيقية فقط — ما تستعمليش 4242… على Live.
                  </p>
                </div>

                <ProductTrustBar prominent />
              </div>
            </div>
          </section>

          <section className="mt-12 rounded-[1.5rem] bg-white/80 p-6 ring-1 ring-velora-burgundy/8 sm:p-8">
            <h2 className="text-right text-lg font-black text-velora-burgundy-dark">أسئلة شائعة</h2>
            <dl className="mt-5 space-y-4 text-right">
              {faq.map((item) => (
                <div key={item.q}>
                  <dt className="font-bold text-velora-burgundy">{item.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-velora-burgundy/75">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-velora-burgundy/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-xs font-semibold text-velora-burgundy/70">{STRIPE_TEST_PRODUCT_NAME}</p>
            <p className="font-display text-lg font-black text-velora-burgundy-dark">{formatPrice(STRIPE_TEST_PRICE_AED)}</p>
          </div>
          {checkoutEnabled ? (
            <Link
              href={cardCheckoutHref}
              className="shrink-0 rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white"
            >
              ادفعي بالبطاقة
            </Link>
          ) : (
            <span className="shrink-0 rounded-full bg-neutral-200 px-5 py-3 text-sm font-bold text-neutral-500">
              قريباً
            </span>
          )}
        </div>
      </div>

      <FooterSection />
    </>
  );
}
