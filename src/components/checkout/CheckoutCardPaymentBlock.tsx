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

export function CheckoutCardPaymentBlock() {
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

        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-start text-xs text-neutral-600"
          aria-expanded="false"
        >
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a5.25 5.25 0 0010.5 0v-3A5.25 5.25 0 0012 1.5zm-7.5 8.25v2.25a7.5 7.5 0 0015 0v-2.25h1.125A2.625 2.625 0 0121 12.375v4.125A2.625 2.625 0 0118.375 19.125H5.625A2.625 2.625 0 013 16.5V12.375a2.625 2.625 0 012.625-2.625H4.5z" />
            </svg>
            دفع آمن وسريع باستخدام Link
          </span>
          <svg className="h-4 w-4 shrink-0 text-neutral-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="space-y-4 border-t border-neutral-100 px-4 py-4">
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
            بعد تأكيد الطلب، نرسل لك رابط دفع آمن (SMS أو واتساب) لإكمال العملية — بدون حفظ بيانات البطاقة
            على الموقع.
          </p>
        </div>
      </div>
    </div>
  );
}
