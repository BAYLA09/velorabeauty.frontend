import Link from "next/link";
import { ProductStoreHeader } from "@/components/product/ProductStoreHeader";
import { FooterSection } from "@/components/FooterSection";
import {
  STRIPE_TEST_PRICE_AED,
  STRIPE_TEST_PRODUCT_SLUG,
} from "@/config/stripeTestCheckout";

/** Shown when test PDP URL is hit but STRIPE_TEST_CHECKOUT_ENABLED is off. */
export function StripeTestProductSetupPage() {
  return (
    <>
      <ProductStoreHeader />
      <main className="min-h-[70vh] bg-velora-cream px-4 py-12">
        <article className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50/90 p-6 text-right shadow-sm">
          <h1 className="text-lg font-bold text-amber-950">صفحة اختبار Stripe — غير مفعّلة بعد</h1>
          <p className="mt-3 text-sm leading-relaxed text-amber-900/90">
            الكود موجود ({STRIPE_TEST_PRODUCT_SLUG})، ولكن السيرفر ما عندوش المتغيّر التالي:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-white p-3 text-left text-xs text-neutral-800 ring-1 ring-amber-200/80" dir="ltr">
            STRIPE_TEST_CHECKOUT_ENABLED=true{"\n"}
            # optional: STRIPE_TEST_CHECKOUT_TOKEN=your-secret
          </pre>
          <p className="mt-4 text-sm text-amber-900/85">
            Easypanel → Environment → أضيفي السطر → <strong>Deploy</strong> (أو Restart). من بعد
            تحقّقي: <span dir="ltr">/api/health</span> →{" "}
            <code className="rounded bg-white px-1 text-xs">stripeTestCheckoutEnabled: true</code>
          </p>
          <p className="mt-3 text-xs text-amber-800/80">
            السعر عند التفعيل: {STRIPE_TEST_PRICE_AED} د.إ (~5 USD) — دفع Live بالبطاقة.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-semibold text-velora-burgundy underline-offset-2 hover:underline"
          >
            الرئيسية
          </Link>
        </article>
      </main>
      <FooterSection />
    </>
  );
}
