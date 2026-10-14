"use client";

import Image from "next/image";
import { useState } from "react";
import { codThankYouCopy } from "@/config/codThankYouCopy";
import { codFee, currencyLabel, formatPrice } from "@/config/pricing";
import type { BundleQuantity } from "@/config/pricing";

type Props = {
  productName: string;
  quantity: BundleQuantity;
  image: { src: string; alt: string } | null;
  emirate: string;
  address: string;
  subtotalAed: number;
  deliveryFeeAed: number;
  totalAed: number;
};

export function CodThankYouOrderSummary(props: Props) {
  const [open, setOpen] = useState(false);
  const { summary } = codThankYouCopy;
  const qtyLabel =
    props.quantity === 1 ? "قطعة واحدة" : props.quantity === 2 ? "عرض ×2" : "عرض ×3";

  return (
    <section className="border-t border-velora-burgundy/8 px-5 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl bg-velora-cream/70 px-4 py-3 text-right text-sm font-bold text-velora-burgundy"
        aria-expanded={open}
      >
        {summary.toggle}
        <span className="text-velora-burgundy/50">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-3 rounded-2xl border border-velora-burgundy/10 bg-white p-4 text-right text-sm shadow-sm">
          <div className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-velora-cream">
              {props.image ? (
                <Image src={props.image.src} alt={props.image.alt} fill className="object-cover" sizes="64px" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-velora-burgundy-dark">{props.productName}</p>
              <p className="mt-1 text-xs text-velora-burgundy/55">
                {summary.offer}: {qtyLabel}
              </p>
              <p className="mt-2 text-xs text-velora-burgundy/65">
                {props.emirate} · {props.address}
              </p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 border-t border-velora-burgundy/10 pt-3 text-xs">
            <div className="flex justify-between">
              <dt className="text-velora-burgundy/60">{summary.subtotal}</dt>
              <dd className="font-semibold">{formatPrice(props.subtotalAed)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-velora-burgundy/60">{summary.shipping}</dt>
              <dd className="font-semibold">
                +{props.deliveryFeeAed || codFee} {currencyLabel}
              </dd>
            </div>
            <div className="flex justify-between border-t border-velora-burgundy/10 pt-2">
              <dt className="font-bold text-velora-burgundy">{summary.totalCod}</dt>
              <dd className="text-base font-black text-velora-burgundy">{formatPrice(props.totalAed)}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
