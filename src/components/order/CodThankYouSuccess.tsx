"use client";

import Link from "next/link";
import { codThankYouCopy } from "@/config/codThankYouCopy";
import { currencyLabel, formatPrice } from "@/config/pricing";
import type { OrderDraft } from "@/lib/orderStorage";
import { getProductPath } from "@/lib/productCatalog";

type Props = {
  order: OrderDraft;
  onNavigateAway?: () => void;
};

function StepIcon({ state }: { state: "done" | "active" | "upcoming" }) {
  if (state === "done") {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-velora-burgundy text-sm font-black text-velora-cream">
        ✓
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-velora-champagne/40 opacity-75" />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-velora-burgundy bg-white text-xs font-black text-velora-burgundy">
          ●
        </span>
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-velora-burgundy/20 bg-white text-xs text-velora-burgundy/35">
      ○
    </span>
  );
}

export function CodThankYouSuccess({ order, onNavigateAway }: Props) {
  const shortId = order.orderId?.slice(0, 8).toUpperCase() ?? "—";
  const steps = codThankYouCopy.steps;

  return (
    <div className="mx-auto max-w-lg">
      <p className="text-center text-[11px] font-bold tracking-[0.2em] text-velora-burgundy/50">
        {codThankYouCopy.eyebrow}
      </p>

      <div className="relative mt-4 overflow-hidden rounded-3xl border border-velora-burgundy/10 bg-gradient-to-b from-white to-velora-cream-dark/90 p-6 shadow-lg shadow-velora-burgundy/5 sm:p-8">
        <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-velora-champagne/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-6 h-36 w-36 rounded-full bg-velora-burgundy/10 blur-2xl" />

        <div className="relative flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-velora-burgundy text-4xl text-velora-cream shadow-md">
            ✓
          </div>
        </div>

        <h1 className="relative mt-6 text-center text-2xl font-black leading-snug text-velora-burgundy-dark sm:text-[1.65rem]">
          {codThankYouCopy.title}
        </h1>

        <p className="relative mt-4 text-center text-base leading-relaxed text-velora-burgundy/85">
          <span className="font-bold text-velora-burgundy-dark">{order.customerName}</span>
          ، {codThankYouCopy.lead}
        </p>

        <p className="relative mt-3 text-center text-sm font-semibold text-velora-burgundy">
          {codThankYouCopy.callWindow}
        </p>

        <div className="relative mt-6 grid grid-cols-2 gap-3">
          {codThankYouCopy.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-velora-champagne/50 bg-velora-cream/80 px-3 py-3 text-center"
            >
              <p className="text-xl font-black text-velora-burgundy">{stat.value}</p>
              <p className="mt-1 text-[10px] leading-snug text-velora-burgundy/65">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-6 rounded-2xl border-2 border-velora-burgundy/15 bg-velora-burgundy/[0.04] p-4 text-right">
          <p className="text-sm font-black text-velora-burgundy-dark">{codThankYouCopy.answerTitle}</p>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-velora-burgundy/80">
            {codThankYouCopy.answerBullets.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-velora-burgundy">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p
            className="mt-4 rounded-xl bg-white px-4 py-3 text-center text-lg font-black tracking-wide text-velora-burgundy-dark"
            dir="ltr"
          >
            {order.phone}
          </p>
        </div>
      </div>

      <ol className="mt-8 space-y-0 text-right" aria-label="مراحل الطلب">
        {steps.map((step, index) => {
          const state = index === 0 ? "done" : index === 1 ? "active" : "upcoming";
          const isLast = index === steps.length - 1;
          return (
            <li key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <StepIcon state={state} />
                {!isLast && (
                  <span
                    className={`my-1 w-0.5 flex-1 min-h-[2rem] ${
                      index === 0 ? "bg-velora-burgundy" : "bg-velora-burgundy/15"
                    }`}
                    aria-hidden
                  />
                )}
              </div>
              <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                <p
                  className={`text-sm font-bold ${
                    state === "active" ? "text-velora-burgundy" : "text-velora-burgundy-dark"
                  }`}
                >
                  {step.label}
                  {state === "active" && (
                    <span className="mr-2 inline-block rounded-full bg-velora-champagne/60 px-2 py-0.5 text-[10px] font-bold text-velora-burgundy">
                      الآن
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-velora-burgundy/60">{step.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-velora-burgundy/10 bg-white p-5 text-right text-sm shadow-sm">
        <p className="text-[11px] font-bold tracking-wide text-velora-burgundy/45">
          رقم الطلب · {shortId}
        </p>
        <p className="mt-1 font-bold text-velora-burgundy">{order.productName}</p>
        <p className="mt-2 text-velora-burgundy/70">
          {order.emirate} — {order.address}
        </p>
        <p className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-velora-burgundy/10 pt-3">
          <span className="text-velora-burgundy/75">الدفع عند الاستلام</span>
          <span className="text-xl font-black text-velora-burgundy">{formatPrice(order.totalAed)}</span>
        </p>
        {(order.deliveryFeeAed ?? 0) > 0 && (
          <p className="mt-2 text-xs text-velora-burgundy/55">
            يشمل رسوم التوصيل +{order.deliveryFeeAed} {currencyLabel}
          </p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-velora-burgundy/55">
          {codThankYouCopy.paymentReminder}
        </p>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-velora-burgundy/55">
        {codThankYouCopy.patience}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {order.productSlug && order.productSlug !== "velora-offer" && (
          <Link
            href={getProductPath(order.productSlug)}
            className="rounded-full border border-velora-burgundy/20 bg-white px-6 py-3 text-center text-sm font-bold text-velora-burgundy"
            onClick={onNavigateAway}
          >
            {codThankYouCopy.productCta}
          </Link>
        )}
        <Link
          href="/"
          className="rounded-full bg-velora-burgundy px-6 py-3 text-center text-sm font-bold text-velora-cream"
          onClick={onNavigateAway}
        >
          {codThankYouCopy.homeCta}
        </Link>
      </div>
    </div>
  );
}
