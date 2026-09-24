"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  onError?: () => void;
};

/** PDP — Next يضغّط PNG الكبيرة + الصورة تظهر تدريجياً (ما نخبّيهاش حتى التحميل الكامل) */
export function ProductPageImage({
  src,
  alt,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 92vw, (max-width: 1200px) 50vw, 560px",
  onError,
}: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  if (failed) {
    return (
      <div
        className={`flex min-h-[12rem] items-center justify-center bg-velora-cream-dark text-sm text-velora-burgundy/50 ${className}`}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div className={`relative w-full min-h-[8rem] ${className}`}>
      <div
        className={`absolute inset-0 animate-pulse rounded-[inherit] bg-velora-cream-dark/80 transition-opacity duration-200 ${
          loaded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={loaded}
      />
      <Image
        src={src}
        alt={alt}
        width={1400}
        height={1400}
        sizes={sizes}
        priority={priority}
        quality={92}
        className="relative z-[1] block h-auto w-full max-w-full"
        style={{ width: "100%", height: "auto" }}
        onLoad={() => setLoaded(true)}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          onError?.();
        }}
      />
    </div>
  );
}
