"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  placeholder: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** cover = fill frame (may crop). contain = full image visible */
  fit?: "cover" | "contain";
};

export function VeloraImage({
  src,
  alt,
  placeholder,
  className = "",
  priority = false,
  sizes = "100vw",
  fit = "cover",
}: Props) {
  const [ready, setReady] = useState(false);
  const showPlaceholder = !ready;

  return (
    <div
      className={`relative overflow-hidden bg-velora-cream-dark ${className}`}
    >
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center transition-opacity duration-300 ${
          showPlaceholder ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showPlaceholder}
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
        <p className="max-w-[16rem] text-xs leading-relaxed text-velora-burgundy/55">
          {placeholder}
        </p>
      </div>
      <Image
        src={src}
        alt={alt}
        fill
        className={`transition-opacity duration-500 ${
          fit === "contain" ? "object-contain" : "object-cover"
        } ${showPlaceholder ? "opacity-0" : "opacity-100"}`}
        sizes={sizes}
        priority={priority}
        onLoad={() => setReady(true)}
        onError={() => setReady(false)}
      />
    </div>
  );
}
