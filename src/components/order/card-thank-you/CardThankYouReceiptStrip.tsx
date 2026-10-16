"use client";

import { useState } from "react";
import { cardThankYouCopy } from "@/config/cardThankYouCopy";

type Props = {
  orderRef: string;
  totalAed: number;
  isPaid: boolean;
};

export function CardThankYouReceiptStrip({ orderRef, totalAed, isPaid }: Props) {
  const [copied, setCopied] = useState(false);
  const { receipt } = cardThankYouCopy;

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(orderRef);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-5 space-y-3">
      <p
        className={`rounded-2xl px-4 py-3.5 text-right text-xs leading-relaxed ring-1 ${
          isPaid
            ? "bg-emerald-50 text-emerald-950 ring-emerald-200/90"
            : "bg-amber-50 text-amber-950 ring-amber-200/80"
        }`}
      >
        {isPaid ? receipt.charged(totalAed) : cardThankYouCopy.status.pending}
      </p>
      <button
        type="button"
        onClick={() => void copyRef()}
        className="flex w-full items-center justify-between rounded-xl border border-velora-burgundy/10 bg-white px-4 py-2.5 text-xs font-bold text-velora-burgundy transition hover:bg-velora-cream/80"
      >
        <span dir="ltr" className="tabular-nums text-velora-burgundy-dark">
          #{orderRef}
        </span>
        <span className="text-velora-burgundy/70">{copied ? receipt.copied : receipt.copyRef}</span>
      </button>
    </div>
  );
}
