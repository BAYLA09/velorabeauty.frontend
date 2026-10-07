import Link from "next/link";
import {
  cardBundlePrices,
  codBundlePrices,
  codFee,
  currencyLabel,
  formatPrice,
  type BundleQuantity,
} from "@/config/pricing";
import { getProductPath } from "@/lib/productCatalog";
import { orderPayHref, quantityLabels } from "@/lib/orderIntent";

type Props = {
  productSlug?: string;
  productName: string;
  quantity: BundleQuantity;
};

export function PaymentChoice({ productSlug, productName, quantity }: Props) {
  const cardTotal = cardBundlePrices[quantity];
  const codTotal = codBundlePrices[quantity];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-bold tracking-[0.42em] text-velora-champagne-dark">VELORA</p>
        <div className="mx-auto mt-5 h-px w-16 bg-velora-champagne" />
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-velora-burgundy-dark sm:text-6xl">
          كيف تحبّين الدفع؟
        </h1>
        <p className="mt-5 text-base leading-relaxed text-velora-burgundy/75 sm:text-lg">
          {productName}
          <span className="mx-2 text-velora-champagne-dark">·</span>
          {quantityLabels[quantity]}
        </p>
        <p className="mt-3 text-sm text-velora-burgundy/60">
          البطاقة بشحن مجاني. الدفع عند الاستلام يزيد {codFee} {currencyLabel} رسوم توصيل.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Link
          href={orderPayHref("card", productSlug, quantity)}
          className="group relative flex min-h-[28rem] flex-col overflow-hidden rounded-[2rem] bg-velora-burgundy-dark p-8 text-velora-cream shadow-[0_30px_80px_-40px_rgba(58,24,32,0.7)] transition duration-500 hover:-translate-y-1.5 sm:p-10"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-velora-champagne to-transparent" />
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-[0.32em] text-velora-champagne">01</p>
            <CardMark />
          </div>
          <h2 className="mt-10 font-display text-4xl font-bold leading-none">البطاقة</h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-velora-cream/75">
            صفحة خاصة للدفع بالبطاقة. بعد تأكيد العنوان يصلك رابط دفع، والشحن داخل الإمارات مجاني.
          </p>
          <div className="mt-auto pt-12">
            <p className="text-[11px] tracking-[0.22em] text-velora-cream/50">المجموع</p>
            <p className="mt-2 font-display text-5xl font-bold tabular-nums">{formatPrice(cardTotal)}</p>
            <p className="mt-3 text-sm font-semibold text-velora-champagne-light">شحن مجاني · 0 {currencyLabel}</p>
            <span className="mt-8 inline-flex items-center gap-3 text-sm font-bold">
              ادخلي صفحة البطاقة
              <span aria-hidden className="transition group-hover:-translate-x-1">←</span>
            </span>
          </div>
        </Link>

        <Link
          href={orderPayHref("cod", productSlug, quantity)}
          className="group relative flex min-h-[28rem] flex-col rounded-[2rem] border border-velora-champagne/60 bg-white p-8 text-velora-burgundy-dark shadow-[0_30px_80px_-48px_rgba(58,24,32,0.45)] transition duration-500 hover:-translate-y-1.5 sm:p-10"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-[0.32em] text-velora-champagne-dark">02</p>
            <span className="rounded-full border border-velora-champagne bg-[#f8f1e4] px-3 py-1 text-[11px] font-bold text-velora-burgundy">
              +{codFee} {currencyLabel} توصيل
            </span>
          </div>
          <h2 className="mt-10 font-display text-4xl font-bold leading-none">عند الاستلام</h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-velora-burgundy/70">
            صفحة خاصة للدفع عند الباب. تدفعين للمندوب كاش أو بطاقة، ورسوم التوصيل ثابتة.
          </p>
          <dl className="mt-8 space-y-3 border-t border-velora-burgundy/10 pt-6 text-sm">
            <div className="flex justify-between text-velora-burgundy/65">
              <dt>العرض</dt>
              <dd className="tabular-nums">{formatPrice(cardTotal)}</dd>
            </div>
            <div className="flex justify-between font-bold">
              <dt>رسوم التوصيل</dt>
              <dd className="tabular-nums text-velora-burgundy">+{codFee} {currencyLabel}</dd>
            </div>
          </dl>
          <div className="mt-auto pt-8">
            <p className="text-[11px] tracking-[0.22em] text-velora-burgundy/45">المجموع عند الباب</p>
            <p className="mt-2 font-display text-5xl font-bold tabular-nums">{formatPrice(codTotal)}</p>
            <span className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-velora-burgundy">
              ادخلي صفحة الاستلام
              <span aria-hidden className="transition group-hover:-translate-x-1">←</span>
            </span>
          </div>
        </Link>
      </div>

      {productSlug && (
        <p className="mt-10 text-center">
          <Link
            href={getProductPath(productSlug)}
            className="text-xs font-semibold tracking-wide text-velora-burgundy/50 underline-offset-4 hover:text-velora-burgundy hover:underline"
          >
            العودة للمنتج
          </Link>
        </p>
      )}
    </section>
  );
}

function CardMark() {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" fill="none" aria-hidden className="text-velora-champagne">
      <rect x="0.75" y="0.75" width="34.5" height="22.5" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M0 8h36" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 16h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
