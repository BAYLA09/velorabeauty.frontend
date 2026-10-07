function BrandMark({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex h-5 min-w-[28px] items-center justify-center rounded px-1 text-[8px] font-black leading-none ${className ?? ""}`}
    >
      {label}
    </span>
  );
}

function CardBrandStrip() {
  return (
    <div
      className="flex shrink-0 items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1.5"
      dir="ltr"
      aria-hidden
    >
      <BrandMark label="VISA" className="bg-[#1a1f71] text-white" />
      <BrandMark label="MC" className="bg-neutral-800 text-white" />
      <BrandMark label=" Pay" className="bg-black text-[7px] text-white" />
      <BrandMark label="G Pay" className="border border-neutral-300 bg-white text-[7px] text-neutral-700" />
    </div>
  );
}

type Props = {
  stripeEnabled?: boolean;
};

export function CheckoutCardPaymentBlock({ stripeEnabled = false }: Props) {
  return (
    <div className="space-y-4 border-t border-neutral-200/80 pt-8">
      <div>
        <h2 className="text-lg font-bold text-neutral-900">الدفع</h2>
        <p className="mt-1 text-xs text-neutral-500">جميع المعاملات آمنة ومشفّرة</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3.5">
          <span
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[6px] border-[#1773b0] bg-white"
            aria-hidden
          />
          <p className="min-w-0 flex-1 text-sm font-semibold text-neutral-900">الدفع بالبطاقة</p>
          <CardBrandStrip />
        </div>

        <div className="space-y-3 px-4 py-4">
          {stripeEnabled ? (
            <>
              <p className="text-sm font-medium text-neutral-800">
                الدفع عبر <span className="font-bold">Stripe</span> — Visa، Mastercard، Apple Pay، Google Pay
              </p>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                بالضغط على «الدفع بالبطاقة» ستُوجَّهين إلى صفحة Stripe الآمنة. لا نخزّن بيانات البطاقة على
                موقع فيلورا.
              </p>
            </>
          ) : (
            <>
              <label className="block">
                <span className="text-xs font-medium text-neutral-700">رقم البطاقة</span>
                <input
                  disabled
                  dir="ltr"
                  placeholder="1234 1234 1234 1234"
                  className="mt-2 w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-400"
                />
              </label>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                بعد تأكيد الطلب، نرسل لك رابط دفع آمن (SMS أو واتساب) لإكمال العملية.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
