"use client";

import { PaymentElement } from "@stripe/react-stripe-js";
import { useCheckoutStripe } from "@/components/checkout/CheckoutStripeElementsProvider";
import { PaymentBrandStrip } from "@/components/checkout/PaymentBrandStrip";
import { checkoutPaymentCopy } from "@/config/checkoutTrust";

function IconLockSmall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a5.25 5.25 0 0010.5 0v-3A5.25 5.25 0 0012 1.5zm-7.5 8.25v2.25a7.5 7.5 0 0015 0v-2.25h1.125A2.625 2.625 0 0121 12.375v4.125A2.625 2.625 0 0118.375 19.125H5.625A2.625 2.625 0 013 16.5V12.375a2.625 2.625 0 012.625-2.625H4.5z" />
    </svg>
  );
}

export function CheckoutStripePaymentElement() {
  const { setPaymentReady } = useCheckoutStripe();

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-extrabold text-neutral-900">الدفع</h2>
        <p className="mt-0.5 text-sm text-neutral-500">جميع المعاملات آمنة ومشفّرة</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#d9d9d9] bg-white">
        <div className="border-b border-[#d9d9d9] bg-[#fafafa] px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <label className="flex min-w-0 cursor-default items-center gap-2">
              <span
                className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[5px] border-[#1773b0] bg-white"
                aria-hidden
              />
              <span className="text-sm font-bold text-neutral-900 sm:text-[15px]">الدفع بالبطاقة</span>
            </label>
            <PaymentBrandStrip size="xs" align="end" className="sm:shrink-0" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5">
          <PaymentElement
            id="card-payment-element"
            options={{
              layout: "tabs",
              wallets: { applePay: "auto", googlePay: "auto" },
              fields: { billingDetails: { address: "never" } },
              terms: { card: "never" },
            }}
            onReady={() => setPaymentReady(true)}
            onLoadError={() => setPaymentReady(false)}
          />
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 text-[11px] text-neutral-500">
        <IconLockSmall className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          {checkoutPaymentCopy.secureStripe}. {checkoutPaymentCopy.noCardStorage}
        </span>
      </div>
    </section>
  );
}
