"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  mainSrc: string;
  productName: string;
  placeholder: string;
  laraFrame?: boolean;
};

/** PDP gallery — صورة واحدة كاملة (بلا fill/crop) */
export function ProductGallery({ mainSrc, productName, placeholder, laraFrame = false }: Props) {
  const [failed, setFailed] = useState(false);

  const frameClass = laraFrame
    ? "overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-2xl"
    : "overflow-hidden rounded-[2rem] border border-velora-burgundy/10 bg-white shadow-lg";

  return (
    <div className="mx-auto w-full min-w-0 max-w-md self-start lg:max-w-lg">
      <div className={frameClass}>
        {failed ? (
          <div className="flex aspect-square items-center justify-center bg-velora-cream-dark p-6 text-center text-sm text-velora-burgundy/60">
            {placeholder}
          </div>
        ) : (
          <Image
            src={mainSrc}
            alt={productName}
            width={1254}
            height={1254}
            unoptimized
            priority
            className="block h-auto w-full"
            sizes="(max-width: 1024px) 92vw, 560px"
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
