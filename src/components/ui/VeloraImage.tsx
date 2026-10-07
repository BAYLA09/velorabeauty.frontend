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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-velora-cream-dark ${className}`}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs leading-relaxed text-velora-burgundy/55">
          {placeholder}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className={fit === "contain" ? "object-contain" : "object-cover"}
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
