"use client";

import Link from "next/link";
import { codThankYouCopy } from "@/config/codThankYouCopy";
import { formatPrice } from "@/config/pricing";
import type { OrderDraft } from "@/lib/orderStorage";

type Props = {
  order: OrderDraft;
  onNavigateAway?: () => void;
};

function CheckIcon() {
  return (
    <svg
      className="h-7 w-7 text-velora-burgundy"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CodThankYouSuccess({ order, onNavigateAway }: Props) {
  const shortId = order.orderId?.slice(0, 8).toUpperCase() ?? "—";
  const journey = codThankYouCopy.journey;

  return (
    <div className="mx-auto max-w-[420px] px-1">
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-velora-burgundy/15 bg-white shadow-[0_8px_30px_rgba(91,30,46,0.08)]"
          aria-hidden
        >
          <CheckIcon />
        </div>

        <p className="mt-8 text-[11px] font-semibold tracking-[0.28em] text-velora-burgundy/40">
          VELORA
        </p>

        <h1 className="mt-2 text-[1.75rem] font-semibold leading-tight text-velora-burgundy-dark sm:text-[2rem]">
          شكراً،{" "}
          <span className="font-bold">{order.customerName.split(/\s+/)[0] ?? order.customerName}</span>
        </h1>

        <p className="mt-3 max-w-[18rem] text-[15px] leading-relaxed text-velora-burgundy/65">
          {codThankYouCopy.subtitle}
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-[1.35rem] bg-velora-burgundy text-velora-cream shadow-lg shadow-velora-burgundy/20">
        <div className="px-6 py-8">
          <p className="text-center text-[11px] font-medium tracking-wide text-velora-cream/70">
            {codThankYouCopy.phoneHint}
          </p>
          <p
            className="mt-3 text-center text-[1.65rem] font-semibold tabular-nums tracking-wide sm:text-[1.85rem]"
            dir="ltr"
          >
            {order.phone}
          </p>
        </div>
        <div
          className="grid grid-cols-4 gap-1 border-t border-white/10 bg-black/10 px-3 py-4"
          role="list"
          aria-label="مراحل الطلب"
        >
          {journey.map((step, index) => {
            const done = index === 0;
            const active = index === 1;
            return (
              <div key={step.id} role="listitem" className="flex flex-col items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    done
                      ? "bg-velora-cream"
                      : active
                        ? "bg-velora-cream shadow-[0_0_0_3px_rgba(255,250,245,0.35)]"
                        : "border border-velora-cream/40"
                  }`}
                  aria-hidden
                />
                <span
                  className={`max-w-[4.25rem] text-center text-[9px] leading-tight sm:text-[10px] ${
                    active ? "font-bold text-velora-cream" : "text-velora-cream/55"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <article className="mt-10 rounded-2xl border border-velora-burgundy/8 bg-white/80 p-5 text-right backdrop-blur-sm">
        <div className="flex items-baseline justify-between gap-3 border-b border-velora-burgundy/8 pb-4">
          <span className="text-[10px] font-semibold tracking-wide text-velora-burgundy/40">
            {codThankYouCopy.orderRef} · {shortId}
          </span>
          <span className="text-lg font-bold tabular-nums text-velora-burgundy">
            {formatPrice(order.totalAed)}
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-velora-burgundy-dark">{order.productName}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-velora-burgundy/55">
          {order.emirate} · {order.address}
        </p>
        <p className="mt-4 text-[11px] text-velora-burgundy/45">{codThankYouCopy.codShort}</p>
      </article>

      <div className="mt-10 flex flex-col items-center gap-4">
        <Link
          href="/"
          className="inline-flex min-w-[12rem] items-center justify-center rounded-full bg-velora-burgundy px-8 py-3.5 text-sm font-bold text-velora-cream transition hover:bg-velora-burgundy-dark"
          onClick={onNavigateAway}
        >
          {codThankYouCopy.homeCta}
        </Link>
      </div>
    </div>
  );
}
