"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brand } from "@/config/brand";

type Props = {
  variant?: "header" | "footer";
  /** Burgundy homepage header — light wordmark on dark bar */
  onDark?: boolean;
};

export function VeloraLogo({ variant = "header", onDark = false }: Props) {
  const [failed, setFailed] = useState(false);
  const isFooter = variant === "footer";
  const lightText = isFooter || onDark;

  const markClass = isFooter
    ? "h-9 w-auto sm:h-10"
    : "h-7 w-auto sm:h-8 md:h-[2.125rem]";

  return (
    <Link
      href="/"
      className="group relative inline-flex shrink-0 flex-col items-center gap-px text-center outline-none transition-transform duration-200 ease-out hover:scale-[1.06] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-velora-champagne/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
      ) : (
        <>
          <Image
            src={brand.logo.markSrc}
            alt=""
            width={96}
            height={91}
            className={`object-contain ${markClass}`}
            priority={!isFooter}
            unoptimized
            onError={() => setFailed(true)}
          />
          <span
            className={`text-[8px] font-semibold lowercase tracking-[0.2em] sm:text-[9px] ${
              lightText ? "text-velora-cream/90" : "text-velora-burgundy-dark"
            }`}
          >
            {brand.logo.wordmarkEn}
          </span>
          <span
            className={`text-[9px] font-extrabold leading-none sm:text-[10px] ${
              lightText ? "text-velora-champagne-light" : "text-velora-burgundy"
            }`}
          >
            {brand.logo.wordmarkAr}
          </span>
        </>
      )}
    </Link>
  );
}
