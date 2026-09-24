"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  placeholder: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** cover = fill frame (may crop). contain = full image visible */
  fit?: "cover" | "contain";
  /** Skip Next optimizer — sharper for large PNG product shots */
  sharp?: boolean;
};

export function VeloraImage({
  src,
  alt,
  placeholder,
  className = "",
  priority = false,
  sizes = "100vw",
  fit = "cover",
  sharp = false,
}: Props) {
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  useEffect(() => {
    setPlaceholderVisible(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-velora-cream-dark ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={sharp}
        quality={sharp ? undefined : 85}
        className={`${fit === "contain" ? "object-contain" : "object-cover"}`}
        sizes={sizes}
        priority={priority}
        onLoad={() => setPlaceholderVisible(false)}
        onLoadingComplete={() => setPlaceholderVisible(false)}
      />
      <div
        className={`absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 bg-velora-cream-dark px-4 text-center transition-opacity duration-200 ${
          placeholderVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!placeholderVisible}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-velora-burgundy/15 bg-white/60">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-velora-burgundy/35"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M4 16l4-5 4 3 4-6 4 8H4z" />
            <circle cx="8" cy="7" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <p className="max-w-[16rem] text-xs leading-relaxed text-velora-burgundy/55">{placeholder}</p>
      </div>
    </div>
  );
}
