import Link from "next/link";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { FooterSection } from "@/components/FooterSection";
import {
  STRIPE_TEST_PRICE_AED,
  STRIPE_TEST_PRODUCT_NAME,
  STRIPE_TEST_PRODUCT_NUMBER,
  STRIPE_TEST_USD_HINT,
} from "@/config/stripeTestCheckout";
import { formatPrice } from "@/config/pricing";

type Props = {
  cardCheckoutHref: string;
};

export function StripeTestProductPage({ cardCheckoutHref }: Props) {
  return (
    <>
      <ProductStoreHeader />
      <main className="min-h-[70vh] bg-gradient-to-b from-velora-cream via-white to-velora-cream-dark/40 px-4 py-10 sm:py-14">
        <article className="mx-auto max-w-lg overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_48px_rgba(58,24,32,0.12)] ring-1 ring-velora-burgundy/10">
          <header className="bg-gradient-to-br from-velora-burgundy to-velora-burgundy-dark px-6 py-10 text-center text-velora-cream">
            <p className="text-[11px] font-bold tracking-[0.2em] text-velora-cream/75">
              منتج {STRIPE_TEST_PRODUCT_NUMBER} · اختبار داخلي
            </p>
            <h1 className="mt-3 font-display text-2xl font-black">{STRIPE_TEST_PRODUCT_NAME}</h1>
            <p className="mt-2 text-sm text-velora-cream/85">
              {formatPrice(STRIPE_TEST_PRICE_AED)} · {STRIPE_TEST_USD_HINT} — للتأكد من Stripe Live
            </p>
          </header>

          <div className="space-y-5 px-6 py-8 text-right text-sm text-velora-burgundy/80">
            <p>
              هاد الصفحة <strong className="text-velora-burgundy-dark">ما كتبانش</strong> فالرئيسية.
              غير للتجربة: طلب حقيقي بـ <strong>{STRIPE_TEST_PRICE_AED} د.إ</strong> على البطاقة.
            </p>
            <ul className="list-inside list-disc space-y-2 text-xs leading-relaxed text-velora-burgundy/70">
              <li>ما تستعمليش بطاقة 4242… — Live keys فقط.</li>
              <li>بعد الدفع → <span dir="ltr">/checkout/success</span></li>
              <li>الطلب كيتسجّل فالـ DB + Google Sheet (card) إلا متفعّل.</li>
            </ul>

            <Link
              href={cardCheckoutHref}
              className="flex w-full items-center justify-center rounded-full bg-emerald-700 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
            >
              ادفعي {formatPrice(STRIPE_TEST_PRICE_AED)} بالبطاقة
            </Link>

            <Link
              href="/"
              className="block text-center text-xs font-semibold text-velora-burgundy/50 underline-offset-2 hover:underline"
            >
              الرئيسية
            </Link>
          </div>
        </article>
      </main>
      <FooterSection />
    </>
  );
}
