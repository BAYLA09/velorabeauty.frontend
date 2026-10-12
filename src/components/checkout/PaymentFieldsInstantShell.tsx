/** Static card fields — first paint before Stripe iframe (no pulse / spinner). */
export function PaymentFieldsInstantShell() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="flex gap-1 rounded-md border border-[#e6e6e6] bg-[#fafafa] p-1">
        <span className="flex-1 rounded bg-white px-3 py-2 text-center text-xs font-bold text-neutral-800 shadow-sm">
          بطاقة
        </span>
        <span className="flex-1 rounded px-3 py-2 text-center text-xs font-medium text-neutral-400">
          Apple Pay
        </span>
      </div>
      <div>
        <p className="mb-1.5 text-[13px] font-medium text-[#30313d]">رقم البطاقة</p>
        <div className="flex h-11 items-center rounded-md border border-[#e6e6e6] bg-white px-3 text-sm text-neutral-400 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
          1234 1234 1234 1234
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1.5 text-[13px] font-medium text-[#30313d]">تاريخ الانتهاء</p>
          <div className="flex h-11 items-center rounded-md border border-[#e6e6e6] bg-white px-3 text-sm text-neutral-400 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
            MM / YY
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[13px] font-medium text-[#30313d]">رمز الأمان</p>
          <div className="flex h-11 items-center rounded-md border border-[#e6e6e6] bg-white px-3 text-sm text-neutral-400 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
            CVC
          </div>
        </div>
      </div>
    </div>
  );
}
