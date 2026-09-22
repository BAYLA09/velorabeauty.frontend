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

  return (
    <Link
      href="/"
      className="relative inline-flex shrink-0 flex-col items-center gap-0.5 text-center"
      aria-label={brand.nameAr}
    >
      {failed ? (
        <span
          className={`rounded-lg border border-dashed border-velora-champagne/40 px-4 py-2 text-center text-[11px] leading-snug text-velora-champagne/90 ${
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
            width={120}
            height={114}
            className="h-11 w-auto object-contain sm:h-12 md:h-[3.25rem]"
            priority
            onError={() => setFailed(true)}
          />
          <span
            className={`text-[10px] font-semibold lowercase tracking-[0.22em] sm:text-[11px] ${
              lightText ? "text-velora-cream/90" : "text-velora-burgundy-dark"
            }`}
          >
            {brand.logo.wordmarkEn}
          </span>
          <span
            className={`text-[11px] font-extrabold leading-none sm:text-xs ${
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
