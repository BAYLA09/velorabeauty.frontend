"use client";

import { useState } from "react";
import { ProductPageImage } from "./ProductPageImage";

type Props = {
  mainSrc: string;
  productName: string;
  placeholder: string;
  laraFrame?: boolean;
};

export function ProductGallery({ mainSrc, productName, placeholder, laraFrame = false }: Props) {
  const [failed, setFailed] = useState(false);

  const frameClass = laraFrame
    ? "inline-block max-w-full overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-2xl"
    : "inline-block max-w-full overflow-hidden rounded-[2rem] border border-velora-burgundy/10 bg-white shadow-lg";

  return (
    <div className="w-full min-w-0">
      <div className={frameClass}>
        {failed ? (
          <div className="flex aspect-square min-w-[16rem] items-center justify-center bg-velora-cream-dark p-6 text-center text-sm text-velora-burgundy/60">
            {placeholder}
          </div>
        ) : (
          <ProductPageImage
            src={mainSrc}
            alt={productName}
            priority
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
