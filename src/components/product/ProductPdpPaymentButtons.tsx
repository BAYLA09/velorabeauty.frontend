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
  return (
    <div className="space-y-3 pt-1" aria-label="اختيار طريقة الدفع">
      <button
        type="button"
        disabled={disabled}
        onClick={onCod}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#3a1820] to-[#2c1318] py-4 text-base font-black text-white shadow-[0_12px_32px_rgba(44,19,24,0.35)] transition hover:from-velora-burgundy hover:to-[#2c1318] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {codLabel}
        <span
          className="text-lg transition group-hover:translate-x-[-2px]"
          aria-hidden
        >
          ←
        </span>
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onCard}
        className="flex w-full items-center justify-center rounded-2xl border-2 border-velora-burgundy/20 bg-white py-4 text-base font-black text-velora-burgundy-dark shadow-sm transition hover:border-velora-burgundy/45 hover:bg-velora-cream-dark/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        ادفعي بالبطاقة
      </button>
      <p className="text-center text-[11px] font-medium leading-relaxed text-velora-burgundy/55">
        الدفع عند الاستلام: +{codFee} {currencyLabel} رسوم التوصيل · البطاقة: شحن مجاني
      </p>
    </div>
  );
}
