import { checkoutPaymentCopy } from "@/config/checkoutTrust";
import { PaymentBrandStrip } from "@/components/checkout/PaymentBrandStrip";

function IconLockSmall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a5.25 5.25 0 0010.5 0v-3A5.25 5.25 0 0012 1.5zm-7.5 8.25v2.25a7.5 7.5 0 0015 0v-2.25h1.125A2.625 2.625 0 0121 12.375v4.125A2.625 2.625 0 0118.375 19.125H5.625A2.625 2.625 0 013 16.5V12.375a2.625 2.625 0 012.625-2.625H4.5z" />
    </svg>
  );
}

const mockInputClass =
  "mt-1.5 w-full cursor-not-allowed rounded-md border border-[#d9d9d9] bg-neutral-50 px-3.5 py-3 text-sm text-neutral-400 outline-none";

function CardFieldIcons() {
  return (
    <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center gap-1" dir="ltr">
      <span className="rounded bg-[#f76f1b] px-1 text-[7px] font-black text-white">DISC</span>
      <span className="rounded bg-[#006fcf] px-1 text-[7px] font-black text-white">AMEX</span>
      <span className="rounded bg-[#1a1f71] px-1 text-[7px] font-black text-white">VISA</span>
      <span className="rounded bg-neutral-800 px-1 text-[7px] font-black text-white">MC</span>
    </div>
  );
}

type Props = {
  stripeEnabled?: boolean;
};

export function CheckoutCardPaymentBlock({ stripeEnabled = false }: Props) {
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

        {stripeEnabled ? (
          <div className="space-y-3 bg-white p-4 sm:p-5">
            <p className="text-sm font-medium text-neutral-800">
              الدفع عبر <span className="font-bold">Stripe</span> — Visa، Mastercard، Apple Pay، Google Pay
            </p>
            <p className="text-[11px] leading-relaxed text-neutral-500">
              بالضغط على «الدفع بالبطاقة الآن» ستُوجَّهين إلى صفحة Stripe الآمنة. {checkoutPaymentCopy.noCardStorage}
            </p>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 border-b border-[#d9d9d9] px-4 py-3 text-start text-xs text-neutral-600"
              aria-expanded="false"
            >
              <span className="inline-flex items-center gap-1.5">
                <IconLockSmall className="h-3.5 w-3.5 text-emerald-600" />
                دفع آمن وسريع باستخدام Link
              </span>
              <svg
                className="h-4 w-4 shrink-0 text-neutral-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="space-y-4 bg-white p-4 sm:p-5">
              <label className="block">
                <span className="text-sm font-medium text-neutral-800">رقم البطاقة</span>
                <div className="relative">
                  <input
                    disabled
                    dir="ltr"
                    placeholder="1234 1234 1234 1234"
                    className={`${mockInputClass} pe-28`}
                  />
                  <CardFieldIcons />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-medium text-neutral-800">تاريخ الانتهاء</span>
                  <input disabled dir="ltr" placeholder="شهر / سنة" className={mockInputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-neutral-800">رمز الأمان (CVC)</span>
                  <div className="relative">
                    <input disabled dir="ltr" placeholder="CVC" className={`${mockInputClass} pe-10`} />
                    <svg
                      className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </div>
                </label>
              </div>
            </div>
          </>
        )}
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
