"use client";

import { codFee, currencyLabel } from "@/config/pricing";

type Props = {
  codLabel: string;
  onCod: () => void;
  onCard: () => void;
  disabled?: boolean;
};

/** Mobile-first COD + card choice under PDP offer cards. */
export function ProductPdpPaymentButtons({
  codLabel,
  onCod,
  onCard,
  disabled = false,
}: Props) {
  const codShippingLabel = `+${codFee} ${currencyLabel} رسوم الشحن`;

  return (
    <div className="space-y-3 pt-1" aria-label="اختيار طريقة الدفع">
      <button
        type="button"
        disabled={disabled}
        onClick={onCod}
        className="group flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-b from-[#3a1820] to-[#2c1318] px-3 py-4 text-center shadow-[0_12px_32px_rgba(44,19,24,0.35)] transition hover:from-velora-burgundy hover:to-[#2c1318] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex items-center justify-center gap-2 text-base font-black text-white sm:text-lg">
          {codLabel}
          <span
            className="text-lg transition group-hover:translate-x-[-2px]"
            aria-hidden
          >
            ←
          </span>
        </span>
        <span className="text-[12px] font-bold tabular-nums text-[#FCE8E5]/95 sm:text-[13px]">
          {codShippingLabel}
        </span>
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onCard}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-velora-burgundy/20 bg-white px-3 py-4 text-center shadow-sm transition hover:border-velora-burgundy/45 hover:bg-velora-cream-dark/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-base font-black text-velora-burgundy-dark sm:text-lg">
          ادفعي بالبطاقة
        </span>
        <span
          className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-extrabold text-emerald-800 ring-1 ring-emerald-200/80 sm:text-[13px]"
        >
          شحن مجاني
        </span>
      </button>
    </div>
  );
}
