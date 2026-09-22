"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brand } from "@/config/brand";

type Props = {
  variant?: "header" | "footer";
};

export function VeloraLogo({ variant = "header" }: Props) {
  const [failed, setFailed] = useState(false);
  const height = variant === "header" ? 44 : 52;

  return (
    <Link
      href="/"
      className="relative inline-flex shrink-0 items-center justify-center"
      aria-label={brand.nameAr}
    >
      {failed ? (
        <span
          className={`rounded-lg border border-dashed border-velora-champagne/40 px-4 py-2 text-center text-[11px] leading-snug text-velora-champagne/90 ${
            variant === "footer" ? "bg-white/5" : "bg-white/10"
          }`}
        >
          {brand.logo.placeholderLabel}
        </span>
      ) : (
        <Image
          src={brand.logo.src}
          alt={brand.nameAr}
          width={160}
          height={height}
          className="h-auto w-auto max-h-11 max-w-[9rem] object-contain md:max-h-12 md:max-w-[10rem]"
          priority
          onError={() => setFailed(true)}
        />
      )}
    </Link>
  );
}
