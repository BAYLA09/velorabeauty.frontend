"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  name: string;
  imageSrc?: string;
  size?: "md" | "lg";
};

export function TestimonialAvatar({ name, imageSrc, size = "md" }: Props) {
  const [failed, setFailed] = useState(false);
  const dim = size === "lg" ? "h-24 w-24 text-2xl" : "h-16 w-16 text-lg";
  const initial = name.trim().charAt(0) || "ف";

  if (imageSrc && !failed) {
    return (
      <div
        className={`relative ${dim} shrink-0 overflow-hidden rounded-full border-2 border-velora-champagne/45 bg-velora-cream`}
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="96px"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full border-2 border-velora-champagne/40 bg-velora-burgundy font-bold text-velora-cream`}
      aria-hidden
    >
      {initial}
    </div>
  );
}
