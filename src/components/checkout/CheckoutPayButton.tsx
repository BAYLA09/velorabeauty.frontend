import { formatPrice } from "@/config/pricing";

function IconLock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a5.25 5.25 0 0010.5 0v-3A5.25 5.25 0 0012 1.5zm-7.5 8.25v2.25a7.5 7.5 0 0015 0v-2.25h1.125A2.625 2.625 0 0121 12.375v4.125A2.625 2.625 0 0118.375 19.125H5.625A2.625 2.625 0 013 16.5V12.375a2.625 2.625 0 012.625-2.625H4.5z" />
    </svg>
  );
}

function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

type Props = {
  totalAed: number;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  hint?: string;
};

export function CheckoutPayButton({
  totalAed,
  loading,
  loadingLabel = "جاري التأكيد…",
  disabled,
  hint,
}: Props) {
  return (
    <div className="space-y-3">
      <button
        type="submit"
        disabled={disabled || loading}
        className="flex w-full items-center justify-between gap-3 rounded-xl bg-[#134E3A] px-4 py-4 text-base font-extrabold text-white shadow-sm transition hover:bg-[#0f3d2e] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <IconLock className="h-5 w-5 shrink-0 opacity-90" />
        <span className="flex-1 text-center">
          {loading ? loadingLabel : `الدفع بالبطاقة الآن — ${formatPrice(totalAed)}!`}
        </span>
        <IconArrowLeft className="h-5 w-5 shrink-0 opacity-90" />
      </button>
      {hint ? (
        <p className="text-center text-[11px] leading-relaxed text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}
