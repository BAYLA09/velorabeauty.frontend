"use client";

import { useState } from "react";
import { ProductPageImage } from "./ProductPageImage";

type Props = {
  mainSrc?: string;
  productName: string;
  placeholder: string;
  laraFrame?: boolean;
  /** Nama-style: full width on mobile */
  fullWidthMobile?: boolean;
};

function EmptyImageSlot({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex min-h-[16rem] min-w-[16rem] items-center justify-center rounded-[1.25rem] border border-dashed border-velora-burgundy/15 bg-velora-cream-dark/50 ${className}`}
      aria-hidden
    />
  );
}

export function ProductGallery({
  mainSrc,
  productName,
  placeholder,
  laraFrame = false,
  fullWidthMobile = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const hasSrc = Boolean(mainSrc?.trim());

  return (
    <div className="w-full min-w-0">
      <div
        className={
          laraFrame
            ? `rounded-[2rem] border-8 border-white bg-white p-0 shadow-2xl ${
                fullWidthMobile ? "mx-auto w-full max-w-full lg:mx-0 lg:w-fit" : "mx-auto w-fit max-w-full lg:mx-0"
              }`
            : "mx-auto w-fit max-w-full rounded-[2rem] border border-velora-burgundy/10 bg-white shadow-lg"
        }
      >
        {!hasSrc ? (
          <EmptyImageSlot />
        ) : failed ? (
          <div className="flex min-h-[16rem] min-w-[16rem] items-center justify-center rounded-[1.25rem] bg-velora-cream-dark p-6 text-center text-sm text-velora-burgundy/60">
            {placeholder}
          </div>
        ) : (
          <ProductPageImage
            src={mainSrc!}
            alt={productName}
            priority
            className="rounded-[1.15rem]"
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
