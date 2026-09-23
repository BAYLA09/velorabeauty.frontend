export function ProductTrustBar() {
  return (
    <div className="bg-[#2c1318] text-velora-cream border-y border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
          {/* Item 1: COD */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-velora-champagne/40 bg-white/5 text-velora-champagne">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold leading-snug">الدفع عند الاستلام</p>
              <p className="text-[10px] sm:text-xs text-velora-cream/60">بدون دفع أونلاين</p>
            </div>
          </div>

          {/* Item 2: Delivery */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-velora-champagne/40 bg-white/5 text-velora-champagne">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold leading-snug">توصيل 1-3 أيام</p>
              <p className="text-[10px] sm:text-xs text-velora-cream/60">كل مدن الإمارات</p>
            </div>
          </div>

          {/* Item 3: Guarantee */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-velora-champagne/40 bg-white/5 text-velora-champagne">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold leading-snug">ضمان 30 يوم</p>
              <p className="text-[10px] sm:text-xs text-velora-cream/60">استرجاع كامل</p>
            </div>
          </div>

          {/* Item 4: Licensed */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-velora-champagne/40 bg-white/5 text-velora-champagne">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold leading-snug">مرخّص ومعتمد</p>
              <p className="text-[10px] sm:text-xs text-velora-cream/60">حلال • جودة ممتازة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
