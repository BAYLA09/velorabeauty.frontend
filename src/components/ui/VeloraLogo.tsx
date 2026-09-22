"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brand } from "@/config/brand";

type Props = {
  variant?: "header" | "footer";
  /** Burgundy homepage header — light wordmark on dark bar */
  onDark?: boolean;
  /** row = Lara-style: نص + V جنب بعض */
  layout?: "stack" | "row";
};

export function VeloraLogo({ variant = "header", onDark = false, layout = "stack" }: Props) {
  const [failed, setFailed] = useState(false);
  const isFooter = variant === "footer";
  const lightText = isFooter || onDark;
  const isRow = layout === "row" && !isFooter;

  const markClass = isFooter
    ? "h-9 w-auto sm:h-10"
    : isRow
      ? "h-8 w-auto shrink-0 sm:h-9"
      : "h-7 w-auto sm:h-8 md:h-[2.125rem]";

  const textBlock = (
    <>
      <span
        className={`font-extrabold leading-tight ${
          isRow ? "text-[11px] sm:text-xs" : "text-[9px] sm:text-[10px]"
        } ${lightText ? "text-velora-champagne-light" : "text-velora-burgundy"}`}
      >
        {brand.logo.wordmarkAr}
      </span>
      <span
        className={`font-semibold lowercase leading-none ${
          isRow ? "text-[9px] tracking-[0.18em] sm:text-[10px]" : "text-[8px] tracking-[0.2em] sm:text-[9px]"
        } ${lightText ? "text-velora-cream/90" : "text-velora-burgundy-dark"}`}
      >
        {brand.logo.wordmarkEn}
      </span>
    </>
  );

  return (
    <Link
      href="/"
      className="group relative inline-flex shrink-0 outline-none transition-transform duration-200 ease-out hover:scale-[1.04] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-velora-champagne/50 focus-visible:ring-offset-2"
      aria-label={brand.nameAr}
    >
      {failed ? (
        <span
          className={`rounded-lg border border-dashed border-velora-champagne/40 px-3 py-1.5 text-center text-[10px] leading-snug text-velora-champagne/90 ${
            isFooter ? "bg-white/5" : "bg-white/10"
          }`}
        >
          {brand.logo.placeholderLabel}
        </span>
      ) : isRow ? (
        <span className="flex items-center gap-2">
          <span className="flex flex-col items-end gap-0.5 text-right">{textBlock}</span>
          <Image
            src={brand.logo.markSrc}
            alt=""
            width={72}
            height={68}
            className={markClass}
            priority
            unoptimized
            onError={() => setFailed(true)}
          />
        </span>
      ) : (
        <span className="flex flex-col items-center gap-px text-center">
          <Image
            src={brand.logo.markSrc}
            alt=""
            width={96}
            height={91}
            className={markClass}
            priority={!isFooter}
            unoptimized
            onError={() => setFailed(true)}
          />
          {textBlock}
        </span>
      )}
    </Link>
  );
}
